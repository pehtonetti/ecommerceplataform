'use server'

import { prisma } from "@/lib/prisma";
import { calculateShipping } from "@/lib/shipping";
import { revalidatePath } from "next/cache";
import { calculatePointsEarned } from "@/lib/loyalty";
import { getStoreId } from "@/backend/lib/store-context";

interface CheckoutData {
    userId: string;
    addressId: string;
    shippingMethod: string;
    couponId?: string;
    couponCode?: string;
    loyaltyPointsToUse?: number;
}

/**
 * Finaliza o pedido (cria Order a partir do Cart)
 */
export async function createOrder(data: CheckoutData) {
    try {
        const storeId = await getStoreId();
        // 1. Buscar carrinho do usuário
        const cart = await prisma.cart.findUnique({
            where: { userId: data.userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            return { success: false, error: 'Carrinho vazio' };
        }

        // 2. Buscar endereço
        const address = await prisma.address.findUnique({
            where: { id: data.addressId }
        });

        if (!address) {
            return { success: false, error: 'Endereço não encontrado' };
        }

        // 3. Validar estoque
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                return { success: false, error: `Produto "${item.product.name}" sem estoque suficiente`
                };
            }
        }

        // 4. Calcular subtotal
        const subtotal = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        // 5. Buscar custo de frete real (recalcular no servidor para evitar fraude)
        const { calculateCartDimensions } = await import("@/lib/shipping");
        
        const dimensions = calculateCartDimensions(cart.items.map((item: any) => ({
            weight: item.product.weight,
            length: item.product.length,
            width: item.product.width,
            height: item.product.height,
            quantity: item.quantity
        })));

        const storeConfig = await prisma.storeConfig.findFirst();
        const originZipCode = storeConfig?.originZipCode || '01310-100';

        const quotes = await calculateShipping({
            fromZipCode: originZipCode,
            toZipCode: address.zipCode,
            ...dimensions
        });

        const selectedShipping = quotes.find(q => q.service === data.shippingMethod);

        if (!selectedShipping) {
            return { success: false, error: 'Método de frete inválido' };
        }

        const shippingCost = selectedShipping.price;

        // 6. Processar cupom de desconto
        let couponId: string | undefined;
        let discountAmount = 0;

        if (data.couponId) {
            const coupon = await prisma.coupon.findUnique({
                where: { id: data.couponId }
            });

            if (coupon && coupon.active) {
                const now = new Date();
                if ((!coupon.validUntil || coupon.validUntil > now) &&
                    (!coupon.minPurchaseAmount || subtotal >= coupon.minPurchaseAmount)) {

                    if (coupon.discountType === 'percentage') {
                        discountAmount = Math.round(subtotal * (coupon.discountValue / 100));
                    } else {
                        discountAmount = coupon.discountValue;
                    }
                    couponId = coupon.id;
                }
            }
        } else if (data.couponCode) {
            const { validateCoupon } = await import('./coupon-actions');
            const couponResult = await validateCoupon(data.couponCode, subtotal);
            if (couponResult.valid && couponResult.coupon) {
                const coupon = couponResult.coupon;
                if (coupon.discountType === 'percentage') {
                    discountAmount = Math.round(subtotal * (coupon.discountValue / 100));
                } else {
                    discountAmount = coupon.discountValue;
                }
                couponId = coupon.id;
            }
        }

        // 7. Processar pontos de fidelidade
        let loyaltyPointsUsed = 0;
        let loyaltyDiscount = 0;

        if (data.loyaltyPointsToUse && data.loyaltyPointsToUse > 0) {
            const { validatePointsUsage } = await import('./loyalty-actions');
            const pointsResult = await validatePointsUsage(
                data.loyaltyPointsToUse,
                subtotal - discountAmount
            );

            if (pointsResult.error) {
                return { success: false, error: pointsResult.error };
            }

            if (pointsResult.discountAmount) {
                loyaltyPointsUsed = data.loyaltyPointsToUse;
                loyaltyDiscount = pointsResult.discountAmount;
            }
        }

        // 8. Calcular total final
        const totalDiscount = discountAmount + loyaltyDiscount;
        const total = subtotal + shippingCost - totalDiscount;

        // 9. Calcular pontos ganhos (1 ponto por R$ 1,00)
        const loyaltyPointsEarned = calculatePointsEarned(total);

        // 10. Executar tudo em um bloco transacional atômico
        const order = await prisma.$transaction(async (tx) => {
            // A. Decremento atômico de estoque com lock (Evita overselling se 2 pessoas comprarem junto)
            for (const item of cart.items) {
                const updated = await tx.product.updateMany({
                    where: { 
                        id: item.productId,
                        stock: { gte: item.quantity }
                    },
                    data: { stock: { decrement: item.quantity } }
                });

                if (updated.count === 0) {
                    throw new Error(`O produto "${item.product.name}" esgotou enquanto você finalizava a compra.`);
                }
            }

            // B. Criar o pedido
            const newOrder = await tx.order.create({
                data: {
                    storeId,
                    userId: data.userId,
                    addressId: data.addressId,
                    shippingMethod: data.shippingMethod,
                    shippingCost: shippingCost,
                    shippingDays: selectedShipping.deliveryDays,
                    couponId: couponId,
                    discountAmount: totalDiscount,
                    loyaltyPointsEarned: loyaltyPointsEarned,
                    loyaltyPointsUsed: loyaltyPointsUsed,
                    subtotal: subtotal,
                    total: total,
                    status: 'pending',
                    items: {
                        create: cart.items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price
                        }))
                    }
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    },
                    address: true,
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            });

            // C. Atualizar Fidelidade (Gasto e Ganho)
            if (loyaltyPointsUsed > 0) {
                await tx.user.update({
                    where: { id: data.userId },
                    data: { loyaltyPoints: { decrement: loyaltyPointsUsed } }
                });
                await tx.loyaltyTransaction.create({
                    data: {
                        userId: data.userId,
                        points: -loyaltyPointsUsed,
                        type: 'redeem',
                        description: `Resgate em pedido #${newOrder.id.slice(0, 8)}`,
                        orderId: newOrder.id
                    }
                });
            }

            if (loyaltyPointsEarned > 0) {
                await tx.user.update({
                    where: { id: data.userId },
                    data: { loyaltyPoints: { increment: loyaltyPointsEarned } }
                });
                await tx.loyaltyTransaction.create({
                    data: {
                        userId: data.userId,
                        points: loyaltyPointsEarned,
                        type: 'earned',
                        description: `Compra no pedido #${newOrder.id.slice(0, 8)}`,
                        orderId: newOrder.id
                    }
                });
            }

            // D. Incrementar cupom
            if (couponId) {
                await tx.coupon.update({
                    where: { id: couponId },
                    data: { usesCount: { increment: 1 } }
                });
            }

            // E. Limpar carrinho
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            });

            return newOrder;
        });

        // 15. Enviar e-mail de confirmação
        try {
            const { sendOrderConfirmation } = await import('@/lib/email');
            await sendOrderConfirmation({
                to: order.user.email,
                orderNumber: order.id.slice(0, 8).toUpperCase(),
                total: order.total,
                items: order.items.map(item => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price * item.quantity
                }))
            });
        } catch (emailError) {
            console.error('Erro ao enviar e-mail:', emailError);
        }

        revalidatePath('/cart');

        return {
            success: true,
            orderId: order.id,
            total: order.total,
            loyaltyPointsEarned
        };

    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        return { success: false, error: 'Erro ao processar pedido. Tente novamente.' };
    }
}

/**
 * Busca detalhes de um pedido
 */
export async function getOrderDetails(orderId: string) {
    try {
        const storeId = await getStoreId();
        const order = await prisma.order.findFirst({
            where: { id: orderId, storeId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                address: true,
                invoices: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        document: true
                    }
                }
            }
        });

        if (!order) {
            return { success: false, error: 'Pedido não encontrado' };
        }

        return { success: true, order };
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        return { success: false, error: 'Erro ao buscar pedido' };
    }
}

/**
 * Lista pedidos do usuário
 */
export async function getUserOrders(userId: string) {
    try {
        const storeId = await getStoreId();
        const orders = await prisma.order.findMany({
            where: { userId, storeId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                address: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { success: true, orders };
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        return { success: false, error: 'Erro ao buscar pedidos' };
    }
}

/**
 * Atualiza status do pedido (Admin) com efeitos colaterais
 */
export async function updateOrderStatus(orderId: string, status: string, trackingCode?: string) {
    try {
        const storeId = await getStoreId();
        const order = await prisma.order.findFirst({
            where: { id: orderId, storeId },
            include: { user: true, items: { include: { product: true } } }
        });

        if (!order) return { success: false, error: 'Pedido não encontrado' };

        // 1. Lógica de Rollback se for cancelamento
        if (status === 'cancelled' && order.status !== 'cancelled') {
            await cancelOrderAndRollback(orderId, 'Cancelado pelo administrador');
            return { success: true };
        }

        // 2. Atualizar o status principal
        await prisma.order.updateMany({
            where: { id: orderId, storeId },
            data: { 
                status,
                ...(trackingCode ? { trackingCode } : {})
            }
        });

        // 3. Efeitos Colaterais (Notificações)
        const { sendShippingNotification, sendEmail } = await import('@/lib/email');

        if (status === 'shipped') {
            await sendShippingNotification({
                to: order.user.email,
                orderNumber: order.id.slice(0, 8).toUpperCase(),
                trackingCode: trackingCode || order.trackingCode || 'N/A',
                carrier: order.shippingMethod || 'Transportadora'
            });
        }

        if (status === 'paid' && order.status === 'pending') {
            // Notificar que pagamento foi recebido
            await sendEmail({
                to: order.user.email,
                subject: `Pagamento Confirmado - Pedido #${order.id.slice(0, 8).toUpperCase()}`,
                html: `<p>Olá ${order.user.name}, seu pagamento foi confirmado! Seu pedido já está sendo preparado para envio.</p>`
            });
        }

        if (status === 'delivered') {
             await sendEmail({
                to: order.user.email,
                subject: `Pedido Entregue! - Pedido #${order.id.slice(0, 8).toUpperCase()}`,
                html: `<p>Olá ${order.user.name}, seu pedido foi entregue. Esperamos que goste dos produtos!</p>`
            });
        }

        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath('/admin/orders');
        revalidatePath('/orders');
        
        return { success: true };
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        return { success: false, error: 'Erro ao atualizar status' };
    }
}

/**
 * Realiza rollback de um pedido não pago (Expirado ou Falhado via Webhook)
 */
export async function cancelOrderAndRollback(orderId: string, reason: string) {
    try {
        const storeId = await getStoreId();
        const order = await prisma.order.findFirst({
            where: { id: orderId, storeId },
            include: { items: true }
        });

        // Somente pode cancelar e fazer rollback se o pedido estiver pendente ou falhado
        if (!order || (order.status !== 'pending' && order.status !== 'awaiting_payment')) {
            return { success: false, error: 'Pedido já processado ou inexistente' };
        }

        // 1. Rollback de Estoque
        for (const item of order.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } }
            });
        }

        // 2. Rollback de Cupom
        if (order.couponId) {
            await prisma.coupon.update({
                where: { id: order.couponId },
                data: { usesCount: { decrement: 1 } }
            });
        }

        // 3. Rollback de Pontos Gastos (Devolve pro usuário)
        if (order.loyaltyPointsUsed > 0) {
            await prisma.user.update({
                where: { id: order.userId },
                data: { loyaltyPoints: { increment: order.loyaltyPointsUsed } }
            });
            // Cria transação de estorno
            await prisma.loyaltyTransaction.create({
                data: {
                    userId: order.userId,
                    points: order.loyaltyPointsUsed,
                    type: 'refund',
                    description: `Estorno de pontos do pedido falhado/cancelado #${order.id.slice(0, 8)}`,
                    orderId: order.id
                }
            });
        }

        // 4. Rollback de Pontos Ganhos (Remove os pontos que ele iria ganhar)
        if (order.loyaltyPointsEarned > 0) {
            await prisma.user.update({
                where: { id: order.userId },
                data: { loyaltyPoints: { decrement: order.loyaltyPointsEarned } }
            });
            await prisma.loyaltyTransaction.create({
                data: {
                    userId: order.userId,
                    points: -order.loyaltyPointsEarned,
                    type: 'revoked',
                    description: `Cancelamento de pontos ganhos no pedido #${order.id.slice(0, 8)}`,
                    orderId: order.id
                }
            });
        }

        // 5. Marca pedido como cancelado
        await prisma.order.updateMany({
            where: { id: orderId, storeId },
            data: { status: 'cancelled' }
        });

        console.log(`✅ Rollback concluído para pedido ${orderId}: ${reason}`);
        return { success: true };
    } catch (error) {
        console.error(`❌ Erro no rollback do pedido ${orderId}:`, error);
        return { success: false, error: 'Falha no rollback' };
    }
}

export async function getMerchantOrders() {
    try {
        const storeId = await getStoreId();
        const orders = await prisma.order.findMany({
            where: { storeId },
            include: {
                user: {
                    select: { name: true, email: true }
                },
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, orders };
    } catch (error) {
        console.error('Erro ao buscar pedidos do lojista:', error);
        return { success: false, error: 'Erro ao buscar pedidos' };
    }
}

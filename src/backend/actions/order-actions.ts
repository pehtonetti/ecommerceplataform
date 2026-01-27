'use server'

import { prisma } from "@/lib/prisma";
import { calculateShipping } from "@/lib/shipping";
import { revalidatePath } from "next/cache";
import { calculatePointsEarned } from "@/lib/loyalty";

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
            return { error: 'Carrinho vazio' };
        }

        // 2. Buscar endereço
        const address = await prisma.address.findUnique({
            where: { id: data.addressId }
        });

        if (!address) {
            return { error: 'Endereço não encontrado' };
        }

        // 3. Validar estoque
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                return {
                    error: `Produto "${item.product.name}" sem estoque suficiente`
                };
            }
        }

        // 4. Calcular subtotal
        const subtotal = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        // 5. Buscar custo de frete (mock - em produção, recalcular)
        const storeConfig = await prisma.storeConfig.findFirst();
        const originZipCode = storeConfig?.originZipCode || '01310-100';

        // Calcular dimensões do carrinho
        const totalWeight = cart.items.reduce((sum, item) =>
            sum + ((item.product.weight || 500) * item.quantity), 0
        );

        const quotes = await calculateShipping({
            fromZipCode: originZipCode,
            toZipCode: address.zipCode,
            weight: totalWeight,
            length: 20,
            width: 15,
            height: 10
        });

        const selectedShipping = quotes.find(q => q.service === data.shippingMethod);

        if (!selectedShipping) {
            return { error: 'Método de frete inválido' };
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
                return { error: pointsResult.error };
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

        // 10. Criar pedido
        const order = await prisma.order.create({
            data: {
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

        // 11. Deduzir estoque (reserva temporária)
        for (const item of cart.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            });
        }

        // 12. Processar pontos de fidelidade (gasto e ganho)
        if (loyaltyPointsUsed > 0) {
            const { spendLoyaltyPoints } = await import('./loyalty-actions');
            await spendLoyaltyPoints(
                data.userId,
                loyaltyPointsUsed,
                `Resgate em pedido #${order.id.slice(0, 8)}`,
                order.id
            );
        }

        if (loyaltyPointsEarned > 0) {
            const { addLoyaltyPoints } = await import('./loyalty-actions');
            await addLoyaltyPoints(
                data.userId,
                loyaltyPointsEarned,
                'earned',
                `Compra no pedido #${order.id.slice(0, 8)}`,
                order.id
            );
        }

        // 13. Incrementar uso do cupom
        if (couponId) {
            const { incrementCouponUsage } = await import('./coupon-actions');
            await incrementCouponUsage(couponId);
        }

        // 14. Limpar carrinho
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
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
        return { error: 'Erro ao processar pedido. Tente novamente.' };
    }
}

/**
 * Busca detalhes de um pedido
 */
export async function getOrderDetails(orderId: string) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
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
            return { error: 'Pedido não encontrado' };
        }

        return { success: true, order };
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        return { error: 'Erro ao buscar pedido' };
    }
}

/**
 * Lista pedidos do usuário
 */
export async function getUserOrders(userId: string) {
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
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
        return { error: 'Erro ao buscar pedidos' };
    }
}

/**
 * Atualiza status do pedido (Admin)
 */
export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });

        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath('/admin/orders');
        return { success: true };
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        return { error: 'Erro ao atualizar status' };
    }
}

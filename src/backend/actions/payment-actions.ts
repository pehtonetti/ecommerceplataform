'use server'

import { createCheckoutSession } from "@/lib/stripe";
import { getOrderDetails } from "./order-actions";
import { createPixQRCode, PixPaymentData } from "@/lib/pix";
import { prisma } from "@/lib/prisma";

/**
 * Cria sessão de pagamento Stripe
 */
export async function createPaymentSession(orderId: string) {
    try {
        const result = await getOrderDetails(orderId);

        if (result.error || !result.order) {
            return { error: 'Pedido não encontrado' };
        }

        const { order } = result;

        const session = await createCheckoutSession({
            orderId: order.id,
            amount: order.total,
            customerEmail: order.user.email,
            successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
        });

        return { success: true, sessionUrl: session.url };
    } catch (error) {
        console.error('Erro ao criar sessão de pagamento:', error);
        return { error: 'Erro ao processar pagamento' };
    }
}


/**
 * Gera QR Code PIX para um pedido
 */
export async function generatePixPayment(orderId: string) {
    try {
        const result = await getOrderDetails(orderId);

        if (result.error || !result.order) {
            return { error: 'Pedido não encontrado' };
        }

        const { order } = result;

        // Buscar configurações da loja para obter chave PIX
        const storeConfig = await prisma.storeConfig.findFirst();

        if (!storeConfig?.pixKey) {
            return { error: 'Chave PIX não configurada. Entre em contato com o suporte.' };
        }

        // Gerar descrição com nomes dos produtos
        let productDescription = '';
        if (order.items && order.items.length > 0) {
            const productNames = order.items.map(item => {
                const productName = item.product?.name || 'Produto';
                return item.quantity > 1 ? `${item.quantity}x ${productName}` : productName;
            });

            // Limita a descrição a 3 produtos para não ficar muito longa
            if (productNames.length <= 3) {
                productDescription = productNames.join(', ');
            } else {
                productDescription = `${productNames.slice(0, 2).join(', ')} e mais ${productNames.length - 2} item(ns)`;
            }
        } else {
            productDescription = `Pedido #${order.id.substring(0, 8).toUpperCase()}`;
        }

        // Dados do pagamento PIX
        const pixData: PixPaymentData = {
            pixKey: storeConfig.pixKey,
            merchantName: storeConfig.storeName || 'Simplify Store',
            merchantCity: storeConfig.merchantCity || 'Sao Paulo',
            amount: order.total,
            transactionId: order.id.substring(0, 25),
            description: productDescription
        };

        // Gera QR Code
        const pixQRCode = await createPixQRCode(pixData);

        // Salva informações do PIX no pedido - mantém status como 'pending' até confirmação
        await prisma.order.update({
            where: { id: orderId },
            data: {
                pixQRCode: pixQRCode.qrCodeText,
                pixExpiresAt: pixQRCode.expiresAt,
                // Status permanece 'pending' até confirmação do pagamento
            }
        });

        return {
            success: true,
            qrCode: pixQRCode.qrCodeText,
            transactionId: pixQRCode.transactionId,
            expiresAt: pixQRCode.expiresAt,
            amount: order.total,
            description: productDescription
        };
    } catch (error) {
        console.error('Erro ao gerar PIX:', error);
        return { error: 'Erro ao gerar QR Code PIX' };
    }
}

/**
 * Verifica status de pagamento PIX
 * Em produção, isso seria integrado com webhook do banco/gateway
 */
export async function checkPixPaymentStatus(orderId: string) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: {
                id: true,
                status: true,
                pixQRCode: true,
                pixExpiresAt: true,
                pixPaidAt: true
            }
        });

        if (!order) {
            return { error: 'Pedido não encontrado' };
        }

        // Verifica se expirou
        if (order.pixExpiresAt && new Date() > order.pixExpiresAt && order.status === 'awaiting_payment') {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: 'expired' }
            });

            return {
                success: true,
                status: 'expired',
                message: 'QR Code PIX expirado'
            };
        }

        return {
            success: true,
            status: order.status,
            paidAt: order.pixPaidAt,
            expiresAt: order.pixExpiresAt
        };
    } catch (error) {
        console.error('Erro ao verificar status PIX:', error);
        return { error: 'Erro ao verificar pagamento' };
    }
}

/**
 * Confirma pagamento PIX
 * Em produção, esta função seria chamada por um webhook do banco/gateway
 */
export async function confirmPixPayment(orderId: string, txId?: string) {
    try {
        // Busca o pedido para validar
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return { error: 'Pedido não encontrado' };
        }

        // Verifica se já foi pago
        if (order.status === 'paid' || order.status === 'processing') {
            return { error: 'Pedido já foi confirmado' };
        }

        // Atualiza o pedido para 'processing' (pagamento confirmado, aguardando separação)
        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'processing', // Muda para 'processing' após confirmação do pagamento
                pixPaidAt: new Date(),
                pixTransactionId: txId || `PIX-${Date.now()}`
            }
        });

        // Envia email de confirmação (se configurado)
        try {
            const { sendOrderConfirmationEmail } = await import('@/lib/email');
            await sendOrderConfirmationEmail(order.user.email, {
                orderId: order.id,
                customerName: order.user.name || 'Cliente',
                total: order.total,
                items: order.items.map(item => ({
                    name: item.product?.name || 'Produto',
                    quantity: item.quantity,
                    price: item.price
                }))
            });
        } catch (emailError) {
            console.error('Erro ao enviar email de confirmação:', emailError);
            // Não falha a confirmação se o email falhar
        }

        console.log(`✅ Pagamento PIX confirmado para pedido ${orderId}`);

        return { success: true, message: 'Pagamento confirmado com sucesso' };
    } catch (error) {
        console.error('Erro ao confirmar pagamento PIX:', error);
        return { error: 'Erro ao confirmar pagamento' };
    }
}

import Stripe from 'stripe';
import { env } from '@/env';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
    typescript: true,
});

/**
 * Cria uma sessão de checkout do Stripe
 */
export async function createCheckoutSession(params: {
    orderId: string;
    amount: number; // em centavos
    customerEmail: string;
    successUrl: string;
    cancelUrl: string;
}) {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'brl',
                    product_data: {
                        name: `Pedido #${params.orderId.slice(0, 8).toUpperCase()}`,
                        description: 'Compra na Loja Tech Premium',
                    },
                    unit_amount: params.amount,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        customer_email: params.customerEmail,
        metadata: {
            orderId: params.orderId,
        },
    });

    return session;
}

/**
 * Verifica o status de um pagamento
 */
export async function getPaymentStatus(sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
        status: session.payment_status,
        orderId: session.metadata?.orderId,
    };
}

'use server'

import { createCheckoutSession } from "@/lib/stripe";
import { getOrderDetails } from "./order-actions";

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
            successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/order-success?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
        });

        return { success: true, sessionUrl: session.url };
    } catch (error) {
        console.error('Erro ao criar sessão de pagamento:', error);
        return { error: 'Erro ao processar pagamento' };
    }
}

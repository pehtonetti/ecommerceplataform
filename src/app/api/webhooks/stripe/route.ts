import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId = session.metadata?.orderId;

            if (orderId) {
                // Atualizar status do pedido para "paid" e disparar efeitos colaterais
                const { updateOrderStatus } = await import('@/backend/actions/order-actions');
                await updateOrderStatus(orderId, 'paid');

                console.log(`✅ Pagamento confirmado para pedido ${orderId}`);

                // Disparar emissão de NFe
                try {
                    console.log(`📡 Iniciando emissão de NFe para pedido ${orderId}...`);
                    const { emitNfe } = await import('@/backend/actions/fiscal-actions');
                    const nfeResult = await emitNfe(orderId);

                    if (nfeResult.success) {
                        console.log(`✅ NFe emitida/solicitada com sucesso: ${nfeResult.nfeKey}`);
                    } else {
                        console.error(`⚠️ Erro ao emitir NFe: ${nfeResult.error}`);
                    }
                } catch (nfeError) {
                    console.error(`❌ Erro crítico ao processar NFe:`, nfeError);
                }
            }
            break;
        }

        case 'checkout.session.expired':
        case 'checkout.session.async_payment_failed': {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId = session.metadata?.orderId;
            if (orderId) {
                const { cancelOrderAndRollback } = await import('@/backend/actions/order-actions');
                await cancelOrderAndRollback(orderId, 'Stripe Session Expired or Failed');
            }
            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.error(`❌ Pagamento falhou: ${paymentIntent.id}`);
            // Note: payment_intent might not have orderId in metadata easily unless we propagated it.
            // But checkout.session.expired/failed covers it.
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

'use server'

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { calculateTax } from "@/lib/tax-utils";

export async function validateCoupon(code: string) {
    if (!code) return { success: false, error: 'Código inválido' };

    const coupon = await prisma.coupon.findUnique({
        where: { code: code.toUpperCase() }
    });

    if (!coupon) return { success: false, error: 'Cupom não encontrado' };
    if (!coupon.active) return { success: false, error: 'Cupom inativo' };

    const now = new Date();
    if (coupon.validUntil && coupon.validUntil < now) return { success: false, error: 'Cupom expirado' };
    if (coupon.validFrom > now) return { success: false, error: 'Cupom ainda não é válido' };

    return {
        success: true,
        coupon: {
            id: coupon.id,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue
        }
    };
}


export async function getUserAddresses() {
    const user = await getCurrentUser();
    if (!user) return [];

    return await prisma.address.findMany({
        where: { userId: user.id },
        orderBy: { isDefault: 'desc' }
    });
}

export async function createAddress(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const zipCode = formData.get('zipCode') as string;
    const street = formData.get('street') as string;
    const number = formData.get('number') as string;
    const neighborhood = formData.get('neighborhood') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const label = formData.get('label') as string || 'Casa';

    try {
        await prisma.address.create({
            data: {
                userId: user.id,
                zipCode,
                street,
                number,
                neighborhood,
                city,
                state,
                country: 'Brasil',
                label,
                isDefault: true // Set as default for now
            }
        });

        revalidatePath('/checkout');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Error creating address' };
    }
}

export async function checkoutOrder(data: {
    addressId: string;
    paymentMethod: string;
    shippingCost: number;
    subtotal: number;
    total: number;
    couponId?: string;
    discountAmount?: number;
    document?: string; // CPF/CNPJ
}) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
        // 0. Update User Document if provided
        if (data.document) {
            await prisma.user.update({
                where: { id: user.id },
                data: { document: data.document }
            });
        }

        // 1. Get Cart
        const cart = await prisma.cart.findUnique({
            where: { userId: user.id },
            include: { items: { include: { product: true } } }
        });

        if (!cart || cart.items.length === 0) {
            return { success: false, error: 'Carrinho vazio' };
        }

        // 2. Fetch Address to calculate tax
        const address = await prisma.address.findUnique({
            where: { id: data.addressId }
        });

        const taxAmount = calculateTax(data.subtotal, address?.state || 'SP');

        // 3. Create Order
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                addressId: data.addressId,
                status: 'pending', // Starts as pending, waits for Webhook
                subtotal: data.subtotal,
                taxAmount: taxAmount,
                total: data.total,
                shippingCost: data.shippingCost,
                couponId: data.couponId,
                discountAmount: data.discountAmount || 0,
                shippingMethod: 'Express',
                shippingDays: 3,
                items: {
                    create: cart.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price
                    }))
                }
            }
        });

        // 3. Clear Cart
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });

        // 4. Update Stock (Simulated) - Ideally hold stock, confirm on payment
        for (const item of cart.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } }
            });
        }

        let redirectUrl = `/checkout/success/${order.id}`;

        // 5. Payment Method Handling
        if (data.paymentMethod === 'credit_card') {
            try {
                const { createCheckoutSession } = await import('@/lib/stripe');
                const session = await createCheckoutSession({
                    orderId: order.id,
                    amount: data.total + taxAmount, // Total with tax
                    customerEmail: user.email,
                    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success/${order.id}`,
                    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
                });

                if (session.url) {
                    redirectUrl = session.url;
                }
            } catch (stripeError) {
                console.error("Stripe Session Error:", stripeError);
                // We might want to return error or fallback to manual payment
            }
        } else if (data.paymentMethod === 'pix') {
            // Redirect to PIX payment page
            redirectUrl = `/checkout/pix/${order.id}`;
        }

        // 5. Trigger Fiscal Emission (Async/Fire-and-forget)
        // In production, this should be done via webhook or queue AFTER payment
        // For now, we emit immediately for testing or maybe wait for webhook
        if (false) { // Disabled immediate emission, waiting for Webhook
            import("./fiscal-actions").then(mod => {
                console.log(`🚀 Triggering auto-NFe for order ${order.id}`);
                mod.emitNfe(order.id).catch(err => console.error("NFe Auto-Emit Error:", err));
            });
        }


        revalidatePath('/orders');
        return { success: true, orderId: order.id, url: redirectUrl };
    } catch (e) {
        console.error('Checkout Error:', e);
        return { success: false, error: 'Erro ao processar pedido' };
    }
}

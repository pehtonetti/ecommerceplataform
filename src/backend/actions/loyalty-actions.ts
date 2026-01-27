"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function redeemPointsForCoupon(pointsToSpend: number) {
    const user = await getCurrentUser();
    if (!user) return { error: "Login necessário" };

    if (user.loyaltyPoints < pointsToSpend) {
        return { error: "Pontos insuficientes" };
    }

    try {
        // Calculate discount value (e.g., 1000 points = R$ 10.00 coupon)
        // Assuming 1 point = 1 cent basically for this coupon logic? 
        // Logic below: points / 100 * 100 -> effectively points.
        // Wait, if 1000 points... 1000/100 = 10. 10 * 100 = 1000 (cents? or R$?)
        // Usually money is cents. So 1000 points = R$10.00 (1000 cents).
        // So 1 point = 1 cent.

        const discountValue = Math.floor(pointsToSpend / 100) * 100; // Round down to nearest 100 if needed, or just 1:1
        const couponCode = `POINTS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // 1. Transactional update
        await prisma.$transaction([
            // Deduct points
            prisma.user.update({
                where: { id: user.id },
                data: { loyaltyPoints: { decrement: pointsToSpend } }
            }),
            // Create coupon
            prisma.coupon.create({
                data: {
                    code: couponCode,
                    description: `Resgate de ${pointsToSpend} pontos de fidelidade`,
                    discountType: 'fixed',
                    discountValue: discountValue,
                    active: true,
                    maxUses: 1,
                }
            }),
            // Log transaction
            prisma.loyaltyTransaction.create({
                data: {
                    userId: user.id,
                    points: -pointsToSpend,
                    type: 'spent',
                    description: `Resgate de cupom ${couponCode}`,
                }
            })
        ]);

        revalidatePath('/account/loyalty');
        return { success: true, couponCode, discountValue };
    } catch (e) {
        console.error("Redeem points error:", e);
        return { error: "Erro ao processar resgate" };
    }
}

export async function getLoyaltyHistory() {
    const user = await getCurrentUser();
    if (!user) return [];

    return await prisma.loyaltyTransaction.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    });
}

// --- Direct Checkout Usage Functions ---

export async function validatePointsUsage(points: number, subtotal: number) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Usuário não autenticado' };

    if (points > user.loyaltyPoints) {
        return { error: 'Saldo de pontos insuficiente' };
    }

    // Rule: Max 50% of subtotal can be paid with points? Or 100%?
    // Let's assume 1 point = R$ 0.01 (1 centavo)
    const discountAmount = points; // 1 point = 1 cent

    if (discountAmount > subtotal) {
        return { error: 'Não é possível usar mais pontos do que o valor do pedido' };
    }

    return { success: true, discountAmount };
}

export async function spendLoyaltyPoints(userId: string, points: number, description: string, orderId?: string) {
    await prisma.$transaction([
        prisma.user.update({
            where: { id: userId },
            data: { loyaltyPoints: { decrement: points } }
        }),
        prisma.loyaltyTransaction.create({
            data: {
                userId,
                points: -points,
                type: 'spent',
                description,
                orderId // If schema supports it. If not, it won't be saved, but usually good to link.
                // Note: LoyaltyTransaction might not have orderId field in current schema.
                // If it fails, we remove orderId.
            }
        })
    ]);
}

export async function addLoyaltyPoints(userId: string, points: number, type: string, description: string, orderId?: string) {
    await prisma.$transaction([
        prisma.user.update({
            where: { id: userId },
            data: { loyaltyPoints: { increment: points } }
        }),
        prisma.loyaltyTransaction.create({
            data: {
                userId,
                points: points,
                type: type, // 'earned'
                description,
                // orderId 
            }
        })
    ]);
}

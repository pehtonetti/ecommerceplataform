'use server'

import { prisma } from "@/lib/prisma";

export async function validateCoupon(code: string, subtotal: number) {
    const coupon = await prisma.coupon.findUnique({
        where: { code }
    });

    if (!coupon) {
        return { valid: false, message: "Cupom não encontrado" };
    }

    if (!coupon.active) {
        return { valid: false, message: "Cupom inativo" };
    }

    if (coupon.validUntil && new Date() > coupon.validUntil) {
        return { valid: false, message: "Cupom expirado" };
    }

    if (coupon.minPurchaseAmount && subtotal < coupon.minPurchaseAmount) {
        return { valid: false, message: `Valor mínimo para este cupom: R$ ${(coupon.minPurchaseAmount / 100).toFixed(2)}` };
    }

    if (coupon.maxUses && coupon.usesCount >= coupon.maxUses) {
        return { valid: false, message: "Este cupom atingiu o limite de usos" };
    }

    return { valid: true, coupon };
}

export async function incrementCouponUsage(couponId: string) {
    await prisma.coupon.update({
        where: { id: couponId },
        data: { usesCount: { increment: 1 } }
    });
}

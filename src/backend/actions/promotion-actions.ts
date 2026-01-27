'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCoupon(formData: FormData) {
    const code = (formData.get('code') as string).toUpperCase();
    const discountValue = Number(formData.get('discountValue'));
    const discountType = formData.get('discountType') as string; // 'percentage' or 'fixed'
    // For simplicity, we assume fixed discount is in "whole units" (BRL) from UI, convert to cents

    // Validate
    if (!code || !discountValue) {
        throw new Error('Código e valor do desconto são obrigatórios');
    }

    // Convert value if fixed: R$ 10 -> 1000 cents
    // If percentage: 10 -> 10 (%)
    const valueToStore = discountType === 'fixed' ? Math.round(discountValue * 100) : discountValue;

    try {
        await prisma.coupon.create({
            data: {
                code,
                discountValue: valueToStore,
                discountType,
                active: true
            }
        });
    } catch (e) {
        throw new Error('Erro ao criar cupom. Código pode já existir.');
    }

    revalidatePath('/admin/promotions');
}

export async function toggleCouponStatus(id: string, currentStatus: boolean) {
    await prisma.coupon.update({
        where: { id },
        data: { active: !currentStatus }
    });
    revalidatePath('/admin/promotions');
}

export async function getCoupons() {
    return await prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getStoreId } from "@/backend/lib/store-context";

export async function createCoupon(formData: FormData) {
    try {
        const storeId = await getStoreId();
        const code = (formData.get('code') as string).toUpperCase();
        const discountValue = Number(formData.get('discountValue'));
        const discountType = formData.get('discountType') as string;

        if (!code || !discountValue) {
            return { success: false, error: 'Código e valor do desconto são obrigatórios' };
        }

        const valueToStore = discountType === 'fixed' ? Math.round(discountValue * 100) : discountValue;

        await prisma.coupon.create({
            data: {
                store: { connect: { id: storeId } },
                code,
                discountValue: valueToStore,
                discountType,
                active: true
            }
        });

        revalidatePath('/admin/promotions');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Create Coupon Error', e);
        return { success: false, error: 'Erro ao criar cupom. Código pode já existir.' };
    }
}

export async function toggleCouponStatus(id: string, currentStatus: boolean) {
    try {
        await prisma.coupon.update({
            where: { id },
            data: { active: !currentStatus }
        });
        revalidatePath('/admin/promotions');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Toggle Coupon Status Error', e);
        return { success: false, error: 'Erro ao alterar status do cupom' };
    }
}

export async function getCoupons() {
    try {
        const storeId = await getStoreId();
        const coupons = await prisma.coupon.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, coupons };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Get Coupons Error', e);
        return { success: false, error: 'Erro ao buscar cupons' };
    }
}

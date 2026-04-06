'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getStoreId } from "@/backend/lib/store-context";

export async function getMerchantCoupons() {
    try {
        const storeId = await getStoreId();
        const coupons = await prisma.coupon.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, coupons };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        return { success: false, error: 'Erro ao buscar cupons', coupons: [] };
    }
}

export async function createCoupon(formData: FormData) {
    try {
        const storeId = await getStoreId();
        const code = formData.get('code')?.toString().toUpperCase().trim();
        const description = formData.get('description')?.toString() || null;
        const discountType = formData.get('discountType')?.toString() || 'percentage'; // percentage | fixed
        const discountValue = parseInt(formData.get('discountValue')?.toString() || '0');
        const minPurchaseAmount = formData.get('minPurchaseAmount') ? parseInt(formData.get('minPurchaseAmount') as string) * 100 : null;
        const maxUses = formData.get('maxUses') ? parseInt(formData.get('maxUses') as string) : null;
        const validUntil = formData.get('validUntil') ? new Date(formData.get('validUntil') as string) : null;

        if (!code) return { success: false, error: 'Código é obrigatório' };
        if (discountValue <= 0) return { success: false, error: 'Desconto deve ser maior que zero' };

        const existing = await prisma.coupon.findFirst({ where: { storeId, code } });
        if (existing) return { success: false, error: 'Já existe um cupom com este código' };

        await prisma.coupon.create({
            data: {
                storeId,
                code,
                description,
                discountType,
                discountValue,
                minPurchaseAmount,
                maxUses,
                validUntil,
                active: true,
            }
        });

        revalidatePath('/dashboard/coupons');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Create Coupon Error', e);
        return { success: false, error: 'Erro ao criar cupom' };
    }
}

export async function toggleCouponActive(id: string, active: boolean) {
    try {
        const storeId = await getStoreId();
        const coupon = await prisma.coupon.findFirst({ where: { id, storeId } });
        if (!coupon) return { success: false, error: 'Cupom não encontrado' };

        await prisma.coupon.update({ where: { id }, data: { active } });
        revalidatePath('/dashboard/coupons');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        return { success: false, error: 'Erro ao atualizar cupom' };
    }
}

export async function deleteCoupon(id: string) {
    try {
        const storeId = await getStoreId();
        const coupon = await prisma.coupon.findFirst({ where: { id, storeId } });
        if (!coupon) return { success: false, error: 'Cupom não encontrado' };

        await prisma.coupon.delete({ where: { id } });
        revalidatePath('/dashboard/coupons');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Delete Coupon Error', e);
        return { success: false, error: 'Erro ao deletar cupom' };
    }
}

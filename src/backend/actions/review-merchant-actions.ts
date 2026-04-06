'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getStoreId } from "@/backend/lib/store-context";

export async function getMerchantReviews() {
    try {
        const storeId = await getStoreId();
        const reviews = await prisma.review.findMany({
            where: { product: { storeId } },
            include: {
                product: { select: { name: true, imageUrl: true } },
                user: { select: { name: true, email: true, avatarUrl: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, reviews };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Get Reviews Error', e);
        return { success: false, error: 'Erro ao buscar avaliações', reviews: [] };
    }
}

export async function approveReview(id: string) {
    try {
        await prisma.review.update({ where: { id }, data: { approved: true } });
        revalidatePath('/dashboard/reviews');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        return { success: false, error: 'Erro ao aprovar avaliação' };
    }
}

export async function rejectReview(id: string) {
    try {
        await prisma.review.update({ where: { id }, data: { approved: false } });
        revalidatePath('/dashboard/reviews');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        return { success: false, error: 'Erro ao rejeitar avaliação' };
    }
}

export async function deleteReview(id: string) {
    try {
        const storeId = await getStoreId();
        const review = await prisma.review.findFirst({
            where: { id, product: { storeId } },
        });
        if (!review) return { success: false, error: 'Avaliação não encontrada' };

        await prisma.review.delete({ where: { id } });
        revalidatePath('/dashboard/reviews');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Delete Review Error', e);
        return { success: false, error: 'Erro ao deletar avaliação' };
    }
}

"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitReview(data: {
    productId: string;
    rating: number;
    title?: string;
    comment: string;
    videoUrl?: string;
}) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Necessário login para avaliar" };

    try {
        // 1. Create the review
        const review = await prisma.review.create({
            data: {
                userId: user.id,
                productId: data.productId,
                rating: data.rating,
                title: data.title,
                comment: data.comment,
                videoUrl: data.videoUrl,
                verified: true, // Assuming call from order actions means verified
            }
        });

        // 2. REWARD SYSTEM: Give 100 points per review
        const pointsAwarded = 100;
        await prisma.user.update({
            where: { id: user.id },
            data: {
                loyaltyPoints: { increment: pointsAwarded }
            }
        });

        // Log the transaction
        await prisma.loyaltyTransaction.create({
            data: {
                userId: user.id,
                points: pointsAwarded,
                type: 'bonus',
                description: `Avaliação do produto`,
            }
        });

        revalidatePath(`/product/${data.productId}`);
        revalidatePath('/orders');

        return { success: true, pointsAwarded };
    } catch (e) {
        console.error("Error submitting review:", e);
        return { success: false, error: "Falha ao enviar avaliação" };
    }
}

export async function getProductReviews(productId: string) {
    return await prisma.review.findMany({
        where: { productId, approved: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
    });
}

export async function deleteReview(reviewId: string, userId: string) {
    try {
        const review = await prisma.review.findUnique({ where: { id: reviewId } });
        if (!review) return { success: false, error: "Avaliação não encontrada" };
        if (review.userId !== userId) return { success: false, error: "Não autorizado" };

        await prisma.review.delete({ where: { id: reviewId } });
        
        revalidatePath(`/product/${review.productId}`);
        revalidatePath('/orders');
        
        return { success: true };
    } catch (e) {
        console.error("Error deleting review:", e);
        return { success: false, error: "Erro ao deletar avaliação" };
    }
}

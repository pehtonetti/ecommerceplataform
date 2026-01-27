"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function logBehavior(action: string, details?: any) {
    try {
        const user = await getCurrentUser();

        // Log to DB
        await prisma.behavioralLog.create({
            data: {
                userId: user?.id || null,
                action,
                details: details || {},
            }
        });

        return { success: true };
    } catch (e) {
        // Silently fail logging to avoid breaking UX
        console.error("Failed to log behavior:", e);
        return { error: "Failed to log" };
    }
}

/**
 * AI Recommendation Logic (Simulated)
 * Analyzes logs to suggest products that the user is "hesitating" on.
 */
export async function getAiRecommendations() {
    const user = await getCurrentUser();
    if (!user) return [];

    try {
        // Find products the user viewed many times but didn't buy
        const logs = await prisma.behavioralLog.findMany({
            where: {
                userId: user.id,
                action: 'product_view'
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        // Simple frequency count
        const productCounts: Record<string, number> = {};
        logs.forEach(log => {
            const pid = (log.details as any)?.productId;
            if (pid) productCounts[pid] = (productCounts[pid] || 0) + 1;
        });

        // Filter products viewed > 3 times
        const potentialPids = Object.entries(productCounts)
            .filter(([_, count]) => count >= 3)
            .map(([pid]) => pid);

        if (potentialPids.length === 0) return [];

        return await prisma.product.findMany({
            where: {
                id: { in: potentialPids },
                active: true
            },
            take: 4
        });
    } catch (e) {
        return [];
    }
}

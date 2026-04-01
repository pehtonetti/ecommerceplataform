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
import { getStoreId } from "@/backend/lib/store-context";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateProductAIContent(productName: string) {
    try {
        await getStoreId(); // Safety check

        if (!productName || productName.length < 3) {
            return { success: false, error: "Nome do produto muito curto." };
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `
            Você é um especialista em marketing de e-commerce.
            Dê uma descrição persuasiva e profissional para um produto chamado "${productName}".
            A descrição deve ter entre 150 e 250 caracteres.
            Sugira também uma categoria curta (uma palavra) que melhor se encaixe.
            Retorne APENAS um JSON no formato:
            {
                "description": "...",
                "category": "..."
            }
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text().replace(/```json|```/g, "").trim();

        try {
            const json = JSON.parse(text);
            return { success: true, data: json };
        } catch (parseError) {
            console.error("AI Parse Error:", parseError, text);
            return { success: false, error: "Falha ao processar resposta da IA." };
        }

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return { success: false, error: error.message || "Erro desconhecido na geração por IA." };
    }
}

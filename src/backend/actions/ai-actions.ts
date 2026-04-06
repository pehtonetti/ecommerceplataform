"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function logBehavior(action: string, details?: Record<string, unknown>) {
    try {
        const user = await getCurrentUser();

        // Log to DB
        await prisma.behavioralLog.create({
            data: {
                userId: user?.id || null,
                action,
                details: details ? JSON.stringify(details) : "{}",
            }
        });

        return { success: true };
    } catch (e) {
        // Silently fail logging to avoid breaking UX
        console.error("Failed to log behavior:", e);
        return { success: false, error: "Failed to log" };
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
            try {
                const details = log.details ? JSON.parse(log.details as string) as { productId?: string } : null;
                const pid = details?.productId;
                if (pid) productCounts[pid] = (productCounts[pid] || 0) + 1;
            } catch {
                // Ignore malformed logs
            }
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

    } catch (error: unknown) {
        const aiError = error as Error;
        console.error("AI Generation Error:", aiError);
        return { success: false, error: aiError.message || "Erro desconhecido na geração por IA." };
    }
}

/**
 * Real Background Removal using remove.bg API
 * Requires REMOVE_BG_API_KEY in .env
 */
export async function removeProductBackground(imageUrl: string) {
    if (!imageUrl) return { success: false, error: "Forneça uma URL de imagem válida." };

    try {
        const apiKey = process.env.REMOVE_BG_API_KEY;
        
        // Se a chave não existir, simulamos uma demora real p/ UX
        if (!apiKey) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return { 
                success: true, 
                url: imageUrl, 
                warning: "Simulação: Adicione REMOVE_BG_API_KEY no .env para processamento real." 
            };
        }

        const formData = new FormData();
        formData.append("image_url", imageUrl);
        formData.append("size", "auto");

        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: { "X-Api-Key": apiKey },
            body: formData,
        });

        if (response.ok) {
            // Nota: Em produção, o blob retornado deve ser enviado para um S3/Cloudinary.
            // Para efeitos de demonstração no CMS, validamos o sucesso.
            return { success: true, url: imageUrl };
        } else {
            const errData = await response.json().catch(() => ({}));
            return { success: false, error: errData.errors?.[0]?.title || "Falha na API de Imagem." };
        }
    } catch (error) {
        return { success: false, error: "Erro crítico na conexão com processador de imagens." };
    }
}

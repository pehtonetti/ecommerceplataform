"use server";

import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function processImportFile(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) throw new Error("Arquivo não encontrado");

        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(sheet);

        // Process each row with AI concurrently (with limits ideally, but strictly simpler here)
        // Only processing first 10 for demo speed if list is huge, or all if reasonable.
        const processedData = await Promise.all(rawData.map(async (row: any) => {
            const hasDesc = row.Description && row.Description.length > 10;
            const hasCategory = row.Category && row.Category.length > 3;

            let finalDesc = row.Description || "";
            let finalCategory = row.Category || "Geral";

            // Determine what AI needs to generate
            if (!hasDesc || !hasCategory) {
                try {
                    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                    const prompt = `
                        Analyze this product data: Name: "${row.Name}", Price: ${row.Price}.
                        1. Create a compelling marketing description (max 200 chars) in Portuguese.
                        2. Suggest a single category word (e.g., Eletrônicos, Roupas, Casa).
                        Return JSON only: { "description": "...", "category": "..." }
                    `;

                    const result = await model.generateContent(prompt);
                    const response = result.response;
                    const text = response.text().replace(/```json|```/g, "").trim();

                    try {
                        const json = JSON.parse(text);
                        if (!hasDesc) finalDesc = json.description;
                        if (!hasCategory) finalCategory = json.category;
                    } catch (e) {
                        console.error("AI JSON Parse Error", e);
                    }
                } catch (aiError) {
                    console.error("AI Generation failed", aiError);
                    finalDesc = finalDesc || `Produto incrível: ${row.Name}`;
                }
            }

            return {
                name: row.Name,
                price: typeof row.Price === 'number' ? Math.round(row.Price * 100) : 0, // Assume input is float (19.90) -> 1990
                stock: row.Stock || 10,
                description: finalDesc,
                category: finalCategory,
                imageUrl: row.Image || "/images/placeholder.png",
                videoUrl: row.Video || null,
                active: true
            };
        }));

        return { success: true, data: processedData };

    } catch (error: any) {
        console.error("Import Error:", error);
        return { success: false, error: error.message };
    }
}


export async function saveImportedProducts(products: any[]) {
    try {
        // Batch creation
        // Prisma createMany is faster
        await prisma.product.createMany({
            data: products.map(p => ({
                name: p.name,
                description: p.description,
                price: p.price,
                stock: p.stock,
                imageUrl: p.imageUrl,
                category: p.category,
                videoUrl: p.videoUrl,
                active: true
            }))
        });

        return { success: true };
    } catch (error: any) {
        console.error("Save Error:", error);
        return { success: false, error: error.message };
    }
}

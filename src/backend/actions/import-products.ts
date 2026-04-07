"use server";

import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getStoreId } from "@/backend/lib/store-context";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function processImportFile(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) throw new Error("Arquivo não encontrado");

        const buffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) throw new Error("Não foi possível ler a planilha");

        const rawData: any[] = [];
        
        // Assume first row is header
        const headerRow = worksheet.getRow(1);
        const headers: string[] = [];
        headerRow.eachCell((cell) => {
            headers.push(cell.text);
        });

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header

            const rowData: any = {};
            row.eachCell((cell, colNumber) => {
                const header = headers[colNumber - 1];
                if (header) rowData[header] = cell.value;
            });
            rawData.push(rowData);
        });

        // Process data with AI
        const processedData = await Promise.all(rawData.map(async (row: any) => {
            const hasDesc = row.Description && row.Description.length > 10;
            const hasCategory = row.Category && row.Category.length > 3;

            let finalDesc = row.Description || "";
            let finalCategory = row.Category || "Geral";

            if (!hasDesc || !hasCategory) {
                try {
                    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                    const prompt = `
                        Analise estes dados: Nome: "${row.Name}", Preço: ${row.Price}.
                        1. Crie uma descrição de marketing (max 200 chars) em PT-BR.
                        2. Sugira uma categoria única.
                        Retorne APENAS JSON: { "description": "...", "category": "..." }
                    `;

                    const result = await model.generateContent(prompt);
                    const text = result.response.text().replace(/```json|```/g, "").trim();

                    try {
                        const json = JSON.parse(text);
                        if (!hasDesc) finalDesc = json.description;
                        if (!hasCategory) finalCategory = json.category;
                    } catch (e) {
                        console.error("AI Parse Error", e);
                    }
                } catch (aiError) {
                    console.error("AI Generation Error", aiError);
                    finalDesc = finalDesc || `Produto: ${row.Name}`;
                }
            }

            return {
                name: row.Name,
                price: typeof row.Price === 'number' ? Math.round(row.Price * 100) : 0,
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
        const storeId = await getStoreId();
        await prisma.product.createMany({
            data: products.map(p => ({
                storeId,
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

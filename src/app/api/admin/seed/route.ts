import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Strict Type Definitions
type ProductVariant = {
    color: string;
    storage: string[];
    image: string; // The specific image for this color
    extraImages: string[];
};

type ProductTemplate = {
    name: string;
    brand: string;
    category: string;
    price: number;
    description: string;
    videoUrl?: string; // Optional
    variants: ProductVariant[];
    condition: string[];
};

// Curated High-Fidelity Data
// Reliable Image Sources (Unsplash) to bypass CDN hotlink protections
const BASE_PRODUCTS: ProductTemplate[] = [
    // --- APPLE ---
    {
        name: "iPhone 15 Pro Max",
        brand: "Apple",
        category: "smartphones",
        price: 1099900,
        description: `O iPhone 15 Pro Max. Forjado em titânio. Com o chip A17 Pro inovador.`,
        videoUrl: "https://www.youtube.com/embed/xqyUdNxWazA",
        condition: ["Novo"],
        variants: [
            {
                color: "Titânio Natural",
                storage: ["256GB", "512GB", "1TB"],
                image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800",
                extraImages: [
                    "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1695048132953-7546960ac0a3?auto=format&fit=crop&q=80&w=800"
                ]
            },
            {
                color: "Titânio Azul",
                storage: ["256GB", "512GB", "1TB"],
                image: "https://images.unsplash.com/photo-1696446700547-0302820067b1?auto=format&fit=crop&q=80&w=800",
                extraImages: ["https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800"]
            }
        ]
    },
    // --- SAMSUNG ---
    {
        name: "Samsung Galaxy S24 Ultra",
        brand: "Samsung",
        category: "smartphones",
        price: 899900,
        description: `Galaxy S24 Ultra. Galaxy AI, estrutura em titânio e S Pen.`,
        videoUrl: "https://www.youtube.com/embed/bwd8a6B5G1g",
        condition: ["Novo"],
        variants: [
            {
                color: "Cinza Titânio",
                storage: ["256GB", "512GB"],
                image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800",
                extraImages: ["https://images.unsplash.com/photo-1610945265064-f58c35717bf6?auto=format&fit=crop&q=80&w=800"]
            },
            {
                color: "Preto Titânio",
                storage: ["256GB", "512GB"],
                image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800", // Fallback similarity
                extraImages: ["https://images.unsplash.com/photo-1610945264878-886f6f05f454?auto=format&fit=crop&q=80&w=800"]
            }
        ]
    },
    // --- MOTOROLA ---
    {
        name: "Motorola Edge 50 Pro",
        brand: "Motorola",
        category: "smartphones",
        price: 349900,
        description: `Design com acabamento em vegan leather. Câmeras com IA.`,
        videoUrl: "https://www.youtube.com/embed/Pj1GgS4d0eM",
        condition: ["Novo"],
        variants: [
            {
                color: "Preto",
                storage: ["256GB"],
                image: "https://images.unsplash.com/photo-1598327105666-5b89351aff5f?auto=format&fit=crop&q=80&w=800",
                extraImages: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800"]
            }
        ]
    },
    // --- SONY ---
    {
        name: "PlayStation 5 Slim",
        brand: "Sony",
        category: "eletronicos",
        price: 379900,
        description: `PS5 Slim. Jogue como nunca antes.`,
        videoUrl: "https://www.youtube.com/embed/1v4tq2s_7Xg",
        condition: ["Novo"],
        variants: [
            {
                color: "Branco",
                storage: ["1TB SSD"],
                image: "https://images.unsplash.com/photo-1606144042614-7d5266488b59?auto=format&fit=crop&q=80&w=800",
                extraImages: [
                    "https://images.unsplash.com/photo-1621259182902-880c62d62638?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&q=80&w=800"
                ]
            }
        ]
    },
    // --- NINTENDO ---
    {
        name: "Nintendo Switch OLED",
        brand: "Nintendo",
        category: "eletronicos",
        price: 219900,
        description: `Tela OLED vibrante de 7 polegadas. Jogue a qualquer hora.`,
        videoUrl: "https://www.youtube.com/embed/4mHq6Y7JSmg",
        condition: ["Novo"],
        variants: [
            {
                color: "Branco",
                storage: ["64GB"],
                image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=80&w=800",
                extraImages: [
                    "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?auto=format&fit=crop&q=80&w=800"
                ]
            }
        ]
    },
    // --- DELL ---
    {
        name: "Dell XPS 13 Plus",
        brand: "Dell",
        category: "notebooks",
        price: 1450000,
        description: `O notebook de 13 polegadas mais potente da Dell.`,
        videoUrl: "https://www.youtube.com/embed/o01z2a6Q9Xg",
        condition: ["Novo"],
        variants: [
            {
                color: "Grafite",
                storage: ["512GB SSD", "1TB SSD"],
                image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=800",
                extraImages: [
                    "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&q=80&w=800"
                ]
            }
        ]
    },
    // --- APPLE LAPTOP ---
    {
        name: "MacBook Air 13 M3",
        brand: "Apple",
        category: "notebooks",
        price: 1249900,
        description: `MacBook Air M3.`,
        videoUrl: "https://www.youtube.com/embed/jQHQP8vV7zM",
        condition: ["Novo"],
        variants: [
            {
                color: "Meia-noite",
                storage: ["256GB SSD", "512GB SSD"],
                image: "https://images.unsplash.com/photo-1517336714731-489679bd1bab?auto=format&fit=crop&q=80&w=800",
                extraImages: ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800"]
            },
            {
                color: "Estelar",
                storage: ["256GB SSD"],
                image: "https://images.unsplash.com/photo-1531297461136-82lw8u221b6?auto=format&fit=crop&q=80&w=800",
                extraImages: ["https://images.unsplash.com/photo-1517336714731-489679bd1bab?auto=format&fit=crop&q=80&w=800"]
            }
        ]
    },
    // --- AUDIO ---
    {
        name: "Sony WH-1000XM5",
        brand: "Sony",
        category: "audio",
        price: 249900,
        description: `Cancelamento de ruído líder do setor e som de alta resolução.`,
        videoUrl: "https://www.youtube.com/embed/8Nq25wEe3TA",
        condition: ["Novo"],
        variants: [
            {
                color: "Preto",
                storage: ["N/A"],
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
                extraImages: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800"]
            }
        ]
    },
    {
        name: "JBL Boombox 3",
        brand: "JBL",
        category: "audio",
        price: 269900,
        description: `Som monstruoso com graves mais profundos.`,
        videoUrl: "https://www.youtube.com/embed/u1s3X-12lHw",
        condition: ["Novo"],
        variants: [
            {
                color: "Preto",
                storage: ["N/A"],
                image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800", // Generic Speaker
                extraImages: [
                    "https://images.unsplash.com/photo-1543512214-318c77a072d8?auto=format&fit=crop&q=80&w=800"
                ]
            }
        ]
    },
    // --- TV ---
    {
        name: "Smart TV LG OLED evo C3",
        brand: "LG",
        category: "eletronicos",
        price: 549900,
        description: `A melhor TV OLED do mundo ficou ainda melhor.`,
        videoUrl: "https://www.youtube.com/embed/Zz1C0k01xMg",
        condition: ["Novo"],
        variants: [
            {
                color: "Preto",
                storage: ["55 pol"],
                image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800",
                extraImages: [
                    "https://images.unsplash.com/photo-1593305841991-05c29736f9fa?auto=format&fit=crop&q=80&w=800"
                ]
            }
        ]
    }
];

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const limitStr = url.searchParams.get("limit");
        const limit = limitStr ? parseInt(limitStr) : 1000;

        let createdCount = 0;
        const productsToCreate: any[] = [];
        const imagesToCreate: any[] = [];

        console.log(`Starting strict seed for ${limit} products...`);

        // --- 1. CLEANUP (Optional but recommended for consistency if requested) ---
        // For now, we append. If user wants clean slate, we'd delete.

        let attempts = 0;
        // Keep generating until we hit limit or exhaust obvious combinations
        while (productsToCreate.length < limit && attempts < 200) {
            attempts++;

            for (const tpl of BASE_PRODUCTS) {
                if (productsToCreate.length >= limit) break;

                // Collect all images from all variants to use as a shared gallery
                const allVariantImages = tpl.variants.map(v => v.image);

                for (const variant of tpl.variants) {
                    for (const storage of variant.storage) {
                        for (const cond of tpl.condition) {
                            if (productsToCreate.length >= limit) break;

                            // Unique Identifier logic
                            const isUniqueRun = attempts === 1;
                            const suffix = isUniqueRun ? "" : ` #${Math.floor(Math.random() * 99999)}`;

                            const fullName = `${tpl.name} - ${variant.color} - ${storage}${cond !== "Novo" ? " (" + cond + ")" : ""}${suffix}`;

                            // Price logic
                            let priceMod = 1;
                            if (storage.includes("1TB")) priceMod = 1.4;
                            if (storage.includes("512GB")) priceMod = 1.25;
                            const finalPrice = Math.floor(tpl.price * priceMod);

                            const productId = crypto.randomUUID();

                            // STRICT VALIDATION: Proibido cadastrar sem imagem
                            if (!variant.image || variant.image.trim() === "") {
                                console.error(`CRITICAL: Attempted to seed product ${tpl.name} without an image. Skipping.`);
                                continue;
                            }

                            productsToCreate.push({
                                id: productId,
                                name: fullName,
                                description: tpl.description,
                                price: finalPrice,
                                stock: Math.floor(Math.random() * 50) + 5,
                                category: tpl.category,
                                imageUrl: variant.image, // STRICT mapping
                                videoUrl: tpl.videoUrl, // STRICT mapping
                                active: true,
                                currency: "BRL",
                                createdAt: new Date(),
                                updatedAt: new Date()
                            });

                            // Secondary images: Use ALL variant images + specific extras
                            const imgs = [...variant.extraImages, ...allVariantImages];
                            // De-duplicate URLs
                            const uniqueImgs = Array.from(new Set(imgs));

                            uniqueImgs.forEach(url => {
                                // Add all available images (main + extra) to gallery
                                if (url !== variant.image) {
                                    imagesToCreate.push({
                                        productId: productId,
                                        url: url,
                                        alt: fullName
                                    });
                                }
                            });
                        }
                    }
                }
            }
        }

        // Batch Insertion
        const CHUNK_SIZE = 100;
        for (let i = 0; i < productsToCreate.length; i += CHUNK_SIZE) {
            const productChunk = productsToCreate.slice(i, i + CHUNK_SIZE);
            const productIds = productChunk.map(p => p.id);
            const imageChunk = imagesToCreate.filter(img => productIds.includes(img.productId));

            await prisma.$transaction([
                prisma.product.createMany({ data: productChunk }),
                prisma.productImage.createMany({ data: imageChunk })
            ]);
            createdCount += productChunk.length;
            console.log(`Inserted chunk ${i} to ${i + CHUNK_SIZE}`);
        }

        return NextResponse.json({
            success: true,
            message: `Strict Seed Complete: ${createdCount} products.`,
            count: createdCount
        });
    } catch (error) {
        console.error("Seed Error:", error);
        return NextResponse.json({ error: "Failed", details: String(error) }, { status: 500 });
    }
}

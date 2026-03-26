import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ProductGallery } from "@/frontend/components/product/ProductGallery";
import { ProductInfo } from "@/frontend/components/product/ProductInfo";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) return { title: 'Produto não encontrado' };

    const cleanDescription = product.description.replace(/<[^>]*>/g, '').slice(0, 160);
    const priceFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 100);

    return {
        title: product.name,
        description: `${product.name} por ${priceFormatted}. ${cleanDescription}`,
        openGraph: {
            title: `${product.name} | SimplifyTech`,
            description: cleanDescription,
            type: "article",
            url: `/product/${id}`,
            images: [
                {
                    url: product.imageUrl,
                    width: 1000,
                    height: 1000,
                    alt: product.name,
                },
            ],
            siteName: "Simplify",
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: cleanDescription,
            images: [product.imageUrl],
        },
        alternates: {
            canonical: `/product/${id}`,
        },
    };
}

import { ProductReviews } from "@/frontend/components/product/ProductReviews";
import { BehaviorTracker } from "@/frontend/components/ai/BehaviorTracker";
import { AiProductRecommendations } from "@/frontend/components/product/AiProductRecommendations";
import { StickyAddToCart } from "@/frontend/components/product/StickyAddToCart";
import { ProductStructuredData } from "@/frontend/components/seo/StructuredData";

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;

    // Fetch product with images
    const product = await prisma.product.findUnique({
        where: { id },
        include: { images: true }
    });

    if (!product) {
        notFound();
    }

    // Prepare images array: [mainUrl, ...extraImages]
    const images = [
        product.imageUrl,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(product as any).images?.map((img: any) => img.url) || []
    ].filter(url => !!url && url.trim() !== '');

    // Deduplicate
    const uniqueImages = Array.from(new Set(images));

    // Serialize for component
    const serializedProduct = {
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        videoUrl: product.videoUrl ?? undefined
    };



    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans flex flex-col">
            <BehaviorTracker productId={product.id} />
            <ProductStructuredData product={product} />
            <StickyAddToCart product={product} />
            <main className="flex-1 container mx-auto px-4 pt-36 pb-20 text-black dark:text-white">
                <FadeIn>
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                            {/* Esquerda: Galeria */}
                            <div>
                                <ProductGallery
                                    images={uniqueImages}
                                    video={product.videoUrl}
                                    productName={product.name}
                                />
                            </div>

                            {/* Direita: Informações */}
                            <div className="sticky top-32 h-fit">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                <ProductInfo product={serializedProduct as any} />
                            </div>
                        </div>

                        {/* Avaliações */}
                        <ProductReviews productId={product.id} />

                        {/* IA Recommendations */}
                        <AiProductRecommendations />
                    </div>
                </FadeIn>
            </main>
        </div>
    );
}

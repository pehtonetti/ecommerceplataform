"use client";

import { ProductCard } from "../ui/ProductCard";

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    videoUrl?: string | null;
    category: string;
}

interface ProductGridSectionProps {
    title?: string;
    products?: Product[];
}

export function ProductGridSection({ title = "Produtos em Destaque", products = [] }: ProductGridSectionProps) {
    return (
        <section className="py-16 px-4">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {products.length === 0 && (
                    <p className="text-center text-muted-foreground py-12">
                        Nenhum produto disponível no momento.
                    </p>
                )}
            </div>
        </section>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from './ui/ProductCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
}

interface ProductSectionProps {
    title: string;
    subtitle?: string;
    products: Product[];
    viewAllLink?: string;
    icon?: React.ReactNode;
    layoutConfig?: any;
}

export default function ProductSection({
    title,
    subtitle,
    products,
    viewAllLink,
    icon,
    layoutConfig,
}: ProductSectionProps) {
    const [displayProducts, setDisplayProducts] = useState<Product[]>(products);

    useEffect(() => {
        setDisplayProducts(products);
    }, [products]);

    if (displayProducts.length === 0) {
        return null;
    }

    return (
        <section className="mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {icon && <div className="text-blue-600">{icon}</div>}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
                    </div>
                </div>

                {viewAllLink && (
                    <Link
                        href={viewAllLink}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                        Ver todos
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                )}
            </div>

            {/* Products Stream (Horizontal Scroll) */}
            <div className="flex overflow-x-auto pb-6 gap-4 snap-x scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700 px-1">
                {displayProducts.map((product) => (
                    <div key={product.id} className="w-[200px] md:w-[240px] flex-none snap-start">
                        <ProductCard product={product} layoutConfig={layoutConfig} />
                    </div>
                ))}
            </div>
        </section>
    );
}

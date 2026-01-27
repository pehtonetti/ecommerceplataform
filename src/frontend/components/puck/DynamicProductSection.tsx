'use client';

import { useEffect, useState } from 'react';
import ProductSection from '../ProductSection';
import { Tag, TrendingUp, Clock, Search } from 'lucide-react';

interface DynamicProductSectionProps {
    title: string;
    subtitle?: string;
    type: 'trending' | 'promo' | 'new' | 'viewed';
    maxPrice?: number;
}

export default function DynamicProductSection({ title, subtitle, type, maxPrice }: DynamicProductSectionProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // In a real app, pass type as query param: /api/products?type=${type}
                // For now, we fetch all and filter/slice client side as a demo
                const res = await fetch('/api/products');
                const allProducts = await res.json();

                let filtered = allProducts;

                if (type === 'promo' || maxPrice) {
                    filtered = filtered.filter((p: any) => p.price < (maxPrice || 100) * 100);
                } else if (type === 'new') {
                    // Mock sort by date (assuming id correlates or random for demo)
                    filtered = filtered.slice(0, 5);
                }

                setProducts(filtered.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch products for puck section", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [type, maxPrice]);

    if (loading) return <div className="p-8 text-center text-gray-400">Carregando produtos...</div>;

    const icon = type === 'trending' ? <TrendingUp className="w-6 h-6" /> :
        type === 'promo' ? <Tag className="w-6 h-6" /> :
            type === 'viewed' ? <Clock className="w-6 h-6" /> :
                <Search className="w-6 h-6" />;

    return (
        <ProductSection
            title={title}
            subtitle={subtitle}
            products={products}
            icon={icon}
            viewAllLink="/search"
        />
    );
}

"use client";

import { useEffect, useState } from "react";
import { getWishlist } from "@/backend/actions/wishlist-actions";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/frontend/components/ui/Motion";
import { ProductCard } from "@/frontend/components/ui/ProductCard";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/frontend/components/ui/Button";

export default function WishlistPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getWishlist().then(data => {
            setItems(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-20 text-center">Carregando seus favoritos...</div>;

    return (
        <div className="container mx-auto px-4 pt-32 pb-20">
            <FadeIn>
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                    <h1 className="text-3xl font-bold">Meus Favoritos</h1>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-border">
                        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h2 className="text-xl font-medium mb-2">Sua lista está vazia</h2>
                        <p className="text-muted-foreground mb-6">Explore nossos produtos e salve os seus favoritos aqui.</p>
                        <Link href="/">
                            <Button className="mx-auto">Explorar Produtos</Button>
                        </Link>
                    </div>
                ) : (
                    <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {items.map((item: any) => (
                            <FadeInStaggerItem key={item.id}>
                                <div className="relative group">
                                    <ProductCard product={item.product} />
                                </div>
                            </FadeInStaggerItem>
                        ))}
                    </FadeInStagger>
                )}
            </FadeIn>
        </div>
    );
}

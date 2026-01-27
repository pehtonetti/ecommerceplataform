"use client";

import { Button } from "@/frontend/components/ui/Button";
import { ShoppingCart, Heart, Share2, ShieldCheck } from "lucide-react";
import { Product } from "@/backend/types";
import { addToCart } from "@/backend/actions/cart-actions";
import { toast } from "sonner";
import { useState } from "react";
import { ShippingCalculator } from "@/frontend/components/product/ShippingCalculator";

export function ProductInfo({ product }: { product: Product }) {
    const [isLoading, setIsLoading] = useState(false);
    const priceFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: product.currency }).format(product.price / 100);

    const handleAddToCart = async () => {
        setIsLoading(true);
        try {
            const res = await addToCart(product.id, 1);
            if (res?.success) {
                toast.success("Produto adicionado ao carrinho!");
                window.dispatchEvent(new Event('cart-updated'));
            } else if (res?.error === 'NOT_AUTHENTICATED') {
                toast.error("Faça login para adicionar ao carrinho");
            } else {
                toast.error("Erro ao adicionar produto");
            }
        } catch (error) {
            toast.error("Erro inesperado");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                    {product.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium text-xs">
                        {product.category}
                    </span>
                    <span>SKU: {product.id.slice(0, 8)}</span>
                </div>
            </div>

            <div className="border-t border-b border-border py-4 space-y-1">
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{priceFormatted}</span>
                    <span className="text-sm text-gray-500 mb-1.5 line-through">
                        {/* Mock de "De: Por:" apenas visual */}
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: product.currency }).format((product.price * 1.2) / 100)}
                    </span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Em até 10x sem juros de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: product.currency }).format((product.price / 100) / 10)}
                </p>
            </div>

            <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300">
                <p>{product.description}</p>
            </div>

            {/* Urgência & Recompensas */}
            <div className="space-y-3 pb-2">
                {product.stock > 0 && product.stock <= 10 && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30 text-sm animate-pulse">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <strong>Urgência:</strong> Restam apenas {product.stock} unidades em estoque!
                    </div>
                )}

                <ShippingCalculator />

                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-900/20 text-sm">
                    <span className="font-bold">✨ Reward:</span> Compre e ganhe {Math.floor(product.price / 100)} pontos de fidelidade!
                </div>
            </div>

            <div className="space-y-3 pt-4">
                <Button
                    size="lg"
                    className="w-full text-lg h-12 gap-2 shadow-lg shadow-primary/20"
                    onClick={handleAddToCart}
                    disabled={isLoading}
                >
                    <ShoppingCart className="h-5 w-5" />
                    {isLoading ? "Adicionando..." : "Adicionar ao Carrinho"}
                </Button>
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={async () => {
                            const { toggleWishlist } = await import('@/backend/actions/wishlist-actions');
                            try {
                                const res = await toggleWishlist(product.id);
                                if (res.error) {
                                    // Check for specific error messages if needed, e.g. login
                                    if (res.error === "Login required") toast.error("Faça login para favoritar");
                                    else toast.error(res.error);
                                } else {
                                    toast.success(res.action === 'added' ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
                                }
                            } catch (e) {
                                toast.error("Erro ao favoritar");
                            }
                        }}
                    >
                        <Heart className="h-4 w-4 mr-2" /> Favoritar
                    </Button>
                    <Button variant="outline" size="lg" className="w-full">
                        <Share2 className="h-4 w-4 mr-2" /> Compartilhar
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span>Compra Garantida e Envio Rápido</span>
            </div>
        </div>
    );
}

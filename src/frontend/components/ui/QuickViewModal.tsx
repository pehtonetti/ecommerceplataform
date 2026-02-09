"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Star, ShieldCheck, Heart } from "lucide-react";
import { Button } from "./Button";
import { toast } from "sonner";
import { useState } from "react";
import { useCart } from "@/frontend/contexts/CartContext";

export function QuickViewModal({ product, isOpen, onClose }: { product: any, isOpen: boolean, onClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const { addToCart } = useCart();

    if (!product) return null;

    const priceFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 100);

    const handleAddToCart = async () => {
        setIsLoading(true);
        await addToCart(product.id, 1);
        setIsLoading(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20 rounded-full backdrop-blur-md transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Image Side */}
                        <div className="w-full md:w-1/2 h-64 md:h-auto bg-white dark:bg-zinc-950 flex items-center justify-center p-8">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Content Side */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                            <div className="space-y-6">
                                <div>
                                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{product.category}</span>
                                    <h2 className="text-3xl font-black mt-1 leading-tight">{product.name}</h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex text-yellow-500">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                                        </div>
                                        <span className="text-xs text-muted-foreground">(4.8 • 120 avaliações)</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-4xl font-black text-primary">{priceFormatted}</p>
                                    <p className="text-xs text-green-600 font-bold uppercase">Disponível em Estoque</p>
                                </div>

                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                                    {product.description}
                                </p>

                                <div className="pt-4 space-y-3">
                                    <Button className="w-full h-14 text-lg gap-2" onClick={handleAddToCart} disabled={isLoading}>
                                        <ShoppingCart className="w-5 h-5" />
                                        {isLoading ? "Adicionando..." : "Adicionar ao Carrinho"}
                                    </Button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline" className="w-full gap-2">
                                            <Heart className="w-4 h-4" /> Favoritar
                                        </Button>
                                        <Button variant="outline" className="w-full" onClick={onClose}>
                                            Ver Mais Detalhes
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-border">
                                    <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                                        Compra 100% Segura <br /> 7 dias para devolução
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

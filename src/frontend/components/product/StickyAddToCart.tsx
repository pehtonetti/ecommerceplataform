"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useCart } from "@/frontend/contexts/CartContext";

export function StickyAddToCart({ product }: { product: any }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { addToCart } = useCart();

    const handleAdd = async () => {
        setIsLoading(true);
        await addToCart(product.id, 1);
        setIsLoading(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            // Show bar after scrolling 600px
            setIsVisible(window.scrollY > 600);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 z-[80] md:hidden bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-border p-4 safe-bottom"
                >
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{product.name}</p>
                            <p className="text-primary font-black">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 100)}
                            </p>
                        </div>
                        <Button
                            className="flex-1 shadow-lg shadow-primary/20 gap-2 h-12"
                            onClick={handleAdd}
                            disabled={isLoading}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {isLoading ? "..." : "Comprar"}
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

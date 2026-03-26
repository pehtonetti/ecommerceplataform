"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { getCart, removeFromCart, updateCartItemQuantity } from "@/backend/actions/cart-actions";
import { Button } from "./Button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCart } from "@/frontend/contexts/CartContext";

export function MiniCart() {
    const { cart, isOpen, openCart, closeCart, removeFromCart, updateQuantity, isLoading } = useCart();

    // We can rely on context for state. 
    // Wait, the button triggers 'openCart'.
    // The previous implementation had 'setIsOpen'.

    const subtotal = cart?.items?.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0) || 0;

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={openCart}
                className="relative p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
                <ShoppingBag className="w-6 h-6" />
                {mounted && cart?.items?.length > 0 && (
                    <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {cart.items.length}
                    </span>
                )}
            </button>

            {/* Portal for Sidebar */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={closeCart}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] cursor-pointer"
                            />

                            {/* Sidebar */}
                            <motion.aside
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-zinc-900 shadow-2xl z-[9999] flex flex-col font-sans"
                            >
                                {/* Header */}
                                <div className="p-6 border-b border-border flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ShoppingCart className="w-5 h-5 text-primary" />
                                        <h2 className="text-xl font-bold">Resumo do Carrinho</h2>
                                    </div>
                                    <button onClick={closeCart} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Items List */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {isLoading ? (
                                        <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-2">
                                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            Carregando...
                                        </div>
                                    ) : !cart?.items || cart.items.length === 0 ? (
                                        <div className="text-center py-20">
                                            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
                                            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
                                            <Button variant="outline" className="mt-4" onClick={closeCart}>Começar a Comprar</Button>
                                        </div>
                                    ) : (
                                        cart.items.map((item: any) => (
                                            <div key={item.id} className="flex gap-4 group">
                                                <div className="w-20 h-20 rounded-xl overflow-hidden border border-border flex-shrink-0 relative">
                                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{item.product.name}</p>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="flex items-center border border-border rounded-lg bg-gray-50 dark:bg-zinc-800">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                disabled={isLoading || item.quantity <= 1}
                                                                className="w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-l-lg transition-colors disabled:opacity-50"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                disabled={isLoading}
                                                                className="w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-r-lg transition-colors disabled:opacity-50"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price / 100)}</span>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-[10px] text-red-500 hover:underline mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-3 h-3" /> Remover
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((item.product.price * item.quantity) / 100)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Footer */}
                                {cart?.items?.length > 0 && subtotal > 0 && (
                                    <div className="p-6 border-t border-border bg-gray-50 dark:bg-zinc-950/50 space-y-4">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-muted-foreground text-sm uppercase font-medium tracking-wider">Subtotal</span>
                                            <span className="text-2xl font-black text-primary">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal / 100)}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">Taxas e frete calculados no checkout</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            <Link href="/cart" onClick={closeCart}>
                                                <Button variant="outline" className="w-full">Ver Carrinho Completo</Button>
                                            </Link>
                                            <Link href="/checkout" onClick={closeCart}>
                                                <Button className="w-full gap-2">
                                                    Finalizar Compra <ArrowRight className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}

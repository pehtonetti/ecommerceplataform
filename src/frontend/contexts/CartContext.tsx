"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { getCart, addToCart as serverAddToCart, removeFromCart as serverRemoveFromCart, updateCartItemQuantity as serverUpdateQuantity } from "@/backend/actions/cart-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CartContextType {
    cart: any;
    isOpen: boolean;
    isLoading: boolean;
    addToCart: (productId: string, quantity: number, options?: { color?: string, capacity?: string }) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    fetchCart: () => Promise<void>;
    isMounted: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children, initialCart }: { children: ReactNode, initialCart?: any }) {
    const [cart, setCart] = useState<any>(initialCart || null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Fetch cart on mount and when interactions happen
    const fetchCart = useCallback(async () => {
        // Only show loading indicator on initial fetch if cart is empty, to avoid flickering during updates
        const isInitial = !cart;
        if (isInitial) setIsLoading(true);

        try {
            const data = await getCart();
            if (data && data.cart) {
                setCart(data.cart);
            } else {
                setCart(null);
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            if (isInitial) setIsLoading(false);
        }
    }, [cart]);

    // Initial fetch
    useEffect(() => {
        fetchCart();

        // Listen for cross-tab or external updates if needed in future
        // For now, internal state is enough
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);
    const toggleCart = () => setIsOpen((prev) => !prev);

    const addToCart = async (productId: string, quantity: number, options?: { color?: string, capacity?: string }) => {
        setIsLoading(true); // Optimistic UI could be better, but simple for now
        try {
            const res = await serverAddToCart(productId, quantity, options);

            if (res.error === 'NOT_AUTHENTICATED') {
                toast.error('Faça login para adicionar ao carrinho');
                router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
                // Maybe still open cart? No.
            } else if (res.error) {
                toast.error(res.error);
            } else {
                toast.success('Produto adicionado ao carrinho!');
                await fetchCart(); // Refresh state
                openCart(); // Auto-open cart on add
            }
        } catch (error) {
            toast.error('Erro ao adicionar produto');
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (itemId: string) => {
        // Optimistic update
        const previousCart = cart;
        setCart((prev: any) => ({
            ...prev,
            items: prev.items.filter((item: any) => item.id !== itemId)
        }));

        try {
            const res = await serverRemoveFromCart(itemId);
            if (res.error) {
                toast.error(res.error);
                setCart(previousCart); // Revert
            } else {
                // Success, implicit
                await fetchCart(); // Ensure sync
            }
        } catch (error) {
            toast.error('Erro ao remover produto');
            setCart(previousCart);
        }
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        // Optimistic
        const previousCart = cart;
        setCart((prev: any) => ({
            ...prev,
            items: prev.items.map((item: any) =>
                item.id === itemId ? { ...item, quantity } : item
            )
        }));

        try {
            const res = await serverUpdateQuantity(itemId, quantity);
            if (res.error) {
                toast.error(res.error);
                setCart(previousCart);
            } else {
                await fetchCart();
            }
        } catch (error) {
            toast.error('Erro ao atualizar quantidade');
            setCart(previousCart);
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            isOpen,
            isLoading,
            addToCart,
            removeFromCart,
            updateQuantity,
            openCart,
            closeCart,
            toggleCart,
            fetchCart,
            isMounted // Expose for consumers to guard hydration
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

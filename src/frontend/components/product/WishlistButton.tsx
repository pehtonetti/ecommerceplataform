"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { toggleWishlist, checkIsInWishlist } from "@/backend/actions/wishlist-actions";
import { cn } from "@/lib/utils"; // Assuming utils exists for class merging, or just template literals

interface WishlistButtonProps {
    productId: string;
    className?: string;
    initialIsActive?: boolean;
}

export function WishlistButton({ productId, className, initialIsActive = false }: WishlistButtonProps) {
    const [isActive, setIsActive] = useState(initialIsActive);
    const [isLoading, setIsLoading] = useState(false);

    // Ideally, we might want to check status on mount if not provided,
    // but for list views, passing down initial state is better for performance.
    // For now, we will trust the passed prop or fetch if needed in a parent.
    // Let's stick with local toggle for speed.

    // Quick fetch to verify if not strictly provided/guaranteed
    useEffect(() => {
        if (!initialIsActive) {
            // checkIsInWishlist(productId).then(setIsActive);
            // Actually, let's avoid n+1 fetches on lists. 
            // We will assume `initialIsActive` is passed correctly or defaults to false.
        }
    }, [productId, initialIsActive]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to product if inside a link
        e.stopPropagation();

        const previousState = isActive;
        setIsActive(!isActive); // Optimistic update
        setIsLoading(true);

        try {
            const result = await toggleWishlist(productId);
            if (result.error) {
                if (result.error === "Login required") {
                    toast.error("Faça login para adicionar aos favoritos");
                } else {
                    toast.error(result.error);
                }
                setIsActive(previousState); // Revert
            } else {
                if (result.action === "added") {
                    toast.success("Adicionado aos favoritos");
                } else {
                    toast.success("Removido dos favoritos");
                }
            }
        } catch (error) {
            setIsActive(previousState);
            toast.error("Erro ao atualizar favoritos");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={cn(
                "p-2 rounded-full transition-all duration-200 hover:scale-110",
                isActive
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-black/5 hover:bg-black/10 text-muted-foreground dark:bg-white/10 dark:hover:bg-white/20",
                className
            )}
            title={isActive ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
            <Heart className={cn("w-5 h-5", isActive && "fill-current")} />
        </button>
    );
}

"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Login required" };

    try {
        const existingItem = await prisma.wishlistItem.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: productId
                }
            }
        });

        if (existingItem) {
            await prisma.wishlistItem.delete({
                where: { id: existingItem.id }
            });
            revalidatePath('/account/wishlist');
            return { success: true, action: "removed" };
        } else {
            await prisma.wishlistItem.create({
                data: {
                    userId: user.id,
                    productId: productId
                }
            });
            revalidatePath('/account/wishlist');
            return { success: true, action: "added" };
        }
    } catch (error) {
        console.error("Wishlist Toggle Error:", error);
        return { success: false, error: "Erro ao atualizar favoritos" };
    }
}

export async function getWishlist() {
    const user = await getCurrentUser();
    if (!user) return { items: [] };

    try {
        const wishlist = await prisma.wishlistItem.findMany({
            where: { userId: user.id },
            include: { product: true }
        });
        return { items: wishlist };
    } catch (error) {
        console.error("Wishlist Fetch Error:", error);
        return { success: false, error: "Erro ao buscar favoritos", items: [] };
    }
}

export async function checkIsInWishlist(productId: string) {
    const user = await getCurrentUser();
    if (!user) return false;

    const count = await prisma.wishlistItem.count({
        where: {
            userId: user.id,
            productId: productId
        }
    });

    return count > 0;
}

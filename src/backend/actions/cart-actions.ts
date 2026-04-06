'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// Helper to get or create session ID
async function getCartSessionId() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cart_session");

    if (sessionCookie?.value) {
        return sessionCookie.value;
    }

    // Create new session ID
    const newSessionId = uuidv4();
    cookieStore.set("cart_session", newSessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
    });

    return newSessionId;
}

/**
 * Adiciona produto ao carrinho
 */
export async function addToCart(productId: string, quantity: number = 1, options?: { color?: string, capacity?: string }) {
    try {
        const user = await import("@/lib/auth").then(m => m.getCurrentUser());

        let userId = user?.id;
        let sessionId = null;

        if (!userId) {
            sessionId = await getCartSessionId();
        }

        // Buscar ou criar carrinho
        let cart;

        if (userId) {
            cart = await prisma.cart.findUnique({
                where: { userId },
                include: { items: true }
            });
        } else if (sessionId) {
            cart = await prisma.cart.findUnique({
                where: { sessionId },
                include: { items: true }
            });
        }

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId: userId || null,
                    sessionId: sessionId || null,
                    items: {
                        create: {
                            productId,
                            quantity,
                            selectedColor: options?.color,
                            selectedCapacity: options?.capacity
                        }
                    }
                },
                include: { items: true }
            });
        } else {
            // Verificar se produto já está no carrinho COM AS MESMAS OPÇÕES
            // Note: In Javascript we have to filter manually if unique constraint isn't perfect or just to be safe logic
            // But Prisma find requires ID or unique. We can't easily "find" by composite fields in the array
            // We iterate.
            const existingItem = cart.items.find(item =>
                item.productId === productId &&
                (item as any).selectedColor === options?.color &&
                (item as any).selectedCapacity === options?.capacity
            );

            if (existingItem) {
                // Atualizar quantidade
                await prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: {
                        quantity: existingItem.quantity + quantity
                    }
                });
            } else {
                // Adicionar novo item
                await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId,
                        quantity,
                        selectedColor: options?.color,
                        selectedCapacity: options?.capacity
                    }
                });
            }
        }

        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        return { success: false, error: 'Erro ao adicionar produto' };
    }
}

/**
 * Remove produto do carrinho
 */
export async function removeFromCart(cartItemId: string) {
    try {
        await prisma.cartItem.delete({
            where: { id: cartItemId }
        });

        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        console.error('Erro ao remover do carrinho:', error);
        return { success: false, error: 'Erro ao remover produto' };
    }
}

/**
 * Atualiza quantidade de um item
 */
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
    try {
        if (quantity <= 0) {
            return removeFromCart(cartItemId);
        }

        await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity }
        });

        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        console.error('Erro ao atualizar quantidade:', error);
        return { success: false, error: 'Erro ao atualizar quantidade' };
    }
}

/**
 * Busca carrinho do usuário
 */
export async function getCart(userId?: string) {
    try {
        let cart;

        if (userId) {
            cart = await prisma.cart.findUnique({
                where: { userId },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });
        } else {
            const user = await import("@/lib/auth").then(m => m.getCurrentUser());
            if (user) {
                cart = await prisma.cart.findUnique({
                    where: { userId: user.id },
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    }
                });
            } else {
                // Guest user
                const cookieStore = await cookies();
                const sessionCookie = cookieStore.get("cart_session");

                if (sessionCookie?.value) {
                    cart = await prisma.cart.findUnique({
                        where: { sessionId: sessionCookie.value },
                        include: {
                            items: {
                                include: {
                                    product: true
                                }
                            }
                        }
                    });
                }
            }
        }

        // Serialize dates to avoid hydration mismatch
        const serializedCart = cart ? JSON.parse(JSON.stringify(cart)) : null;

        return { success: true, cart: serializedCart };
    } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
        return { success: false, error: 'Erro ao buscar carrinho' };
    }
}

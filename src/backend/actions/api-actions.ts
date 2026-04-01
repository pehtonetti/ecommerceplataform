'use server'

import { prisma } from "@/lib/prisma";
import { getStoreContext } from "@/backend/lib/store-context";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";

export async function getApiKeys() {
    const store = await getStoreContext();
    if (!store) return [];

    return await prisma.apiKey.findMany({
        where: { storeId: store.id },
        orderBy: { createdAt: 'desc' }
    });
}

export async function createApiKey(name: string) {
    const store = await getStoreContext();
    if (!store) throw new Error("Unauthorized");

    const key = `sk_${randomBytes(16).toString('hex')}`;

    await prisma.apiKey.create({
        data: {
            storeId: store.id,
            key,
            name: name || "Chave de Produção"
        }
    });

    revalidatePath('/dashboard/settings/api');
    return { success: true, key }; // Returning the key ONLY ONCE during creation
}

export async function deleteApiKey(id: string) {
    const store = await getStoreContext();
    if (!store) throw new Error("Unauthorized");

    await prisma.apiKey.delete({
        where: { id, storeId: store.id }
    });

    revalidatePath('/dashboard/settings/api');
    return { success: true };
}

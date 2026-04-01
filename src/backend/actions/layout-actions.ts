'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getStoreId } from "@/backend/lib/store-context";

export async function saveLayoutConfig(data: any) {
    const storeId = await getStoreId();

    await prisma.store.update({
        where: { id: storeId },
        data: {
            homeLayout: JSON.stringify(data)
        }
    });

    revalidatePath('/');
}

export async function getLayoutConfig() {
    const storeId = await getStoreId();
    const config = await prisma.store.findUnique({
        where: { id: storeId }
    });

    if (config && config.homeLayout) {
        return JSON.parse(config.homeLayout as string);
    }

    return null;
}

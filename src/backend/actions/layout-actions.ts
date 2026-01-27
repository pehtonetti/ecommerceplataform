'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveLayoutConfig(data: any) {
    // Save Generic Puck Data
    const configId = "config_main";

    await prisma.storeConfig.upsert({
        where: { id: configId },
        update: {
            homeLayout: JSON.stringify(data)
        },
        create: {
            id: configId,
            storeName: "My Store",
            homeLayout: JSON.stringify(data)
        }
    });

    revalidatePath('/');
}

export async function getLayoutConfig() {
    const config = await prisma.storeConfig.findUnique({
        where: { id: "config_main" }
    });

    if (config && config.homeLayout) {
        return JSON.parse(config.homeLayout as string);
    }

    return null;
}

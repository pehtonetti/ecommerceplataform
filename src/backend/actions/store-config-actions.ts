'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateStoreOriginZip(zipCode: string) {
    const config = await prisma.storeConfig.findFirst();

    if (config) {
        await prisma.storeConfig.update({
            where: { id: config.id },
            data: { originZipCode: zipCode }
        });
    } else {
        await prisma.storeConfig.create({
            data: {
                storeName: 'Loja Tech',
                originZipCode: zipCode
            }
        });
    }

    revalidatePath('/admin/shipping');
}

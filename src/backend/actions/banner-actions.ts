'use server'

import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/backend/lib/store-context";
import { revalidatePath } from "next/cache";

export async function getBanners() {
    const storeId = await getStoreId();
    return await prisma.banner.findMany({
        where: { storeId, active: true },
        orderBy: { order: 'asc' }
    });
}

export async function createBanner(formData: FormData) {
    const storeId = await getStoreId();
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const link = formData.get('link') as string || "/";
    const order = parseInt(formData.get('order') as string || "0");

    if (!title || !imageUrl) {
        return { error: 'Título e Imagem são obrigatórios.' };
    }

    try {
        await prisma.banner.create({
            data: {
                storeId,
                title,
                subtitle,
                imageUrl,
                link,
                order,
                active: true
            }
        });

        revalidatePath('/');
        revalidatePath('/dashboard/marketing');
        return { success: true };
    } catch (error) {
        console.error("Error creating banner:", error);
        return { error: 'Erro ao criar banner.' };
    }
}

export async function deleteBanner(id: string) {
    const storeId = await getStoreId();
    try {
        await prisma.banner.deleteMany({
            where: { id, storeId }
        });
        revalidatePath('/');
        revalidatePath('/dashboard/marketing');
        return { success: true };
    } catch (error) {
        return { error: 'Erro ao deletar banner.' };
    }
}

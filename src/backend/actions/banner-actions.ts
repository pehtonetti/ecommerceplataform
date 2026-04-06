'use server'

import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/backend/lib/store-context";
import { revalidatePath } from "next/cache";

export async function getBanners() {
    try {
        const storeId = await getStoreId();
        const banners = await prisma.banner.findMany({
            where: { storeId, active: true },
            orderBy: { order: 'asc' }
        });
        return { success: true, banners };
    } catch (error) {
        console.error("Error fetching banners:", error);
        return { success: false, error: 'Erro ao buscar banners' };
    }
}

export async function getAllBanners() {
    try {
        const storeId = await getStoreId();
        const banners = await prisma.banner.findMany({
            where: { storeId },
            orderBy: { order: 'asc' },
        });
        return { success: true, banners };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        return { success: false, error: 'Erro ao buscar banners', banners: [] };
    }
}

export async function createBanner(formData: FormData) {
    const storeId = await getStoreId();
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const link = formData.get('link') as string || "/";
    const order = parseInt(formData.get('order') as string || "0");

    if (!title || !imageUrl) {
        return { success: false, error: 'Título e Imagem são obrigatórios.' };
    }

    try {
        await prisma.banner.create({
            data: { storeId, title, subtitle, imageUrl, link, order, active: true }
        });

        revalidatePath('/');
        revalidatePath('/dashboard/banners');
        return { success: true };
    } catch (error) {
        console.error("Error creating banner:", error);
        return { success: false, error: 'Erro ao criar banner.' };
    }
}

export async function updateBanner(id: string, formData: FormData) {
    try {
        const storeId = await getStoreId();
        const banner = await prisma.banner.findFirst({ where: { id, storeId } });
        if (!banner) return { success: false, error: 'Banner não encontrado' };

        const title = formData.get('title')?.toString() || banner.title;
        const subtitle = formData.get('subtitle')?.toString() || null;
        const imageUrl = formData.get('imageUrl')?.toString() || banner.imageUrl;
        const link = formData.get('link')?.toString() || banner.link;
        const order = parseInt(formData.get('order')?.toString() || String(banner.order));

        await prisma.banner.update({ where: { id }, data: { title, subtitle, imageUrl, link, order } });

        revalidatePath('/dashboard/banners');
        revalidatePath('/');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Update Banner Error', e);
        return { success: false, error: 'Erro ao atualizar banner' };
    }
}

export async function toggleBannerActive(id: string, active: boolean) {
    try {
        const storeId = await getStoreId();
        const banner = await prisma.banner.findFirst({ where: { id, storeId } });
        if (!banner) return { success: false, error: 'Banner não encontrado' };

        await prisma.banner.update({ where: { id }, data: { active } });

        revalidatePath('/dashboard/banners');
        revalidatePath('/');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        return { success: false, error: 'Erro ao atualizar banner' };
    }
}

export async function deleteBanner(id: string) {
    const storeId = await getStoreId();
    try {
        await prisma.banner.deleteMany({ where: { id, storeId } });
        revalidatePath('/');
        revalidatePath('/dashboard/banners');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Erro ao deletar banner.' };
    }
}

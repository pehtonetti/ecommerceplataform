'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getStoreId } from "@/backend/lib/store-context";

export async function saveLayoutConfig(data: any) {
    try {
        const storeId = await getStoreId();

        await prisma.store.update({
            where: { id: storeId },
            data: {
                homeLayout: JSON.stringify(data)
            }
        });

        revalidatePath('/');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Save Layout Config Error', e);
        return { success: false, error: 'Erro ao salvar configuração de layout' };
    }
}

export async function getLayoutConfig() {
    try {
        const storeId = await getStoreId();
        const config = await prisma.store.findUnique({
            where: { id: storeId }
        });

        if (config && config.homeLayout) {
            return { success: true, layout: JSON.parse(config.homeLayout as string) };
        }

        return { success: true, layout: null };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Get Layout Config Error', e);
        return { success: false, error: 'Erro ao buscar configuração de layout' };
    }
}

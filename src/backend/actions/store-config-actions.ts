'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { validatePixKey } from "@/lib/pix";
import { getStoreId } from "@/backend/lib/store-context";

/**
 * Busca configurações da loja baseada no acesso
 */
export async function getStoreConfig() {
    try {
        const storeId = await getStoreId();
        const config = await prisma.store.findUnique({
            where: { id: storeId }
        });
        return { success: true, config };
    } catch (error) {
        console.error("Erro ao buscar configurações:", error);
        return { error: "Erro ao buscar configurações" };
    }
}

/**
 * Atualiza configurações da loja local (Store model)
 */
export async function updateStoreConfig(data: {
    name?: string;
    pixKey?: string;
    originZipCode?: string;
    whatsappNumber?: string;
    googleAnalyticsId?: string;
    facebookPixelId?: string;
}) {
    try {
        const storeId = await getStoreId();

        // Valida chave PIX se fornecida
        if (data.pixKey) {
            const validation = validatePixKey(data.pixKey);
            if (!validation.valid) {
                return { error: validation.error || "Chave PIX inválida" };
            }
        }

        const config = await prisma.store.update({
            where: { id: storeId },
            data: {
                name: data.name || "Minha Loja",
                pixKey: data.pixKey,
                originZipCode: data.originZipCode,
                whatsappNumber: data.whatsappNumber,
                googleAnalyticsId: data.googleAnalyticsId,
                facebookPixelId: data.facebookPixelId,
            }
        });

        revalidatePath('/dashboard/settings');
        revalidatePath('/checkout');

        return { success: true, config };
    } catch (error) {
        console.error("Erro ao atualizar configurações:", error);
        return { error: "Erro ao salvar configurações" };
    }
}

/**
 * Atualiza configurações de Aparência da Loja (Theme Engine)
 */
export async function updateStoreAppearance(data: {
    primaryColor?: string;
    theme?: string;
    logoUrl?: string;
}) {
    try {
        const storeId = await getStoreId();

        const config = await prisma.store.update({
            where: { id: storeId },
            data: {
                primaryColor: data.primaryColor,
                theme: data.theme,
                logoUrl: data.logoUrl,
            }
        });

        revalidatePath('/dashboard/settings/appearance');
        revalidatePath('/'); // Revalida a storefront 

        return { success: true, config };
    } catch (error) {
        console.error("Erro ao atualizar aparência:", error);
        return { error: "Erro ao salvar configurações de aparência" };
    }
}

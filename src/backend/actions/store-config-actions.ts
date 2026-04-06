'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { validatePixKey } from "@/lib/pix";
import { getStoreId } from "@/backend/lib/store-context";

// Tipo explícito para evitar inferência incorreta de 'Store | {}'
export type StoreConfig = {
    id: string;
    name: string;
    slug: string;
    plan: string;
    ownerId: string;
    logoUrl: string | null;
    faviconUrl: string | null;
    primaryColor: string | null;
    theme: string | null;
    currency: string;
    locale: string;
    originZipCode: string | null;
    whatsappNumber: string | null;
    pixKey: string | null;
    googleAnalyticsId: string | null;
    facebookPixelId: string | null;
    homeLayout: string | null;
    merchantCity: string | null;
    whatsappMessage: string | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    customDomain: string | null;
};

/**
 * Busca configurações da loja baseada no acesso
 */
export async function getStoreConfig(): Promise<
    { success: true; config: StoreConfig | null } |
    { success: false; error: string }
> {
    try {
        const storeId = await getStoreId();
        const config = await prisma.store.findUnique({
            where: { id: storeId }
        }) as StoreConfig | null;
        return { success: true, config };
    } catch (error) {
        console.error("Erro ao buscar configurações:", error);
        return { success: false, error: "Erro ao buscar configurações" };
    }
}

/**
 * Atualiza configurações da loja local (Store model)
 */
export async function updateStoreConfig(data: {
    name?: string;
    pixKey?: string;
    merchantCity?: string;
    originZipCode?: string;
    whatsappNumber?: string;
    whatsappMessage?: string;
    googleAnalyticsId?: string;
    facebookPixelId?: string;
}) {
    try {
        const storeId = await getStoreId();

        // Valida chave PIX se fornecida
        if (data.pixKey) {
            const validation = validatePixKey(data.pixKey);
            if (!validation.valid) {
                return { success: false, error: validation.error || "Chave PIX inválida" };
            }
        }

        const config = await prisma.store.update({
            where: { id: storeId },
            data: {
                name: data.name || "Minha Loja",
                pixKey: data.pixKey,
                merchantCity: data.merchantCity,
                originZipCode: data.originZipCode,
                whatsappNumber: data.whatsappNumber,
                whatsappMessage: data.whatsappMessage,
                googleAnalyticsId: data.googleAnalyticsId,
                facebookPixelId: data.facebookPixelId,
            }
        });

        revalidatePath('/dashboard/settings');
        revalidatePath('/checkout');

        return { success: true, config };
    } catch (error) {
        console.error("Erro ao atualizar configurações:", error);
        return { success: false, error: "Erro ao salvar configurações" };
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
        return { success: false, error: "Erro ao salvar configurações de aparência" };
    }
}

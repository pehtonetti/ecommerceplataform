'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { validatePixKey } from "@/lib/pix";

/**
 * Busca configurações da loja
 */
export async function getStoreConfig() {
    try {
        const config = await prisma.storeConfig.findFirst();
        return { success: true, config };
    } catch (error) {
        console.error("Erro ao buscar configurações:", error);
        return { error: "Erro ao buscar configurações" };
    }
}

/**
 * Atualiza configurações da loja
 */
export async function updateStoreConfig(data: {
    storeName?: string;
    pixKey?: string;
    merchantCity?: string;
    originZipCode?: string;
    whatsappNumber?: string;
    whatsappMessage?: string;
}) {
    try {
        // Valida chave PIX se fornecida
        if (data.pixKey) {
            const validation = validatePixKey(data.pixKey);
            if (!validation.valid) {
                return { error: validation.error || "Chave PIX inválida" };
            }
        }

        // Busca configuração existente
        const existingConfig = await prisma.storeConfig.findFirst();

        let config;
        if (existingConfig) {
            // Atualiza configuração existente
            config = await prisma.storeConfig.update({
                where: { id: existingConfig.id },
                data: {
                    ...data,
                    updatedAt: new Date()
                }
            });
        } else {
            // Cria nova configuração
            config = await prisma.storeConfig.create({
                data: {
                    storeName: data.storeName || "Minha Loja",
                    pixKey: data.pixKey,
                    merchantCity: data.merchantCity,
                    originZipCode: data.originZipCode,
                    whatsappNumber: data.whatsappNumber,
                    whatsappMessage: data.whatsappMessage
                }
            });
        }

        revalidatePath('/admin/settings');
        revalidatePath('/checkout');

        return { success: true, config };
    } catch (error) {
        console.error("Erro ao atualizar configurações:", error);
        return { error: "Erro ao salvar configurações" };
    }
}

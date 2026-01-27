"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCarrier(formData: FormData) {
    const name = formData.get("name") as string;
    const calculateApiUrl = formData.get("calculateApiUrl") as string;
    const apiKey = formData.get("apiKey") as string;

    if (!name) return { error: "Nome obrigatório" };

    try {
        await prisma.carrier.create({
            data: {
                name,
                calculateApiUrl,
                apiKey,
                isActive: true
            }
        });
        revalidatePath("/admin/shipping");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao criar transportadora" };
    }
}

export async function toggleCarrierStatus(id: string, currentStatus: boolean) {
    try {
        await prisma.carrier.update({
            where: { id },
            data: { isActive: !currentStatus }
        });
        revalidatePath("/admin/shipping");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao atualizar status" };
    }
}

export async function deleteCarrier(id: string) {
    try {
        await prisma.carrier.delete({
            where: { id }
        });
        revalidatePath("/admin/shipping");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao deletar transportadora" };
    }
}

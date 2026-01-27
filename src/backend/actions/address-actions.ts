"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUserAddresses() {
    const user = await getCurrentUser();
    if (!user) return { error: "Login necessário", addresses: [] };

    try {
        const addresses = await prisma.address.findMany({
            where: { userId: user.id },
            orderBy: { isDefault: 'desc' } // Default first
        });
        return { success: true, addresses };
    } catch (error) {
        console.error("Fetch Addresses Error:", error);
        return { error: "Erro ao buscar endereços", addresses: [] };
    }
}

export async function addAddress(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "Login necessário" };

    const zipCode = formData.get("zipCode") as string;
    const street = formData.get("street") as string;
    const number = formData.get("number") as string;
    const complement = formData.get("complement") as string;
    const neighborhood = formData.get("neighborhood") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const label = formData.get("label") as string;
    // const isDefault = formData.get("isDefault") === "on"; 

    // Validation
    if (!zipCode || !street || !number || !city || !state) {
        return { error: "Preencha os campos obrigatórios" };
    }

    try {
        // If this is the first address, make it default automatically
        const count = await prisma.address.count({ where: { userId: user.id } });
        const isDefault = count === 0;

        await prisma.address.create({
            data: {
                userId: user.id,
                zipCode, street, number, complement, neighborhood, city, state, label,
                isDefault,
                country: "Brasil"
            }
        });

        revalidatePath('/account/addresses');
        revalidatePath('/checkout');
        return { success: true };
    } catch (error) {
        console.error("Add Address Error:", error);
        return { error: "Erro ao salvar endereço" };
    }
}

export async function deleteAddress(addressId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: "Login necessário" };

    try {
        await prisma.address.delete({
            where: {
                id: addressId,
                userId: user.id // Security check
            }
        });

        revalidatePath('/account/addresses');
        revalidatePath('/checkout');
        return { success: true };
    } catch (error) {
        return { error: "Erro ao remover endereço" };
    }
}

export async function setDefaultAddress(addressId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: "Login necessário" };

    try {
        // Unset current default
        await prisma.address.updateMany({
            where: { userId: user.id, isDefault: true },
            data: { isDefault: false }
        });

        // Set new default
        await prisma.address.update({
            where: { id: addressId, userId: user.id },
            data: { isDefault: true }
        });

        revalidatePath('/account/addresses');
        revalidatePath('/checkout');
        return { success: true };
    } catch (error) {
        return { error: "Erro ao atualizar endereço padrão" };
    }
}

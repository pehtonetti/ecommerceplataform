"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getStoreId } from "@/backend/lib/store-context";

export async function createCarrier(formData: FormData) {
    const name = formData.get("name") as string;
    const calculateApiUrl = formData.get("calculateApiUrl") as string;
    const apiKey = formData.get("apiKey") as string;

    if (!name) return { error: "Nome obrigatório" };

    try {
        const storeId = await getStoreId();
        await prisma.carrier.create({
            data: {
                storeId,
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
        const storeId = await getStoreId();
        await prisma.carrier.updateMany({
            where: { id, storeId },
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
        const storeId = await getStoreId();
        await prisma.carrier.deleteMany({
            where: { id, storeId }
        });
        revalidatePath("/admin/shipping");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao deletar transportadora" };
    }
}

export async function getUserAddresses(userId: string) {
    if (!userId) return { addresses: [] };
    const addresses = await prisma.address.findMany({ where: { userId } });
    return { addresses };
}

export async function saveUserAddress(userId: string, data: any) {
    if (!userId) return { error: "Sem usuário" };
    const saved = await prisma.address.create({ data: { ...data, userId } });
    return { success: true, address: saved };
}

export async function getAddressByCEP(cep: string) {
    try {
        const res = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
        const json = await res.json();
        return { data: json };
    } catch(e) {
        return { error: "CEP inválido" };
    }
}

export async function calculateCartShipping(userId: string, zipCode: string) {
    try {
        const { getCart } = await import("./cart-actions");
        const cartResult = await getCart(userId);
        
        if (!cartResult.cart || cartResult.cart.items.length === 0) {
            return { error: "Carrinho vazio" };
        }

        const { calculateShipping, calculateCartDimensions } = await import("@/lib/shipping");
        
        // Calcular dimensões consolidadas do pacote
        const dimensions = calculateCartDimensions(cartResult.cart.items.map((item: any) => ({
            weight: item.product.weight,
            length: item.product.length,
            width: item.product.width,
            height: item.product.height,
            quantity: item.quantity
        })));

        // Buscar CEP de origem das configurações da loja
        const storeId = await getStoreId();
        const store = await prisma.store.findUnique({ where: { id: storeId } });
        const fromZipCode = store?.originZipCode || "01310-100";

        const quotes = await calculateShipping({
            fromZipCode,
            toZipCode: zipCode,
            ...dimensions
        });

        return { success: true, quotes };
    } catch (error) {
        console.error("Erro no cálculo de frete:", error);
        return { error: "Falha ao calcular frete" };
    }
}

export async function calculateProductShipping(productId: string, zipCode: string, quantity: number = 1) {
    try {
        const storeId = await getStoreId();
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product || product.storeId !== storeId) return { error: "Produto não encontrado" };

        const { calculateShipping, calculateCartDimensions } = await import("@/lib/shipping");

        // Calcular dimensões (mesmo que seja 1 produto, usamos a lógica de pacote)
        const dimensions = calculateCartDimensions([{
            weight: product.weight || 500,
            length: product.length || 20,
            width: product.width || 15,
            height: product.height || 10,
            quantity
        }]);

        const store = await prisma.store.findUnique({ where: { id: storeId } });
        const fromZipCode = store?.originZipCode || "01310-100";
        const quotes = await calculateShipping({
            fromZipCode,
            toZipCode: zipCode,
            ...dimensions
        });

        return { success: true, quotes };
    } catch (error) {
        console.error("Erro no cálculo de frete do produto:", error);
        return { error: "Falha ao calcular frete" };
    }
}

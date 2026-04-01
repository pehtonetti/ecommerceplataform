'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getStoreId } from "@/backend/lib/store-context";

export async function updateStock(productId: string, newStock: number) {
    if (newStock < 0) return;

    const storeId = await getStoreId();

    // Verificação de segurança: O produto deve pertencer à loja atual
    await prisma.product.updateMany({
        where: { id: productId, storeId },
        data: { stock: newStock }
    });

    revalidatePath('/admin/inventory');
    revalidatePath('/dashboard/inventory'); // Dashboard do lojista
}

export async function addInventoryBatch(formData: FormData) {
    const productId = formData.get('productId')?.toString();
    const batchCode = formData.get('batchCode')?.toString();
    const initialQuantity = parseInt(formData.get('quantity')?.toString() || "0");
    const costPrice = parseFloat(formData.get('costPrice')?.toString() || "0");
    const supplierName = formData.get('supplierName')?.toString() || null;
    
    const storeId = await getStoreId();
    
    if (!productId || !batchCode || initialQuantity <= 0) {
        throw new Error("Dados inválidos. Preencha Produto, Lote e Quantidade (maior que 0).");
    }

    // Verificar se o produto pertence à loja
    const product = await prisma.product.findFirst({
        where: { id: productId, storeId }
    });

    if (!product) {
        throw new Error("Produto não encontrado nesta loja.");
    }

    // Registrar o novo lote
    await prisma.inventoryBatch.create({
        data: {
            productId,
            batchCode,
            initialQuantity,
            availableStock: initialQuantity,
            costPrice: costPrice > 0 ? costPrice : null,
            supplierName
        }
    });

    // Atualizar o estoque total do produto (Sum de availableStock)
    const totalStock = await prisma.inventoryBatch.aggregate({
        where: { productId },
        _sum: { availableStock: true }
    });

    await prisma.product.update({
        where: { id: productId },
        data: { stock: totalStock._sum.availableStock || 0 }
    });

    revalidatePath('/admin/inventory');
    revalidatePath(`/admin/products`);
}

export async function getInventoryBatches(productId?: string) {
    const storeId = await getStoreId();
    
    return await prisma.inventoryBatch.findMany({
        where: {
            productId: productId ? productId : undefined,
            product: { storeId } // Garante que só vemos lotes de produtos DESTA loja
        },
        include: { product: { select: { name: true, price: true } } },
        orderBy: { createdAt: 'desc' }
    });
}

export async function consumeStockFIFO(productId: string, quantityToConsume: number) {
    const storeId = await getStoreId();
    let remainingToConsume = quantityToConsume;
    
    const activeBatches = await prisma.inventoryBatch.findMany({
        where: { 
            productId, 
            availableStock: { gt: 0 },
            product: { storeId }
        },
        orderBy: { createdAt: 'asc' } // Lote mais antigo primeiro
    });

    for (const batch of activeBatches) {
        if (remainingToConsume <= 0) break;

        const consumeFromThisBatch = Math.min(batch.availableStock, remainingToConsume);
        
        await prisma.inventoryBatch.update({
            where: { id: batch.id },
            data: { availableStock: batch.availableStock - consumeFromThisBatch }
        });

        remainingToConsume -= consumeFromThisBatch;
    }

    if (remainingToConsume > 0) {
        console.warn(`Estoque insuficiente nos lotes para o produto ${productId}. Faltou baixar: ${remainingToConsume}`);
    }

    // Sync do estoque total dinamicamente
    const totalStock = await prisma.inventoryBatch.aggregate({
        where: { 
            productId,
            product: { storeId }
        },
        _sum: { availableStock: true }
    });

    await prisma.product.updateMany({
        where: { id: productId, storeId },
        data: { stock: totalStock._sum.availableStock || 0 }
    });
}

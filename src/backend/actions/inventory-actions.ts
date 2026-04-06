'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getStoreId } from "@/backend/lib/store-context";

export async function updateStock(productId: string, newStock: number) {
    try {
        if (newStock < 0) return { success: false, error: 'Estoque não pode ser negativo' };

        const storeId = await getStoreId();

        await prisma.product.updateMany({
            where: { id: productId, storeId },
            data: { stock: newStock }
        });

        revalidatePath('/admin/inventory');
        revalidatePath('/dashboard/inventory');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Update Stock Error', e);
        return { success: false, error: 'Erro ao atualizar estoque' };
    }
}

export async function addInventoryBatch(formData: FormData) {
    try {
        const productId = formData.get('productId')?.toString();
        const batchCode = formData.get('batchCode')?.toString();
        const initialQuantity = parseInt(formData.get('quantity')?.toString() || "0");
        const costPrice = parseFloat(formData.get('costPrice')?.toString() || "0");
        const supplierName = formData.get('supplierName')?.toString() || null;
        
        const storeId = await getStoreId();
        
        if (!productId || !batchCode || initialQuantity <= 0) {
            return { success: false, error: "Dados inválidos. Preencha Produto, Lote e Quantidade (maior que 0)." };
        }

        const product = await prisma.product.findFirst({
            where: { id: productId, storeId }
        });

        if (!product) {
            return { success: false, error: "Produto não encontrado nesta loja." };
        }

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
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Add Inventory Batch Error', e);
        return { success: false, error: 'Erro ao adicionar lote' };
    }
}

export async function getInventoryBatches(productId?: string) {
    try {
        const storeId = await getStoreId();
        
        const batches = await prisma.inventoryBatch.findMany({
            where: {
                productId: productId ? productId : undefined,
                product: { storeId }
            },
            include: { product: { select: { name: true, price: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, batches };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Get Inventory Batches Error', e);
        return { success: false, error: 'Erro ao buscar lotes' };
    }
}

export async function consumeStockFIFO(productId: string, quantityToConsume: number) {
    try {
        const storeId = await getStoreId();
        let remainingToConsume = quantityToConsume;
        
        const activeBatches = await prisma.inventoryBatch.findMany({
            where: { 
                productId, 
                availableStock: { gt: 0 },
                product: { storeId }
            },
            orderBy: { createdAt: 'asc' }
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

        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Consume Stock FIFO Error', e);
        return { success: false, error: 'Erro ao processar estoque' };
    }
}

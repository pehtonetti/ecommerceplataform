'use server'

import { db } from "@/backend/infrastructure/db";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPermission, PERMISSIONS } from "@/lib/auth";
import { getStoreId } from "@/backend/lib/store-context";

export async function createProduct(formData: FormData) {
    try {
        await checkPermission(PERMISSIONS.MANAGE_PRODUCTS);

        const storeId = await getStoreId();
        const name = formData.get('name') as string;
        const price = Number(formData.get('price'));
        const description = formData.get('description') as string;
        const stock = Number(formData.get('stock'));
        const imageUrl = formData.get('imageUrl') as string;
        const category = formData.get('category') as string;

        await prisma.product.create({
            data: {
                storeId,
                name,
                price: Math.round(price * 100),
                description,
                stock,
                imageUrl,
                category,
                active: true,
            }
        });
        
        revalidatePath('/admin/products');
        revalidatePath('/');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Create Product Error', e);
        return { success: false, error: 'Erro ao criar produto' };
    }
}

export async function updateProduct(id: string, formData: FormData) {
    try {
        await checkPermission(PERMISSIONS.MANAGE_PRODUCTS);

        const storeId = await getStoreId();
        const name = formData.get('name') as string;
        const price = Number(formData.get('price'));
        const description = formData.get('description') as string;
        const stock = Number(formData.get('stock'));
        const imageUrl = formData.get('imageUrl') as string;
        const category = formData.get('category') as string;

        await prisma.product.updateMany({
            where: { id, storeId },
            data: {
                name,
                price: Math.round(price * 100),
                description,
                stock,
                imageUrl,
                category
            }
        });

        revalidatePath('/admin/products');
        revalidatePath('/');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Update Product Error', e);
        return { success: false, error: 'Erro ao atualizar produto' };
    }
}

export async function deleteProduct(id: string) {
    try {
        await checkPermission(PERMISSIONS.MANAGE_PRODUCTS);
        const storeId = await getStoreId();

        await prisma.product.deleteMany({
            where: { id, storeId }
        });

        revalidatePath('/admin/products');
        revalidatePath('/');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Delete Product Error', e);
        return { success: false, error: 'Erro ao deletar produto' };
    }
}

export async function getMerchantProducts() {
    try {
        const storeId = await getStoreId();
        const products = await prisma.product.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, products };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Get Merchant Products Error', e);
        return { success: false, error: 'Erro ao buscar produtos' };
    }
}

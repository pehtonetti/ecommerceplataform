'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getStoreId } from "@/backend/lib/store-context";

export async function createCategory(formData: FormData) {
    const storeId = await getStoreId();
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const imageUrl = formData.get('imageUrl')?.toString();

    if (!name) throw new Error("Nome é obrigatório");

    await prisma.category.create({
        data: {
            storeId,
            name,
            description,
            imageUrl,
            slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        }
    });

    revalidatePath('/admin/categories');
}

export async function updateCategory(id: string, formData: FormData) {
    const storeId = await getStoreId();
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const imageUrl = formData.get('imageUrl')?.toString();

    if (!name) throw new Error("Nome é obrigatório");

    const category = await prisma.category.findFirst({ where: { id, storeId } });
    if (!category) throw new Error("Categoria não encontrada.");

    await prisma.category.update({
        where: { id },
        data: {
            name,
            description,
            imageUrl,
            slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        }
    });

    revalidatePath('/admin/categories');
}

export async function deleteCategory(id: string) {
    const storeId = await getStoreId();
    const category = await prisma.category.findFirst({ where: { id, storeId } });
    if (!category) return;
    
    // Verificar se a categoria tem produtos
    const productsUsing = await prisma.product.count({
        where: { category: category.name, storeId }
    });

    if (productsUsing > 0) {
        throw new Error(`Não é possível excluir. Existem ${productsUsing} produtos nesta categoria.`);
    }

    await prisma.category.delete({
        where: { id }
    });

    revalidatePath('/admin/categories');
}

export async function getCategories() {
    const storeId = await getStoreId();
    return await prisma.category.findMany({
        where: { storeId },
        orderBy: { name: 'asc' }
    });
}

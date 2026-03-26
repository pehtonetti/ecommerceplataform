'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const imageUrl = formData.get('imageUrl')?.toString();

    if (!name) throw new Error("Nome é obrigatório");

    await prisma.category.create({
        data: {
            name,
            description,
            imageUrl,
            slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        }
    });

    revalidatePath('/admin/categories');
}

export async function updateCategory(id: string, formData: FormData) {
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const imageUrl = formData.get('imageUrl')?.toString();

    if (!name) throw new Error("Nome é obrigatório");

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
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return;
    
    // Verificar se a categoria tem produtos
    const productsUsing = await prisma.product.count({
        where: { category: category.name }
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
    return await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });
}

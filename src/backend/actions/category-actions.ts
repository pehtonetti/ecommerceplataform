'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getStoreId } from "@/backend/lib/store-context";

export async function createCategory(formData: FormData) {
    try {
        const storeId = await getStoreId();
        const name = formData.get('name')?.toString();
        const description = formData.get('description')?.toString();
        const imageUrl = formData.get('imageUrl')?.toString();

        if (!name) return { success: false, error: "Nome é obrigatório" };

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
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Create Category Error', e);
        return { success: false, error: 'Erro ao criar categoria' };
    }
}

export async function updateCategory(id: string, formData: FormData) {
    try {
        const storeId = await getStoreId();
        const name = formData.get('name')?.toString();
        const description = formData.get('description')?.toString();
        const imageUrl = formData.get('imageUrl')?.toString();

        if (!name) return { success: false, error: "Nome é obrigatório" };

        const category = await prisma.category.findFirst({ where: { id, storeId } });
        if (!category) return { success: false, error: "Categoria não encontrada." };

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
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Update Category Error', e);
        return { success: false, error: 'Erro ao atualizar categoria' };
    }
}

export async function deleteCategory(id: string) {
    try {
        const storeId = await getStoreId();
        const category = await prisma.category.findFirst({ where: { id, storeId } });
        if (!category) return { success: false, error: "Categoria não encontrada" };
        
        // Verificar se a categoria tem produtos
        const productsUsing = await prisma.product.count({
            where: { category: category.name, storeId }
        });

        if (productsUsing > 0) {
            return { success: false, error: `Não é possível excluir. Existem ${productsUsing} produtos nesta categoria.` };
        }

        await prisma.category.delete({
            where: { id }
        });

        revalidatePath('/admin/categories');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Delete Category Error', e);
        return { success: false, error: 'Erro ao deletar categoria' };
    }
}

export async function getCategories() {
    try {
        const storeId = await getStoreId();
        const categories = await prisma.category.findMany({
            where: { storeId },
            orderBy: { name: 'asc' }
        });
        return { success: true, categories };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Get Categories Error', e);
        return { success: false, error: 'Erro ao buscar categorias' };
    }
}

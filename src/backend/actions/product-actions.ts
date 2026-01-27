'use server'

import { db } from "@/backend/infrastructure/db";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPermission, PERMISSIONS } from "@/lib/auth";

export async function createProduct(formData: FormData) {
    try {
        // Verify Permissions (Admin or Editor)
        await checkPermission(PERMISSIONS.MANAGE_PRODUCTS);

        const name = formData.get('name') as string;
        const price = Number(formData.get('price')); // Expecting cents or handling conversion
        const description = formData.get('description') as string;
        const stock = Number(formData.get('stock'));
        const imageUrl = formData.get('imageUrl') as string;
        const category = formData.get('category') as string;

        await prisma.product.create({
            data: {
                name,
                price: Math.round(price * 100), // Convert to cents if input is decimal
                description,
                stock,
                imageUrl,
                category,
                active: true,
            }
        });
    } catch (e) {
        console.error('Create Product Error', e);
        return;
    }

    revalidatePath('/admin/products');
    revalidatePath('/');
    redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
    try {
        await checkPermission(PERMISSIONS.MANAGE_PRODUCTS);

        const name = formData.get('name') as string;
        const price = Number(formData.get('price'));
        const description = formData.get('description') as string;
        const stock = Number(formData.get('stock'));
        const imageUrl = formData.get('imageUrl') as string;
        const category = formData.get('category') as string;

        await prisma.product.update({
            where: { id },
            data: {
                name,
                price: Math.round(price * 100),
                description,
                stock,
                imageUrl,
                category
            }
        });
    } catch (e) {
        console.error('Update Product Error', e);
        return;
    }

    revalidatePath('/admin/products');
    revalidatePath('/');
    redirect('/admin/products');
}

export async function deleteProduct(id: string) {
    await checkPermission(PERMISSIONS.MANAGE_PRODUCTS);

    await prisma.product.delete({
        where: { id }
    });

    revalidatePath('/admin/products');
    revalidatePath('/');
}

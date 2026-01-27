'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    if (!name) return;

    // Check if category exists (logic might depend on if we have a Category model or just string unique)
    // If Category is a model:
    await prisma.category.create({
        data: {
            name,
            description,
            slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        }
    });

    revalidatePath('/admin/categories');
}

export async function getCategories() {
    return await prisma.category.findMany({});
}

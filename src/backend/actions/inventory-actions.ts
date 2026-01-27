'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateStock(productId: string, newStock: number) {
    if (newStock < 0) return;

    await prisma.product.update({
        where: { id: productId },
        data: { stock: newStock }
    });

    revalidatePath('/admin/inventory');
}

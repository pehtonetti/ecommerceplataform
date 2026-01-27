'use server'

import { emitNFeForOrder } from "@/lib/enotas";
import { getOrderDetails } from "./order-actions";
import { prisma } from "@/lib/prisma";

export async function emitNfe(orderId: string) {
    console.log(`📡 Emitting NFe for order ${orderId}...`);

    // 1. Fetch full order data
    const { order, error } = await getOrderDetails(orderId);

    if (error || !order) {
        console.error('Order not found for NFe emission');
        return { success: false, error: 'Order not found' };
    }

    // 2. Call ENotas API
    const result = await emitNFeForOrder(order);

    if (result.success) {
        // Save NFe URL and Status to database
        await prisma.invoice.create({
            data: {
                orderId: orderId,
                number: result.nfeId, // Using nfeId as number or accessKey temporarily
                accessKey: result.nfeId,
                status: result.status === 'autorizada' ? 'authorized' : 'emitting',
                pdfUrl: result.linkPdf,
                // If XML URL is available, add it too
            }
        });

        return {
            success: true,
            nfeUrl: result.linkPdf,
            nfeKey: result.nfeId
        };
    } else {
        return {
            success: false,
            error: result.error
        };
    }
}

export async function saveFiscalConfig(data: any) {
    // Stub
    console.log('Saving fiscal config', data);
    return { success: true };
}

'use server'

import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/backend/lib/store-context";

export async function getMarketingCustomers() {
    try {
        const storeId = await getStoreId();
        
        // Clientes da loja são usuários que têm pedidos nela
        const orders = await prisma.order.findMany({
            where: { storeId },
            select: { userId: true },
            distinct: ['userId']
        });

        const userIds = orders.map(o => o.userId);

        const customers = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        return { success: true, customers };
    } catch (error) {
        console.error("Marketing error:", error);
        return { success: false, error: 'Falha ao buscar clientes da loja' };
    }
}

export async function sendEmailCampaign(subject: string, content: string) {
    const storeId = await getStoreId();
    
    // Contar clientes únicos da loja
    const recipients = await prisma.order.groupBy({
        by: ['userId'],
        where: { storeId },
        _count: true
    });

    const count = recipients.length;
    console.log(`Sending email campaign: ${subject} to ${count} recipients for store ${storeId}`);
    
    // Simulação de envio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return { success: true, recipients: count };
}

export async function syncGoogleAds() {
    // Stub
    return { success: true, productsSynced: 150 };
}

export async function syncMetaAds() {
    // Stub
    return { success: true, productsSynced: 150 };
}

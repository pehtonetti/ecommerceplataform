'use server'

'use server'

import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/backend/lib/store-context";
import { revalidatePath } from "next/cache";

export async function createTicket(data: any) {
    const storeId = await getStoreId();
    
    const ticket = await prisma.supportTicket.create({
        data: {
            storeId,
            userId: data.userId || null,
            subject: data.subject || "Sem Assunto",
            message: data.message || "",
            status: "open",
            priority: data.priority || "low"
        }
    });

    revalidatePath('/admin/support');
    return { success: true, ticketId: ticket.id };
}

export async function getTickets() {
    const storeId = await getStoreId();

    const tickets = await prisma.supportTicket.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { name: true, email: true }
            }
        }
    });

    return tickets.map(t => ({
        id: t.id,
        user: t.user?.name || t.userId || "Visitante",
        status: t.status,
        subject: t.subject,
        date: t.createdAt.toLocaleDateString('pt-BR'),
        priority: t.priority
    }));
}

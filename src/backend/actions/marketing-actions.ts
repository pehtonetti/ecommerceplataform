import { prisma } from "@/lib/prisma";

export async function getMarketingCustomers() {
    try {
        const customers = await prisma.user.findMany({
            where: { role: 'customer' },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });
        return { success: true, customers };
    } catch (error) {
        return { success: false, error: 'Falha ao buscar clientes' };
    }
}

export async function sendEmailCampaign(subject: string, content: string) {
    // Real-ish: count customers first
    const count = await prisma.user.count({ where: { role: 'customer' } });
    console.log(`Sending email campaign: ${subject} to ${count} recipients`);
    
    // In a real app, we would loop through customers and send via SendGrid/Nodemailer
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

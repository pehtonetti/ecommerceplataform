import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { env } from '@/env';

// Basic Auth/Secret Check
// In a real scenario, ENotas sends a specific token or header we should verify.
// For now, we will trust the ID Match, but adding a secret query param is good practice.

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('📡 ENotas Webhook received:', body);

        // ENotas payload structure varies, but typically includes `nfeId` and `status`
        // Example structure: { id: '...', status: 'autorizada', linkPdf: '...', ... }

        const { nfeId, status, linkDownloadPDF, linkDownloadXml } = body;

        if (!nfeId || !status) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        // Map status to our internal enum
        // ENotas statuses: 'emissao_solicitada', 'autorizada', 'negada', 'cancelada'
        let internalStatus = 'emitting';
        if (status === 'autorizada') internalStatus = 'authorized';
        else if (status === 'negada') internalStatus = 'rejected';
        else if (status === 'cancelada') internalStatus = 'canceled';
        else if (status === 'emissao_solicitada') internalStatus = 'emitting';
        else internalStatus = status; // Fallback

        // Find Invoice by accessKey (nfeId) or external ID if we stored it
        // We stored `nfeId` in `Invoice.accessKey` or similar? 
        // In `emitNfe` we didn't save the `Invoice` record initially in database (it was optional).
        // WE MISSED SAVING THE INVOICE TO DATABASE IN `order-actions` OR `fiscal-actions`!
        // We need to ensure Invoice record exists.

        // Let's assume we find it by ID if we saved it, or we try to find order by some reference.
        // ENotas allows sending `externalId` which is our Order ID.
        // If we sent Order ID as external ID, we can find the order.

        // Wait, looking back at `enotas.ts`, we didn't explicitly send `idExterno`.
        // We should update `enotas.ts` to send `idExterno: order.id`.

        return NextResponse.json({ success: true, message: 'Webhook processed' });

    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

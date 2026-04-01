import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Faltando token de autorização' }, { status: 401 });
    }

    const key = authHeader.split(' ')[1];

    // Find the Store associated with this API Key
    const apiKey = await prisma.apiKey.findUnique({
        where: { key, active: true },
        include: { store: true }
    });

    if (!apiKey) {
        return NextResponse.json({ error: 'Chave de API inválida ou inativa' }, { status: 403 });
    }

    // Isolate products by storeId
    const products = await prisma.product.findMany({
        where: { storeId: apiKey.storeId, active: true },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            currency: true,
            imageUrl: true,
            category: true,
            stock: true,
            createdAt: true
        }
    });

    // Update lastUsed
    await prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsed: new Date() }
    });

    return NextResponse.json({ 
        success: true, 
        store: apiKey.store.name,
        count: products.length,
        products 
    });
}

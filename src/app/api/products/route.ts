import { NextResponse } from 'next/server';
import { db } from '@/backend/infrastructure/db';

export async function GET() {
    try {
        const products = await db.getProducts();
        return NextResponse.json(products);
    } catch (e) {
        console.error('API Error:', e);
        return NextResponse.json([], { status: 500 });
    }
}

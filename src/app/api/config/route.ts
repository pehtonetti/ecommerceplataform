import { NextResponse } from 'next/server';
import { db } from '@/backend/infrastructure/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    const config = db.getStoreConfig();
    return NextResponse.json(config);
}

export async function POST(request: Request) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const updated = db.updateStoreConfig(body);
        return NextResponse.json(updated);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(banners);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, subtitle, imageUrl, link, active, order } = body;

        if (!title || !imageUrl) {
            return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
        }

        const banner = await prisma.banner.create({
            data: {
                id: uuidv4(),
                title,
                subtitle,
                imageUrl,
                link: link || '/',
                active: active ?? true,
                order: order ?? 0,
                updatedAt: new Date(),
            }
        });

        return NextResponse.json(banner);
    } catch (error) {
        console.error('Error creating banner:', error);
        return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
    }
}

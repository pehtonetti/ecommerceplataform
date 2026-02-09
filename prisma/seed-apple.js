
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🍎 Seeding Apple Products...');

    // 1. Ensure Category Apple
    const category = await prisma.category.upsert({
        where: { slug: 'apple' },
        update: {},
        create: {
            name: 'Apple',
            slug: 'apple',
            description: 'Produtos oficiais Apple com garantia e qualidade premium.'
        }
    });

    // 2. Define Apple Products
    const products = [
        {
            name: 'iPhone 15 Pro Max 256GB',
            description: 'O iPhone definitivo. Design em titânio aeroespacial. Chip A17 Pro. Sistema de câmera Pro mais avançado. Botão de Ação personalizável.',
            price: 1099900,
            imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20485d2713?w=800&q=80',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            colors: ['Titânio Natural', 'Titânio Azul', 'Titânio Branco', 'Titânio Preto'],
            capacities: ['256GB', '512GB', '1TB'],
            images: [
                'https://images.unsplash.com/photo-1695048133142-1a20485d2713?w=800&q=80',
                'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80'
            ]
        },
        {
            name: 'MacBook Pro 14 M3 Pro',
            description: 'Mente aberta. Mente pro. Com os chips M3 Pro e M3 Max. Até 22 horas de bateria. A melhor tela de notebook do mundo.',
            price: 2249900,
            imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            colors: ['Space Black', 'Silver'],
            capacities: ['512GB SSD', '1TB SSD'],
            images: [
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80',
                'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80'
            ]
        },
        {
            name: 'iPad Pro 12.9 M2',
            description: 'Desempenho inacreditável com o chip M2. Tela Liquid Retina XDR. Conectividade sem fio ultrarrápida. E agora com o Apple Pencil sobre a tela.',
            price: 1399900,
            imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            colors: ['Space Gray', 'Silver'],
            capacities: ['128GB', '256GB', '512GB', '1TB'],
            images: [
                'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
                'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80'
            ]
        },
        {
            name: 'Apple Watch Ultra 2',
            description: 'A aventura em outro nível. Caixa de titânio resistente. GPS de precisão e dupla frequência. Até 36 horas de bateria.',
            price: 969900,
            imageUrl: 'https://images.unsplash.com/photo-1664115161426-11da72566c3a?w=800&q=80',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            colors: ['Titanium'],
            capacities: ['49mm'],
            images: [
                'https://images.unsplash.com/photo-1664115161426-11da72566c3a?w=800&q=80',
                'https://images.unsplash.com/photo-1551817958-c1b0c0f8624d?w=800&q=80'
            ]
        },
        {
            name: 'AirPods Pro (2ª geração)',
            description: 'Áudio Espacial Personalizado. Cancelamento Ativo de Ruído até 2x melhor. Modo Ambiente Adaptável.',
            price: 249900,
            imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            colors: ['White'],
            capacities: ['MagSafe Case'],
            images: [
                'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80',
                'https://images.unsplash.com/photo-1588156979435-379b9d802b0a?w=800&q=80'
            ]
        }
    ];

    for (const p of products) {
        const existing = await prisma.product.findFirst({ where: { name: p.name } });

        let productId;

        if (existing) {
            console.log(`Updating ${p.name}...`);
            const updated = await prisma.product.update({
                where: { id: existing.id },
                data: {
                    description: p.description,
                    price: p.price,
                    imageUrl: p.imageUrl,
                    colors: p.colors,
                    capacities: p.capacities,
                    category: 'Apple'
                }
            });
            productId = updated.id;
        } else {
            console.log(`Creating ${p.name}...`);
            const created = await prisma.product.create({
                data: {
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    stock: 50,
                    imageUrl: p.imageUrl,
                    videoUrl: p.videoUrl,
                    category: 'Apple',
                    active: true,
                    colors: p.colors,
                    capacities: p.capacities,
                    weight: 500, length: 20, width: 20, height: 10
                }
            });
            productId = created.id;
        }

        // Add images
        await prisma.productImage.deleteMany({ where: { productId } });
        for (const url of p.images) {
            await prisma.productImage.create({
                data: {
                    productId: productId,
                    url: url,
                    alt: p.name
                }
            });
        }
    }

    console.log('✅ Apple Products Seeded Successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

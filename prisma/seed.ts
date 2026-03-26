import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Luxury Seed...');

  // 1. Clean database
  console.log('🧹 Cleaning database...');
  await prisma.productImage.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productView.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.storeConfig.deleteMany();

  // 2. Create Users
  const hashedPassword = await hash('123', 12);
  await prisma.user.createMany({
    data: [
      { name: 'Admin', email: 'admin@loja.com', password: hashedPassword, role: 'admin' },
      { name: 'João Tech', email: 'joao@email.com', password: hashedPassword, role: 'customer' },
    ]
  });

  // 3. Store Config
  await prisma.storeConfig.create({
    data: {
      storeName: "Simplify Luxury Tech",
      originZipCode: "17055-270",
    }
  });

  const categories = [
    { name: 'Apple', slug: 'apple', description: 'O ecossistema definitivo.' },
    { name: 'Smartphones', slug: 'smartphones', description: 'Poder na palma da sua mão.' },
    { name: 'Notebooks', slug: 'notebooks', description: 'Performance sem limites.' },
    { name: 'Áudio Elite', slug: 'audio', description: 'Som em sua forma mais pura.' },
    { name: 'Acessórios', slug: 'acessorios', description: 'Complemente sua experiência.' }
  ];

  const products = [
    // APPLE
    {
      category: 'Apple',
      name: 'iPhone 16 Pro Max',
      description: 'O iPhone mais poderoso de todos. Titânio aeroespacial e o novo chip A18 Pro.',
      price: 1099900, stock: 15, weight: 221, length: 16, width: 8, height: 1,
      imageUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80',
      colors: ['Titânio Natural', 'Titânio Negro', 'Titânio Branco'],
      capacities: ['256GB', '512GB', '1TB']
    },
    {
      category: 'Apple',
      name: 'MacBook Pro M3 Max 16"',
      description: 'Velocidade absurda. Bateria para o dia todo. A tela Liquid Retina XDR mais avançada.',
      price: 3499900, stock: 5, weight: 2100, length: 36, width: 25, height: 2,
      imageUrl: 'https://images.unsplash.com/photo-1517336714460-4c504974f28d?w=800&q=80',
      colors: ['Preto Espacial', 'Prateado'],
      capacities: ['36GB RAM', '64GB RAM', '128GB RAM']
    },
    {
      category: 'Apple',
      name: 'iPad Pro M4',
      description: 'Surpreendentemente fino. Incrivelmente poderoso. O futuro do trabalho portátil.',
      price: 1299900, stock: 10, weight: 450, length: 28, width: 21, height: 1,
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
      colors: ['Prata', 'Cinza Espacial'],
      capacities: ['256GB', '512GB', '1TB', '2TB']
    },
    {
      category: 'Apple',
      name: 'Apple Watch Ultra 2',
      description: 'O relógio de aventura definitivo. Titânio e tela de 3000 nits.',
      price: 899900, stock: 20, weight: 61, length: 5, width: 5, height: 2,
      imageUrl: 'https://images.unsplash.com/photo-1434493907317-a46b53b81882?w=800&q=80',
      colors: ['Titânio Natural'],
      capacities: ['GPS + Cellular']
    },
    {
      category: 'Apple',
      name: 'AirPods Max',
      description: 'A fidelidade do áudio encontra a magia do AirPods.',
      price: 659000, stock: 12, weight: 385, length: 20, width: 18, height: 8,
      imageUrl: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800&q=80',
      colors: ['Verde', 'Rosa', 'Prata', 'Preto'],
      capacities: ['Áudio Espacial']
    },

    // SMARTPHONES
    {
      category: 'Smartphones',
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Inteligência Artificial avançada e zoom de 100x. O rei do Android.',
      price: 899900, stock: 25, weight: 232, length: 16, width: 8, height: 1,
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
      colors: ['Titanium Gray', 'Titanium Yellow', 'Titanium Violet'],
      capacities: ['256GB', '512GB', '1TB']
    },
    {
      category: 'Smartphones',
      name: 'Google Pixel 9 Pro',
      description: 'A melhor câmera do mundo impulsionada pelo Google AI.',
      price: 799900, stock: 8, weight: 200, length: 16, width: 7, height: 1,
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
      colors: ['Obsidian', 'Porcelain', 'Hazel'],
      capacities: ['128GB', '256GB', '512GB']
    },

    // NOTEBOOKS
    {
      category: 'Notebooks',
      name: 'Dell XPS 15',
      description: 'O equilíbrio perfeito entre potência e portabilidade com tela OLED.',
      price: 1599900, stock: 6, weight: 1900, length: 34, width: 23, height: 2,
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-139a62703602?w=800&q=80',
      colors: ['Platinum Silver'],
      capacities: ['16GB RAM', '32GB RAM']
    },
    {
      category: 'Notebooks',
      name: 'Razer Blade 16',
      description: 'O notebook gamer definitivo com tela Mini-LED e RTX 4090.',
      price: 2899900, stock: 3, weight: 2450, length: 35, width: 24, height: 2,
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
      colors: ['Mercury White', 'Matte Black'],
      capacities: ['32GB RAM']
    },

     // AUDIO
     {
      category: 'Áudio Elite',
      name: 'Sony WH-1000XM5',
      description: 'O melhor cancelamento de ruído do mercado com áudio Hi-Res.',
      price: 249900, stock: 30, weight: 250, length: 22, width: 18, height: 10,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      colors: ['Preto', 'Prata', 'Azul'],
      capacities: ['Bluetooth 5.3']
    },
    {
      category: 'Áudio Elite',
      name: 'Bose QuietComfort Ultra',
      description: 'Conforto lendário e som imersivo sem precedentes.',
      price: 289900, stock: 20, weight: 250, length: 22, width: 18, height: 10,
      imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      colors: ['Black', 'White Smoke'],
      capacities: ['CustomTune']
    }
  ];

  console.log(`Creating ${categories.length} categories...`);
  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  console.log(`Creating ${products.length} products...`);
  for (const p of products) {
    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        weight: p.weight,
        length: p.length,
        width: p.width,
        height: p.height,
        imageUrl: p.imageUrl,
        category: p.category,
        active: true,
        colors: JSON.stringify(p.colors),
        capacities: JSON.stringify(p.capacities),
      }
    });

    await prisma.productImage.create({
      data: {
        productId: createdProduct.id,
        url: p.imageUrl,
        alt: p.name
      }
    });
  }

  console.log('✅ Luxury Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

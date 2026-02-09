import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const hashPassword = async (password: string) => {
  return await hash(password, 12);
};

const prisma = new PrismaClient();





async function main() {
  console.log('🌱 Starting seed...');

  // 1. Clean database
  console.log('🧹 Cleaning database...');
  await prisma.productImage.deleteMany(); // New table
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
  await prisma.carrier.deleteMany();
  await prisma.user.deleteMany();
  await prisma.storeConfig.deleteMany();

  // 2. Create Users
  console.log('Creating users...');
  const hashedPassword = await hashPassword('123');

  await prisma.user.createMany({
    data: [
      { name: 'Admin User', email: 'admin@loja.com', password: hashedPassword, role: 'admin' },
      { name: 'João Silva', email: 'joao@email.com', password: hashedPassword, role: 'customer' },
      { name: 'Editor User', email: 'editor@loja.com', password: hashedPassword, role: 'editor' }
    ]
  });

  // Helper to generate distinct categories and products
  // Requisição: 3 produtos por categoria, 60 categorias = 180 produtos. 
  // Cada produto com 2 fotos e video simples. Variants de cor e capacidade.

  // Lista massiva de categorias para cobrir 60
  const categoriesList = [
    'Smartphones', 'Notebooks', 'Tablets', 'Monitores', 'Impressoras', 'Periféricos', 'Consoles', 'Jogos',
    'Placas de Vídeo', 'Processadores', 'Placas Mãe', 'Memória RAM', 'Armazenamento', 'Fontes', 'Gabinetes', 'Coolers',
    'Cadeiras Gamer', 'Mesas Gamer', 'Smartwatches', 'Smartbands', 'Fones de Ouvido', 'Caixas de Som', 'Soundbars', 'Microfones',
    'Câmeras', 'Lentes', 'Drones', 'Acessórios de Câmera', 'TVs', 'Projetores', 'Streaming', 'Cabos',
    'Adaptadores', 'Carregadores', 'Power Banks', 'Hubs USB', 'Rede Mesh', 'Roteadores', 'Switches', 'Repetidores',
    'Casa Inteligente', 'Lâmpadas Smart', 'Tomadas Smart', 'Câmeras de Segurança', 'Fechaduras Digitais', 'Vídeo Porteiro', 'Assistentes Virtuais',
    'Eletrodomésticos', 'Robôs Aspiradores', 'Ar Condicionado', 'Ventiladores', 'Umidificadores', 'Purificadores', 'Cafeteiras',
    'Air Fryers', 'Liquidificadores', 'Batedeiras', 'Torradeiras', 'Chaleiras', 'Ferramentas'
  ];

  // Base de imagens genéricas mas funcionais (Unsplash) para garantir visualização
  const BASE_IMAGES = [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80',
    'https://images.unsplash.com/photo-1588872657578-139a62703602?w=800&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    'https://images.unsplash.com/photo-1494726161322-5360d4d0eeae?w=800&q=80',
  ];

  const VIDEOS = [
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://media.w3.org/2010/05/sintel/trailer_hd.mp4'
  ];

  const COLORS = ['Preto', 'Branco', 'Prata', 'Azul', 'Vermelho', 'Dourado'];
  const CAPACITIES = ['64GB', '128GB', '256GB', '512GB', '1TB'];

  console.log(`Creating ${categoriesList.length} categories...`);

  for (const catName of categoriesList) {
    await prisma.category.create({
      data: {
        name: catName,
        slug: catName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        description: `Os melhores produtos de ${catName} selecionados para você.`
      }
    });

    // Criar 3 produtos por categoria
    for (let i = 1; i <= 3; i++) {
      // Selecionar imagens (simulando seed aleatório mas determinístico)
      const imgIndex = (catName.length + i) % BASE_IMAGES.length;
      const mainImage = BASE_IMAGES[imgIndex];
      const secondaryImage = BASE_IMAGES[(imgIndex + 1) % BASE_IMAGES.length];
      const video = VIDEOS[i % 2];

      // Definir variantes variadas
      const hasColors = Math.random() > 0.3; // 70% chance de ter cores
      const hasCapacity = ['Smartphone', 'Notebook', 'Tablet', 'Console'].some(k => catName.includes(k));

      const productColors = hasColors ? COLORS.slice(0, Math.floor(Math.random() * 3) + 2) : [];
      const productCapacities = hasCapacity ? CAPACITIES.slice(0, Math.floor(Math.random() * 3) + 2) : [];

      const price = Math.floor(Math.random() * 500000) + 5000; // Entre 50 e 5000 reais

      const product = await prisma.product.create({
        data: {
          name: `${catName} Premium Model ${String.fromCharCode(64 + i)}`, // Ex: Smartphone Premium Model A
          description: `Descubra a tecnologia de ponta com o ${catName} Premium. Ideal para quem busca performance e estilo. Inclui garantia extendida e suporte premium.\n\nCaracterísticas:\n- Alta durabilidade\n- Design moderno\n- Eficiência energética`,
          price: price,
          stock: Math.floor(Math.random() * 100) + 10,
          imageUrl: mainImage,
          videoUrl: video,
          category: catName,
          active: true,
          colors: productColors.length > 0 ? productColors : undefined,
          capacities: productCapacities.length > 0 ? productCapacities : undefined,
          weight: 500, length: 20, width: 20, height: 10, // Default logistics
        }
      });

      // Adicionar imagens extras
      await prisma.productImage.createMany({
        data: [
          { productId: product.id, url: mainImage, alt: 'Main View' },
          { productId: product.id, url: secondaryImage, alt: 'Side View' }
        ]
      });
    }
  }

  // Produto Específico Pedido (LG OLED)
  console.log('Creating Specifc Requested Product...');
  await prisma.category.upsert({
    where: { slug: 'tvs' },
    update: {},
    create: { name: 'TVs', slug: 'tvs', description: 'Televisores de última geração' }
  });

  const lgOled = await prisma.product.create({
    data: {
      name: 'Smart TV LG OLED evo C3 55"',
      description: 'A melhor TV OLED do mundo ficou ainda melhor. O processador α9 Gen6 AI 4K exclusividade da LG OLED evo eleva a experiência de visualização a outro nível.',
      price: 549900, // R$ 5.499,00
      stock: 8,
      imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80', // Imagem de TV
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      category: 'TVs',
      active: true,
      colors: ['Preto', 'Prata'], // Exemplo de variantes
      capacities: ['55 polegadas', '65 polegadas'], // Usando capacity como tamanho p/ exemplo
      weight: 15000, length: 120, width: 10, height: 70
    }
  });

  await prisma.productImage.createMany({
    data: [
      { productId: lgOled.id, url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80', alt: 'Front View' },
      { productId: lgOled.id, url: 'https://images.unsplash.com/photo-1552975084-6e027cd345c2?w=800&q=80', alt: 'Side View' }
    ]
  });

  console.log('✅ Seed completed with 60 categories and diverse products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const hashPassword = async (password: string) => {
  return await hash(password, 12);
};

const prisma = new PrismaClient();

// Image Database mapped by keywords for relevance
const IMAGE_DB: Record<string, string[]> = {
  // Hardware
  'Placa de Vídeo': [
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
    'https://images.unsplash.com/photo-1555616635-640960031899?w=800&q=80',
    'https://images.unsplash.com/photo-1624705022835-15a42bc39ba6?w=800&q=80'
  ],
  'Processador': [
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80',
    'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=800&q=80'
  ],
  'Placa Mãe': [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    'https://images.unsplash.com/photo-1563206767-5b1d97289374?w=800&q=80',
    'https://images.unsplash.com/photo-1544652478-6653e09f1826?w=800&q=80'
  ],

  // Periféricos
  'Teclado': [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80'
  ],
  'Mouse': [
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80',
    'https://images.unsplash.com/photo-1615663245857-acda6a9d3c3d?w=800&q=80',
    'https://images.unsplash.com/photo-1629367494133-48ef3b4353d7?w=800&q=80'
  ],
  'Headset': [
    'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80',
    'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=800&q=80',
    'https://images.unsplash.com/photo-1487215078519-e21cc028d29c?w=800&q=80'
  ],

  // Monitores
  'Monitor': [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&q=80',
    'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800&q=80'
  ],

  // Smartphones
  'Smartphone': [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=800&q=80',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'
  ],
  'iPhone': [
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80',
    'https://images.unsplash.com/photo-1530319067586-3bd098181f91?w=800&q=80',
    'https://images.unsplash.com/photo-1556656793-0275bada8d74?w=800&q=80'
  ],

  // Notebooks
  'Notebook': [
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80'
  ],

  // Consoles
  'Console': [
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
    'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=800&q=80',
    'https://images.unsplash.com/photo-1592840496063-4b4ba374a3ed?w=800&q=80'
  ],
  'PlayStation': [
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
    'https://images.unsplash.com/photo-1621259182902-fdbed7013fac?w=800&q=80',
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80'
  ],

  // Áudio
  'Áudio': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'
  ],

  // Cadeira
  'Cadeira': [
    'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
    'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80',
    'https://images.unsplash.com/photo-1617364852223-75f57e78dc96?w=800&q=80'
  ],

  // Default
  'default': [
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80'
  ]
};

function getImagesForKeyword(name: string): string[] {
  for (const [key, images] of Object.entries(IMAGE_DB)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return images;
    }
  }
  return IMAGE_DB['default'];
}

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

  // 3. Create Categories and Products
  console.log('Creating products with images...');

  // Define categories and keywords for procedural generation
  const categoriesDefinition = [
    { name: 'Hardware', keywords: ['Placa de Vídeo', 'Processador', 'Placa Mãe'] },
    { name: 'Periféricos', keywords: ['Teclado', 'Mouse', 'Headset'] },
    { name: 'Monitores', keywords: ['Monitor Gamer'] },
    { name: 'Computadores', keywords: ['PC Gamer', 'Notebook Gamer'] },
    { name: 'Smartphones', keywords: ['iPhone', 'Smartphone Samsung'] },
    { name: 'Consoles', keywords: ['PlayStation 5', 'Console Xbox'] },
    { name: 'Áudio', keywords: ['Caixa de Som', 'Fone Bluetooth'] },
    { name: 'Móveis', keywords: ['Cadeira Gamer'] }
  ];

  const brands = ['Pro', 'Ultra', 'Elite', 'V2', 'Max', 'Gamer'];

  // Create Categories first
  for (const catDef of categoriesDefinition) {
    await prisma.category.create({
      data: {
        name: catDef.name,
        slug: catDef.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        description: `Melhores produtos de ${catDef.name}`
      }
    });

    // Generate ~15 products per category
    for (const keyword of catDef.keywords) {
      for (let i = 0; i < 5; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const productName = `${keyword} ${brand} Edition ${i + 1}`;
        const images = getImagesForKeyword(keyword);
        const price = Math.floor(Math.random() * 200000) + 10000;

        const product = await prisma.product.create({
          data: {
            name: productName,
            description: `Experiência premium com o ${productName}. Alta durabilidade e performance.`,
            price: price,
            stock: Math.floor(Math.random() * 50) + 5,
            imageUrl: images[0], // Main image
            category: catDef.name,
            weight: 500, length: 20, width: 20, height: 10,
          }
        });

        // Add 3 images (using the map, cycling if needed)
        for (let j = 0; j < 3; j++) {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              url: images[j % images.length],
              alt: `${productName} View ${j + 1}`
            }
          });
        }
      }
    }
  }

  // 4. Store Config
  await prisma.storeConfig.create({
    data: {
      storeName: 'Loja Tech Premium',
      originZipCode: '01001-000'
    }
  });

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

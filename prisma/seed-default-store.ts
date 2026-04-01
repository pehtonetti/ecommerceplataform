import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_STORE = {
  name: 'Minha Loja',
  slug: 'default',
  plan: 'pro',
  ownerId: '', // will be auto-filled
  primaryColor: '#6366f1',
  currency: 'BRL',
  locale: 'pt-BR',
};

async function main() {
  console.log('🌱 Seeding default store...');

  let adminUser = await prisma.user.findFirst({
    where: { role: 'admin' },
  });

  if (!adminUser) {
    console.log('⚠️ Criando usuário admin padrão admin@master.com...');
    adminUser = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@master.com',
        password: 'admin',
        role: 'admin',
      }
    });
  }

  const existing = await prisma.store.findUnique({
    where: { slug: DEFAULT_STORE.slug },
  });

  if (existing) {
    console.log(`✅ Default store already exists (id: ${existing.id}).`);
    await seedDemoProducts(existing.id);
    return;
  }

  const store = await prisma.store.create({
    data: {
      ...DEFAULT_STORE,
      ownerId: adminUser.id,
    },
  });

  console.log(`✅ Default store created: "${store.name}" (id: ${store.id}, slug: ${store.slug})`);
  await seedDemoProducts(store.id);
}

async function seedDemoProducts(storeId: string) {
  const productCount = await prisma.product.count({ where: { storeId } });
  
  if (productCount === 0) {
      console.log('📦 Injetando um produto de teste para vermos a home...');
      const category = await prisma.category.upsert({
          where: {
              storeId_slug: {
                  storeId,
                  slug: 'eletronicos'
              }
          },
          update: {},
          create: {
              storeId,
              name: 'Eletrônicos',
              slug: 'eletronicos',
          }
      });
      
      await prisma.product.create({
          data: {
              storeId,
              name: 'iPhone 15 Pro Max',
              price: 899900,
              description: 'O melhor iPhone de todos os tempos.',
              category: 'Eletrônicos',
              stock: 10,
              imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569',
              active: true,
          }
      });
      console.log('✅ Produto de teste criado com sucesso!');
  }

  console.log('🎉 Done! Tudo pronto para o uso.');
}

main()
  .catch(e => {
    console.error('💥 Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

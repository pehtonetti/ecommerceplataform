import { prisma } from '@/lib/prisma';
import PromoBannerCarousel from '@/frontend/components/PromoBannerCarousel';
import ProductSection from '@/frontend/components/ProductSection';
import FeaturedCategories from '@/frontend/components/FeaturedCategories';
import { Heart, Clock, Search, Tag, TrendingUp } from 'lucide-react';
import PlatformLanding from '@/frontend/components/platform/PlatformLanding';
import { headers } from 'next/headers';


async function getRecentlyViewedProducts() {
  try {
    // Try to get most viewed products from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const viewCounts = await prisma.productView.groupBy({
      by: ['productId'],
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _count: {
          productId: 'desc',
        },
      },
      take: 10,
    });

    const productIds = viewCounts.map((v) => v.productId);

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        active: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        category: true,
      },
    });

    return products;
  } catch {
    // If ProductView table doesn't exist yet, return newest products as fallback
    console.log('ProductView table not found, using fallback');
    return await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        category: true,
      },
    });
  }
}

async function getPromoProducts() {
  // Products under R$ 100
  return await prisma.product.findMany({
    where: {
      active: true,
      price: { lt: 10000 }, // R$ 100 in cents
    },
    orderBy: {
      price: 'asc',
    },
    take: 10,
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      category: true,
    },
  });
}

async function getTrendingProducts() {
  // Get top selling products
  const topSelling = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 10,
  });

  const productIds = topSelling.map((item) => item.productId);

  return await prisma.product.findMany({
    where: {
      id: { in: productIds },
      active: true,
    },
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      category: true,
    },
  });
}

async function getNewProducts() {
  return await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      category: true,
    },
  });
}

async function getAppleProducts() {
  return await prisma.product.findMany({
    where: {
      category: 'Apple',
      active: true
    },
    take: 8,
    orderBy: { price: 'desc' },
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      category: true,
    },
  });
}

export default async function HomePage() {
  const headersList = await headers();
  const host = headersList.get('host') ?? '';
  const isPlatformHost = host === 'localhost:3000' || host === '127.0.0.1:3000' || host === process.env.PLATFORM_DOMAIN;

  if (isPlatformHost) {
    return <PlatformLanding />;
  }

  const [recentlyViewed, promoProducts, trendingProducts, newProducts, appleProducts] = await Promise.all([
    getRecentlyViewedProducts(),
    getPromoProducts(),
    getTrendingProducts(),
    getNewProducts(),
    getAppleProducts(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black" suppressHydrationWarning>
      {/* Main Content */}
      <div className="w-full" suppressHydrationWarning>
        {/* Promotional Banner Carousel */}
        <div className="mb-0">
          <PromoBannerCarousel />
        </div>

        {/* Wrap content sections that need internal spacing */}
        <div className="px-4 py-6 space-y-12">
          {/* Payment Methods */}
          <FeaturedCategories />

          {/* Trending Products */}
          {trendingProducts.length > 0 && (
            <ProductSection
              title="Mais Vendidos"
              subtitle="Os produtos que todo mundo está comprando"
              products={trendingProducts}
              viewAllLink="/search?sort=bestselling"
              icon={<TrendingUp className="w-6 h-6" />}
            />
          )}

          {/* APPLE ECOSYSTEM SECTION */}
          {appleProducts.length > 0 && (
            <ProductSection
              title="Ecossistema Apple"
              subtitle="A melhor experiência em tecnologia premium"
              products={appleProducts}
              viewAllLink="/search?category=apple"
              icon={<Heart className="w-6 h-6 text-black dark:text-white" />}
            />
          )}

          {/* Promotions under R$ 100 */}
          {promoProducts.length > 0 && (
            <ProductSection
              title="Promoções abaixo de R$ 100"
              subtitle="Ofertas imperdíveis com preços especiais"
              products={promoProducts}
              viewAllLink="/search?maxPrice=100"
              icon={<Tag className="w-6 h-6" />}
            />
          )}

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <ProductSection
              title="Vistos Recentemente"
              subtitle="Continue de onde parou"
              products={recentlyViewed}
              viewAllLink="/search"
              icon={<Clock className="w-6 h-6" />}
            />
          )}

          {/* New Arrivals */}
          {newProducts.length > 0 && (
            <ProductSection
              title="Novidades"
              subtitle="Produtos recém-chegados"
              products={newProducts}
              viewAllLink="/search?sort=newest"
              icon={<Search className="w-6 h-6" />}
            />
          )}

          {/* Categories Banner */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Categorias em Destaque</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Smartphones', 'Games', 'Informática', 'Acessórios'].map((category) => (
                <a
                  key={category}
                  href={`/search?category=${category.toLowerCase()}`}
                  className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow text-center"
                >
                  <h3 className="font-semibold text-lg text-gray-800">{category}</h3>
                  <p className="text-sm text-gray-600 mt-1">Ver produtos</p>
                </a>
              ))}
            </div>
          </section>

          {/* Benefits Banner */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="text-xl font-bold mb-2">Frete Grátis</h3>
                <p className="text-sm opacity-90">Em compras acima de R$ 99</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Pagamento Seguro</h3>
                <p className="text-sm opacity-90">Seus dados protegidos</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Troca Grátis</h3>
                <p className="text-sm opacity-90">Até 30 dias após a compra</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

import { prisma } from '@/lib/prisma';
import PromoBannerCarousel from '@/frontend/components/PromoBannerCarousel';
import ProductSection from '@/frontend/components/ProductSection';
import FeaturedCategories from '@/frontend/components/FeaturedCategories';
import { Heart, Clock, Search, Tag, TrendingUp, Newspaper, ChevronRight } from 'lucide-react';
import { getStoreContext } from '@/backend/lib/store-context';
import Link from 'next/link';
import Image from 'next/image';

// Tipos para o Layout Dinâmico
type ThemeConfig = {
  fontFamily: string;
  borderRadius: string;
  productCardStyle: string;
  showAddToCartOnCard: boolean;
};

type LayoutSection = {
  id: string;
  active: boolean;
  title: string;
};

type HomeLayoutConfig = {
  theme: ThemeConfig;
  sections: LayoutSection[];
};

const defaultLayout: HomeLayoutConfig = {
  theme: {
    fontFamily: 'Inter',
    borderRadius: 'rounded-xl',
    productCardStyle: 'shadowed',
    showAddToCartOnCard: true,
  },
  sections: [
    { id: 'hero', active: true, title: 'Destaques' },
    { id: 'trending', active: true, title: 'Mais Vendidos' },
    { id: 'new-arrivals', active: true, title: 'Novidades' },
    { id: 'promo', active: true, title: 'Ofertas Imperdíveis' },
    { id: 'blog', active: true, title: 'Nosso Blog' },
    { id: 'benefits', active: true, title: 'Benefícios' },
  ]
};

// Vitrine: funções de dados
async function getStoreBanners(storeId: string) {
  return await prisma.banner.findMany({
    where: { storeId, active: true },
    orderBy: { order: 'asc' },
  });
}

async function getStorePosts(storeId: string) {
  return await prisma.post.findMany({
    where: { storeId, published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
}

async function getProductsByFilter(storeId: string, filter: 'trending' | 'new' | 'promo' | 'recent') {
  if (filter === 'trending') {
    const topSelling = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: { order: { storeId } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    });
    const productIds = topSelling.map((item) => item.productId);
    return await prisma.product.findMany({
      where: { id: { in: productIds }, active: true, storeId },
      select: { id: true, name: true, price: true, imageUrl: true, category: true },
    });
  }

  if (filter === 'new') {
    return await prisma.product.findMany({
      where: { active: true, storeId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, name: true, price: true, imageUrl: true, category: true },
    });
  }

  if (filter === 'promo') {
    return await prisma.product.findMany({
      where: { active: true, storeId, price: { lt: 500 } },
      orderBy: { price: 'asc' },
      take: 10,
      select: { id: true, name: true, price: true, imageUrl: true, category: true },
    });
  }

  // Fallback / Recent
  return await prisma.product.findMany({
    where: { active: true, storeId },
    orderBy: { updatedAt: 'desc' },
    take: 10,
    select: { id: true, name: true, price: true, imageUrl: true, category: true },
  });
}

export default async function StorefrontHome() {
  const store = await getStoreContext();
  
  // Parse do Layout CMS
  let layout = defaultLayout;
  if (store.homeLayout) {
    try {
      layout = JSON.parse(store.homeLayout);
    } catch (e) {
      console.error("Error parsing home layout", e);
    }
  }

  const sections = layout.sections.filter(s => s.active);

  // Busca dados em paralelo apenas se a seção estiver ativa
  const [banners, posts, trending, newest, promos, recent] = await Promise.all([
    sections.find(s => s.id === 'hero') ? getStoreBanners(store.id) : [],
    sections.find(s => s.id === 'blog') ? getStorePosts(store.id) : [],
    sections.find(s => s.id === 'trending') ? getProductsByFilter(store.id, 'trending') : [],
    sections.find(s => s.id === 'new-arrivals') ? getProductsByFilter(store.id, 'new') : [],
    sections.find(s => s.id === 'promo') ? getProductsByFilter(store.id, 'promo') : [],
    sections.find(s => s.id === 'recent') ? getProductsByFilter(store.id, 'recent') : [],
  ]);

  // CSS Styles baseados no CMS
  const themeStyles = {
    fontFamily: layout.theme.fontFamily || 'Inter',
    primaryColor: store.primaryColor || '#6366f1',
  };

  return (
    <div 
        className="min-h-screen bg-gray-50 dark:bg-black" 
        style={{ fontFamily: themeStyles.fontFamily }}
        suppressHydrationWarning
    >
      <div className="w-full" suppressHydrationWarning>
        
        {/* HERO SECTION */}
        {layout.sections.find(s => s.id === 'hero' && s.active) && (
            <div className="mb-0">
                <PromoBannerCarousel banners={banners.map(b => ({ ...b, subtitle: b.subtitle ?? undefined })) as any} />
            </div>
        )}
        
        <div className="px-4 py-12 space-y-20 max-w-7xl mx-auto">
          
          {/* Featured Categories (Sempre visível mas poderia ser opcional) */}
          <FeaturedCategories />

          {/* Renderização Dinâmica das Seções de Produto */}
          {layout.sections.map((section) => {
              if (!section.active) return null;

              if (section.id === 'trending' && trending.length > 0) {
                  return (
                    <ProductSection
                        key={section.id}
                        title={section.title}
                        subtitle="Os produtos mais amados"
                        products={trending}
                        viewAllLink="/search?sort=bestselling"
                        icon={<TrendingUp className="w-6 h-6" style={{ color: themeStyles.primaryColor }} />}
                        layoutConfig={layout}
                    />
                  );
              }

              if (section.id === 'new-arrivals' && newest.length > 0) {
                return (
                  <ProductSection
                      key={section.id}
                      title={section.title}
                      subtitle="Novidades fresquinhas"
                      products={newest}
                      viewAllLink="/search?sort=newest"
                      icon={<Heart className="w-6 h-6" style={{ color: themeStyles.primaryColor }} />}
                      layoutConfig={layout}
                  />
                );
              }

              if (section.id === 'promo' && promos.length > 0) {
                return (
                  <ProductSection
                      key={section.id}
                      title={section.title}
                      subtitle="Aproveite enquanto durar"
                      products={promos}
                      viewAllLink="/search?discount=true"
                      icon={<Tag className="w-6 h-6" style={{ color: themeStyles.primaryColor }} />}
                      layoutConfig={layout}
                  />
                );
              }

              if (section.id === 'blog' && posts.length > 0) {
                  return (
                    <section key={section.id} className="space-y-8">
                        <div className="flex items-end justify-between">
                            <div>
                                <h2 className="text-3xl font-black flex items-center gap-2">
                                    <Newspaper className="w-8 h-8" style={{ color: themeStyles.primaryColor }} />
                                    {section.title}
                                </h2>
                                <p className="text-zinc-500 mt-1">Dicas e novidades direto para você</p>
                            </div>
                            <Link href="/blog" className="text-sm font-bold flex items-center gap-1 group" style={{ color: themeStyles.primaryColor }}>
                                Ver todos <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <Link 
                                    key={post.id} 
                                    href={`/blog/${post.slug}`}
                                    className={`group bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-xl transition-all border border-zinc-100 dark:border-zinc-800 ${layout.theme.borderRadius}`}
                                >
                                    <div className="relative aspect-video">
                                        {post.imageUrl ? (
                                            <Image src={post.imageUrl} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">📝</div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold group-hover:text-indigo-600 transition-colors line-clamp-2">{post.title}</h3>
                                        <p className="text-sm text-zinc-500 mt-3 line-clamp-2">{post.content.replace(/[#*_]/g, '')}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                  );
              }

              if (section.id === 'benefits') {
                  return (
                    <section key={section.id} className={`bg-zinc-900 p-10 text-white shadow-2xl relative overflow-hidden ${layout.theme.borderRadius}`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center relative z-10">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">{section.title}</h3>
                                <p className="text-zinc-400 text-sm">Garantimos a melhor experiência de compra personalizada para você.</p>
                            </div>
                            <div className="space-y-2 flex flex-col items-center">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                                    <TrendingUp className="w-6 h-6 text-blue-400" />
                                </div>
                                <h4 className="font-bold">Frete Smart</h4>
                                <p className="text-zinc-500 text-xs">Cálculo dinâmico baseado na sua localização</p>
                            </div>
                            <div className="space-y-2 flex flex-col items-center">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                                    <Heart className="w-6 h-6 text-pink-400" />
                                </div>
                                <h4 className="font-bold">Suporte VIP</h4>
                                <p className="text-zinc-500 text-xs">Atendimento prioritário via WhatsApp</p>
                            </div>
                        </div>
                    </section>
                  );
              }

              return null;
          })}

        </div>
      </div>
    </div>
  );
}

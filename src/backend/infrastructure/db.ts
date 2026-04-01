import { prisma } from '@/lib/prisma';
import { StoreConfig } from '@/backend/types';

export const db = {
  async getProducts() {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: { images: true }
    });
    return products.map(p => ({
      ...p,
      // Ensure types match, Prisma returns Date objects which Nextjs can serialize in server components but strict types might need 'string'
      createdAt: p.createdAt.toISOString(),
      // imageUrl might be null in DB but string in type, handle fallback
      imageUrl: p.imageUrl || '',
      images: p.images.map(img => img.url),
    }));
  },

  async getStoreConfig() {
    let store = await prisma.store.findFirst();
    if (!store) {
      store = await prisma.store.create({
        data: {
          name: 'Simplify Store',
          slug: 'simplify',
          ownerId: 'admin',
          originZipCode: '01310-100',
          plan: 'pro',
          active: true
        }
      });
    }
    return store;
  },

  async updateStoreConfig(data: Partial<StoreConfig>) {
    const current = await this.getStoreConfig();
    return await prisma.store.update({
      where: { id: current.id },
      data: {
        name: data.name
      }
    });
  }
};

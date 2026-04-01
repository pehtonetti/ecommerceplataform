import { revalidateTag, unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

/**
 * CACHE KEY: Storefront Products
 * Revalidates only on product edit/delete or global revalidation
 */
export const getCachedProducts = (storeId: string) => {
    return unstable_cache(
        async () => {
            return await prisma.product.findMany({
                where: { storeId, active: true },
                orderBy: { createdAt: 'desc' }
            });
        },
        [`products-${storeId}`],
        { tags: [`products-${storeId}`], revalidate: 3600 } // Global TTL 1h
    )();
};

/**
 * REVALIDATION HELPER
 * Call this when a product is modified
 */
export const revalidateStoreProducts = (storeId: string) => {
    revalidateTag(`products-${storeId}`);
};

/**
 * CACHE KEY: Store Theme & Config
 */
export const getCachedStore = (slug: string) => {
    return unstable_cache(
        async () => {
            return await prisma.store.findUnique({
                where: { slug }
            });
        },
        [`store-${slug}`],
        { tags: [`store-${slug}`], revalidate: 86400 } // Global TTL 24h
    )();
};

export const revalidateStoreConfig = (slug: string) => {
    revalidateTag(`store-${slug}`);
};

/**
 * REDIS CLIENT COMPAT (Health Check)
 * Exporting for api/health/route.ts
 */
export const getRedisClient = async () => {
    return {
        ping: async () => 'PONG'
    } as any;
};

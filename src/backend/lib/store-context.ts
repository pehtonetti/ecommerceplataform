/**
 * store-context.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Central helper to resolve which Store is active for a given request.
 *
 * Resolution order:
 *  1. x-store-id header (injected by middleware — fastest path)
 *  2. Custom domain lookup
 *  3. Subdomain lookup  (slug.platform.com)
 *  4. Fallback: first active store (useful for localhost / single-store installs)
 */

import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

// ─── Types ────────────────────────────────────────────────────────────────────

export type StoreContext = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  ownerId: string;
  logoUrl: string | null;
  primaryColor: string | null;
  theme: string | null;
  currency: string;
  locale: string;
  originZipCode: string | null;
  whatsappNumber: string | null;
  pixKey: string | null;
  googleAnalyticsId: string | null;
  facebookPixelId: string | null;
  homeLayout: string | null;
};

// ─── Platform root domain ─────────────────────────────────────────────────────
const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN ?? 'localhost';

// ─── Main resolver (Server Components / Route Handlers) ───────────────────────

/**
 * Resolves the current Store from request headers.
 * Call this in Server Components and API Route Handlers.
 *
 * @throws Error if no store could be resolved.
 */
export async function getStoreContext(): Promise<StoreContext> {
  const headersList = await headers();

  // 1. Fast path: middleware already resolved and injected the store id
  const storeIdHeader = headersList.get('x-store-id');
  if (storeIdHeader) {
    const store = await prisma.store.findUnique({ where: { id: storeIdHeader } });
    if (store) return store as StoreContext;
  }

  // 2. Resolve from hostname
  const hostname = headersList.get('host') ?? '';
  return resolveStoreFromHostname(hostname);
}

/**
 * Resolve store from a raw hostname string.
 * Exported so middleware (Edge runtime) can reuse the slug/domain logic.
 */
export async function resolveStoreFromHostname(hostname: string): Promise<StoreContext> {
  const host = hostname.split(':')[0]; // strip port

  // 2a. Custom domain (exact match, e.g. www.minha-loja.com.br)
  const byDomain = await prisma.store.findFirst({
    where: { customDomain: host, active: true },
  });
  if (byDomain) return byDomain as StoreContext;

  // 2b. Subdomain (slug.platform.com)
  if (host.endsWith(`.${PLATFORM_DOMAIN}`)) {
    const slug = host.replace(`.${PLATFORM_DOMAIN}`, '');
    const bySlug = await prisma.store.findFirst({
      where: { slug, active: true },
    });
    if (bySlug) return bySlug as StoreContext;
  }

  // 2c. Localhost dev — fall back to first active store
  if (host === 'localhost' || host === '127.0.0.1') {
    const fallback = await prisma.store.findFirst({ where: { active: true } });
    if (fallback) return fallback as StoreContext;
  }

  throw new Error(`No active store found for host: ${hostname}`);
}

// ─── Convenience: get just the storeId ───────────────────────────────────────

export async function getStoreId(): Promise<string> {
  const store = await getStoreContext();
  return store.id;
}

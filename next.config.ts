import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|webp|svg|gif|ico)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "images-cache",
          expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "fonts-cache",
          expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 },
        },
      },
    ],
  },
});

// ─── HTTP Security Headers ───────────────────────────────────────────────────
const securityHeaders = [
  // Previne clickjacking (não pode ser carregado em iframe externo)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },

  // Previne MIME sniffing (browsers não interpretam arquivos diferente do Content-Type)
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Força HTTPS por 1 ano em produção
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },

  // Controla informações no Referrer
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // Desativa features de browser não utilizadas
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(self), usb=()',
  },

  // XSS Protection (para browsers legados)
  { key: 'X-XSS-Protection', value: '1; mode=block' },

  // Content Security Policy
  // Nota: ajustar domínios conforme CDNs e integrações utilizadas
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://vitals.vercel-insights.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ─── Security Headers em todas as rotas ─────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  // ─── Domínios permitidos para Next.js Image Optimizer ───────────────────
  // ❌ Não use hostname: '**' — isso e SSRF via image proxy
  images: {
    remotePatterns: [
      // Storage de imagens da plataforma (Supabase, S3, Cloudinary)
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.in' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // AWS S3
      { protocol: 'https', hostname: '*.amazonaws.com' },
      // Google (fotos de perfil OAuth)
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      // Unsplash (imagens de exemplo/seed)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      // Placeholder services
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
};

export default withPWA(nextConfig);

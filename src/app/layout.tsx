import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { WhatsAppButton } from "@/frontend/components/WhatsAppButton";
import { CookieConsent } from "@/frontend/components/CookieConsent";
import { AiPersuader } from "@/frontend/components/ai/AiPersuader";
import { AnnouncementBar } from "@/frontend/components/AnnouncementBar";
import { CompareProvider } from "@/frontend/contexts/CompareContext";
import { CartProvider } from "@/frontend/contexts/CartContext";
import { CompareDrawer } from "@/frontend/components/ui/CompareDrawer";
import { MobileNav } from "@/frontend/components/ui/MobileNav";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://simplifytech.eu'),
  title: {
    default: "Simplify | Tecnologia Premium & Inovação",
    template: "%s | Simplify"
  },
  description: "A Simplify é a sua curadoria de tecnologia premium. Descubra eletrônicos, smartphones e gadgets exclusivos com o selo de qualidade Simplify.",
  keywords: ["tecnologia premium", "simplify tech", "eletrônicos de luxo", "gadgets exclusivos", "bauru tech", "apple style store"],
  authors: [{ name: "Pedro Tonetti" }],
  creator: "Simplify",
  publisher: "Simplify Tech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    title: "Simplify | Tecnologia Premium & Inovação",
    description: "Sua curadoria definitiva de tecnologia premium e eletrônicos exclusivos.",
    siteName: "Simplify",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Simplify - Tecnologia Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simplify | Tecnologia Premium",
    description: "Sua curadoria definitiva de tecnologia premium e eletrônicos exclusivos.",
    images: ["/images/og-image.png"],
    creator: "@simplifytech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "verification_id", // User should replace this
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { getStoreContext } from '@/backend/lib/store-context';
import { StoreThemeProvider } from '@/frontend/components/StoreThemeProvider';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch initial cart state server-side to avoid hydration mismatch
  const { getCart } = await import('@/backend/actions/cart-actions');
  const cartData = await getCart();
  
  // Obter o contexto visual da Loja (Primary Color e Tema)
  const storeContext = await getStoreContext().catch(() => null);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`antialiased selection:bg-primary selection:text-white font-sans`}
        suppressHydrationWarning
      >
        {/* Injeta as variáveis de cor (CSS Root) relativas à Loja logada/acessada */}
        <StoreThemeProvider 
          primaryColor={storeContext?.primaryColor} 
          themeType={storeContext?.theme || 'minimal'} 
        />

        <CartProvider initialCart={cartData?.cart}>
          <CompareProvider>
            {children}
            <Toaster position="top-right" richColors />
            <CookieConsent />
            <AiPersuader />
            <CompareDrawer />
            <MobileNav />
            <WhatsAppButton />
          </CompareProvider>
        </CartProvider>
      </body>
    </html>
  );
}

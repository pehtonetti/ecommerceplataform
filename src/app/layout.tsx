import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch initial cart state server-side to avoid hydration mismatch
  // Dynamic import if needed or regular import if actions are compatible
  const { getCart } = await import('@/backend/actions/cart-actions');
  const cartData = await getCart();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary selection:text-white`}
        suppressHydrationWarning
      >
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

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/frontend/components/ThemeProvider";
import { Toaster } from "sonner";
import { WhatsAppButton } from "@/frontend/components/WhatsAppButton";
import { CookieConsent } from "@/frontend/components/CookieConsent";
import { AiPersuader } from "@/frontend/components/ai/AiPersuader";
import { AnnouncementBar } from "@/frontend/components/AnnouncementBar";
import { CompareProvider } from "@/frontend/contexts/CompareContext";
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
  title: {
    default: "Simplify | Tecnologia Premium",
    template: "%s | Simplify"
  },
  description: "A melhor experiência de compra em tecnologia, eletrônicos e gadgets premium com entrega rápida em todo o Brasil.",
  keywords: ["e-commerce", "tecnologia", "gadgets", "eletrônicos", "compras online", "brasil"],
  authors: [{ name: "Antigravity Team" }],
  creator: "Antigravity",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://antigravity-store.com",
    title: "Antigravity Store | Tecnologia Premium",
    description: "Sua loja de tecnologia premium com os melhores produtos",
    siteName: "Simplify",
  },
  twitter: {
    card: "summary_large_image",
    title: "Antigravity Store | Tecnologia Premium",
    description: "Sua loja de tecnologia premium com os melhores produtos",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <div suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CompareProvider>
              {children}
              <Toaster position="top-right" richColors />
              <CookieConsent />
              <AiPersuader />
              <CompareDrawer />
              <MobileNav />
            </CompareProvider>
          </ThemeProvider>
          <WhatsAppButton />
        </div>
      </body>
    </html>
  );
}

import { getCurrentUser } from '@/lib/auth';
import { Header } from '@/frontend/components/Header';
import { Footer } from '@/frontend/components/Footer';
import { getStoreContext } from '@/backend/lib/store-context';
import Script from 'next/script';
import { MessageCircle } from 'lucide-react';

export default async function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    const store = await getStoreContext();

    return (
        <div className="min-h-screen bg-transparent flex flex-col font-sans" suppressHydrationWarning>
            {/* Google Analytics 4 */}
            {store.googleAnalyticsId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${store.googleAnalyticsId}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${store.googleAnalyticsId}', {
                                page_path: window.location.pathname,
                            });
                        `}
                    </Script>
                </>
            )}

            {/* Facebook Pixel */}
            {store.facebookPixelId && (
                <Script id="fb-pixel" strategy="afterInteractive">
                    {`
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${store.facebookPixelId}');
                        fbq('track', 'PageView');
                    `}
                </Script>
            )}

            <Header user={user} store={store} />
            <main className="flex-1 pt-[88px] md:pt-[104px]">
                {children}
            </main>
            <Footer />

            {/* WhatsApp Floating Button */}
            {store.whatsappNumber && (
                <a
                    href={`https://wa.me/${store.whatsappNumber.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center animate-bounce duration-[3000ms]"
                    aria-label="Falar no WhatsApp"
                >
                    <MessageCircle className="w-8 h-8 fill-current" />
                </a>
            )}
        </div>
    );
}


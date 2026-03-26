'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Mostrar banner após 1 segundo
            setTimeout(() => setShowBanner(true), 1000);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setShowBanner(false);
    };

    const rejectCookies = () => {
        localStorage.setItem('cookie-consent', 'rejected');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[420px] z-50 p-6 bg-white/80 backdrop-blur-2xl border border-zinc-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] animate-in slide-in-from-bottom-10 duration-500">
            <div className="relative">
                <button
                    onClick={rejectCookies}
                    className="absolute -top-1 -right-1 p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                    aria-label="Fechar"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-200">
                            <Cookie className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-zinc-900 text-lg">Cookies & Privacidade</h3>
                    </div>

                    <p className="text-sm text-zinc-500 leading-relaxed">
                        Utilizamos cookies para personalizar sua experiência e analisar nosso tráfego em conformidade com a LGPD. 
                        Ao navegar, você concorda com nossa{' '}
                        <Link href="/privacy" className="text-zinc-900 font-medium hover:underline">
                            Política de Privacidade
                        </Link>.
                    </p>

                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={acceptCookies}
                            className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800 px-4 py-2.5 rounded-2xl font-medium transition-all text-sm shadow-md"
                        >
                            Aceitar Todos
                        </button>
                        <button
                            onClick={rejectCookies}
                            className="flex-1 bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 px-4 py-2.5 rounded-2xl font-medium transition-all text-sm"
                        >
                            Recusar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

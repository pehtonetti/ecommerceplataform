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
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 glass border-t border-border shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="container mx-auto max-w-6xl">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Cookie className="w-5 h-5 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <h3 className="font-semibold mb-2">Este site usa cookies 🍪</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e analisar nosso tráfego.
                            Ao clicar em "Aceitar", você concorda com o uso de cookies conforme nossa{' '}
                            <Link href="/privacy" className="text-primary hover:underline">
                                Política de Privacidade
                            </Link>.
                        </p>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={acceptCookies}
                                className="bg-primary text-primary-foreground hover:opacity-90 px-6 py-2 rounded-lg font-medium transition-all text-sm"
                            >
                                Aceitar Todos
                            </button>
                            <button
                                onClick={rejectCookies}
                                className="border border-border hover:bg-accent px-6 py-2 rounded-lg font-medium transition-all text-sm"
                            >
                                Rejeitar
                            </button>
                            <Link
                                href="/privacy"
                                className="border border-border hover:bg-accent px-6 py-2 rounded-lg font-medium transition-all text-sm inline-flex items-center"
                            >
                                Saiba Mais
                            </Link>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={rejectCookies}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Fechar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

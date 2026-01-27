"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Home, Truck, Bell, Star } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import Link from "next/link";
import { AiProductRecommendations } from "@/frontend/components/product/AiProductRecommendations";

export function SuccessContent({ orderId }: { orderId: string }) {
    const [status, setStatus] = useState(0);

    useEffect(() => {
        // Simple step animation for order status
        const interval = setInterval(() => {
            setStatus(s => (s < 3 ? s + 1 : s));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans flex flex-col items-center justify-center p-4 pt-32">
            {/* Confetti Animation (Simulated with random sparkles) */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0.5],
                        x: (Math.random() - 0.5) * 600,
                        y: (Math.random() - 0.5) * 600
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className="fixed text-primary pointer-events-none"
                    style={{ left: '50%', top: '40%' }}
                >
                    <Star className="w-6 h-6 fill-current" />
                </motion.div>
            ))}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900 border border-border rounded-3xl p-10 max-w-xl w-full text-center shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-green-500" />

                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>

                <h1 className="text-4xl font-black mb-2 tracking-tight">Obrigado!</h1>
                <p className="text-muted-foreground mb-8">
                    Seu pedido <strong className="text-black dark:text-white">#{orderId.slice(0, 8).toUpperCase()}</strong> foi confirmado.
                </p>

                {/* Delivery Tracker */}
                <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl p-6 border border-border mb-8 text-left">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Acompanhamento em tempo real
                    </h3>

                    <div className="space-y-6">
                        {[
                            { step: 0, label: "Pedido Recebido", sub: "Aguardando confirmação de pagamento" },
                            { step: 1, label: "Pagamento Confirmado", sub: "Preparando seus itens premium" },
                            { step: 2, label: "Em Separação", sub: "Seu pacote está sendo embalado" },
                            { step: 3, label: "Enviado", sub: "Código de rastreio em breve no seu e-mail" },
                        ].map((item) => (
                            <div key={item.step} className="flex gap-4 relative">
                                {item.step < 3 && (
                                    <div className={`absolute left-[11px] top-6 w-0.5 h-full ${status > item.step ? 'bg-green-500' : 'bg-border'}`} />
                                )}
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${status >= item.step ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-zinc-800 text-zinc-400'}`}>
                                    {status > item.step ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                </div>
                                <div className={status >= item.step ? 'opacity-100' : 'opacity-40'}>
                                    <p className="text-sm font-bold leading-none mb-1">{item.label}</p>
                                    <p className="text-[10px] text-muted-foreground leading-none">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Link href="/orders">
                        <Button variant="outline" className="w-full gap-2 h-14 rounded-2xl">
                            <Package className="w-5 h-5" />
                            Meus Pedidos
                        </Button>
                    </Link>

                    <Link href="/">
                        <Button className="w-full gap-2 h-14 rounded-2xl shadow-lg shadow-primary/20">
                            <Home className="w-5 h-5" />
                            Loja
                        </Button>
                    </Link>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <Bell className="w-3 h-3 text-primary" />
                    Enviamos atualizações via WhatsApp para você
                </div>
            </motion.div>

            <div className="mt-12 w-full max-w-6xl">
                <AiProductRecommendations />
            </div>
        </div>
    );
}

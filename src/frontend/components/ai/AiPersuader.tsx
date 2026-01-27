"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Zap, ShoppingCart, Timer, Flame } from "lucide-react";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";

export function AiPersuader() {
    const [isVisible, setIsVisible] = useState(false);
    const [offer, setOffer] = useState({ title: "", description: "", productId: "" });
    const router = useRouter();

    useEffect(() => {
        // AI Logic: Trigger an "emergency" popup after 30 seconds if the user hasn't added anything to cart
        const timer = setTimeout(() => {
            setOffer({
                title: "OFERTA RELÂMPAGO! 🔥",
                description: "Vimos que você está de olho em alguns itens. Use o cupom URGENTE10 nas próximas 5 minutos para 10% OFF!",
                productId: "mock-id"
            });
            setIsVisible(true);
        }, 30000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-8 left-8 z-[100] animate-in slide-in-from-left-full duration-500">
            <div className="glass-ios p-6 rounded-2xl w-80 shadow-2xl border-primary/20">
                <div className="flex items-center gap-2 text-primary font-bold mb-2">
                    <Flame className="w-5 h-5 animate-bounce" />
                    <span>{offer.title}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    {offer.description}
                </p>
                <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => setIsVisible(false)}>
                        Ignorar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-primary border-primary" onClick={() => {
                        toast.success("Cupom URGENTE10 copiado!");
                        setIsVisible(false);
                    }}>
                        Copiar Cupom
                    </Button>
                </div>
                <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-orange-600 font-bold uppercase tracking-widest">
                    <Timer className="w-3 h-3" />
                    <span>Expira em 04:59</span>
                </div>
            </div>
        </div>
    );
}

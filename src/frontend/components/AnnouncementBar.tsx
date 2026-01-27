"use client";

import { motion } from "framer-motion";
import { Sparkles, Ticket, Truck } from "lucide-react";

export function AnnouncementBar() {
    return (
        <div className="fixed top-0 left-0 right-0 z-[60] h-10 bg-black text-white overflow-hidden border-b border-white/10 select-none">
            <motion.div
                animate={{ x: ["100%", "-100%"] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center gap-20 whitespace-nowrap px-4"
            >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <Truck className="w-4 h-4 text-primary" />
                    Frete Grátis para todo o Brasil em compras acima de R$ 299!
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-yellow-500">
                    <Sparkles className="w-4 h-4" />
                    Ganhe 100 pontos de fidelidade na sua primeira avaliação de produto!
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400">
                    <Ticket className="w-4 h-4" />
                    Use o cupom BEMVINDO10 para 10% de desconto na primeira compra!
                </div>
                {/* Duplicate for infinite loop effect */}
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <Truck className="w-4 h-4 text-primary" />
                    Frete Grátis para todo o Brasil em compras acima de R$ 299!
                </div>
            </motion.div>
        </div>
    );
}

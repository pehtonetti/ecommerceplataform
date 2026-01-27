"use client";

import { useCompare } from "@/frontend/contexts/CompareContext";
import { X, ArrowRightLeft, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
import Link from "next/link";

export function CompareDrawer() {
    const { compareList, removeFromCompare, clearCompare } = useCompare();

    if (compareList.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 200 }}
                animate={{ y: 0 }}
                exit={{ y: 200 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] w-full max-w-2xl px-4"
            >
                <div className="glass p-4 rounded-2xl shadow-2xl border border-primary/20 flex flex-col md:flex-row items-center gap-6 overflow-hidden relative">
                    <div className="flex items-center gap-2 text-primary">
                        <ArrowRightLeft className="w-5 h-5 animate-pulse" />
                        <span className="font-black uppercase text-xs tracking-widest">Comparar</span>
                        <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{compareList.length}</span>
                    </div>

                    <div className="flex-1 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {compareList.map((product) => (
                            <div key={product.id} className="relative group flex-shrink-0">
                                <div className="w-12 h-12 rounded-lg border border-border bg-white dark:bg-zinc-800 p-1">
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                                </div>
                                <button
                                    onClick={() => removeFromCompare(product.id)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-2 h-2" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={clearCompare} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <Link href="/compare">
                            <Button size="sm" className="gap-2 rounded-full px-6">
                                Comparar <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

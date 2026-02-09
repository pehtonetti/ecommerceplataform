"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User, ArrowRightLeft } from "lucide-react";
import { useCompare } from "@/frontend/contexts/CompareContext";
import { useCart } from "@/frontend/contexts/CartContext";

export function MobileNav() {
    const pathname = usePathname();
    const { compareList } = useCompare();
    const { cart } = useCart();

    const tabs = [
        { href: "/", icon: Home, label: "Início" },
        { href: "/search", icon: Search, label: "Buscar" },
        { href: "/cart", icon: ShoppingBag, label: "Carrinho", count: cart?.items?.length || 0 },
        { href: "/compare", icon: ArrowRightLeft, label: "Comparar", count: compareList.length },
        { href: "/account", icon: User, label: "Conta" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-border flex md:hidden items-center justify-around p-2 safe-bottom">
            {tabs.map((tab) => (
                <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex flex-col items-center gap-1 p-2 relative ${pathname === tab.href ? 'text-primary' : 'text-muted-foreground'}`}
                >
                    <tab.icon className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                        <span className="absolute top-1 right-1 bg-primary text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center">
                            {tab.count}
                        </span>
                    )}
                </Link>
            ))}
        </nav>
    );
}

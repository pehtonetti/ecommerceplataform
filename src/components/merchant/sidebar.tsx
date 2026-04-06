'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Store, LayoutDashboard, Package, ShoppingBag, FolderOpen,
    Users, BarChart3, Tag, Image, Star, FileText,
    Palette, Settings, Zap, LifeBuoy, LogOut, ExternalLink
} from 'lucide-react';

const NAV_GROUPS = [
    {
        label: 'Principal',
        items: [
            { href: '/dashboard', label: 'Visão Geral', icon: LayoutDashboard, exact: true },
            { href: '/dashboard/orders', label: 'Pedidos', icon: ShoppingBag },
            { href: '/dashboard/products', label: 'Produtos', icon: Package },
            { href: '/dashboard/categories', label: 'Categorias', icon: FolderOpen },
            { href: '/dashboard/customers', label: 'Clientes', icon: Users },
            { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
        ],
    },
    {
        label: 'Marketing & CMS',
        items: [
            { href: '/dashboard/blog', label: 'Blog', icon: FileText },
            { href: '/dashboard/banners', label: 'Banners', icon: Image },
            { href: '/dashboard/coupons', label: 'Cupons', icon: Tag },
            { href: '/dashboard/reviews', label: 'Avaliações', icon: Star },
            { href: '/dashboard/apps', label: 'Integrações', icon: Zap },
        ],
    },
    {
        label: 'Loja',
        items: [
            { href: '/dashboard/settings/appearance', label: 'Aparência', icon: Palette },
            { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
            { href: '/dashboard/support', label: 'Suporte', icon: LifeBuoy },
        ],
    },
];

export function MerchantSidebar({ storeName, storeSlug }: { storeName: string; storeSlug?: string }) {
    const pathname = usePathname();

    const isActive = (href: string, exact = false) => {
        if (exact) return pathname === href;
        return pathname === href || pathname?.startsWith(`${href}/`);
    };

    return (
        <aside className="w-64 bg-zinc-950 border-r border-zinc-800/60 flex flex-col h-screen shrink-0 sticky top-0">
            {/* Logo + Store */}
            <div className="p-5 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Store className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-black tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Simplify
                    </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5">Sua Loja</p>
                    <h2 className="text-sm font-bold text-white truncate">{storeName}</h2>
                    {storeSlug && (
                        <a
                            href={`http://${storeSlug}.simplify.com.br`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-indigo-400 transition-colors mt-1"
                        >
                            <ExternalLink className="w-2.5 h-2.5" />
                            {storeSlug}.simplify.com.br
                        </a>
                    )}
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-3 flex flex-col gap-4 overflow-y-auto">
                {NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.15em] px-2 mb-1.5">
                            {group.label}
                        </p>
                        <div className="flex flex-col gap-0.5">
                            {group.items.map((item) => {
                                const active = isActive(item.href, item.exact);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 no-underline ${
                                            active
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                                : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-zinc-500'}`} />
                                        {item.label}
                                        {active && <div className="ml-auto w-1 h-1 rounded-full bg-white/60" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
                <form action="/api/auth/logout" method="POST">
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Sair da conta
                    </button>
                </form>
            </div>
        </aside>
    );
}

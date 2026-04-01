'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store } from 'lucide-react';

export function MerchantSidebar({ storeName }: { storeName: string }) {
    const pathname = usePathname();

    const links = [
        { href: '/dashboard', label: '📊 Visão Geral', icon: '📊' },
        { href: '/dashboard/orders', label: '📦 Pedidos', icon: '📦' },
        { href: '/dashboard/products', label: '🛍️ Produtos', icon: '🛍️' },
        { href: '/dashboard/categories', label: '📂 Categorias', icon: '📂' },
        { href: '/dashboard/customers', label: '👥 Clientes', icon: '👥' },
        { href: '/dashboard/marketing', label: '🎯 Marketing', icon: '🎯' },
        { href: '/dashboard/settings', label: '⚙️ Configurações', icon: '⚙️' },
    ];

    return (
        <aside className="w-68 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen shrink-0 sticky top-0 shadow-2xl">
            <div className="p-8 pb-6 group cursor-default">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                        <Store className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tightest bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Simplify
                    </span>
                </div>
                
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm group-hover:bg-white/[0.05] transition-colors">
                    <h2 className="text-sm font-bold text-white m-0 truncate">
                        {storeName}
                    </h2>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Lojista Parceiro</p>
                </div>
            </div>
            
            <nav className="flex-1 px-4 py-4 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
                {links.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname?.startsWith(`${link.href}`));
                    return (
                        <Link 
                            key={link.href} 
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl no-underline font-semibold text-sm transition-all duration-300 group/item ${
                                isActive 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                                    : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
                            }`}
                        >
                            <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover/item:scale-110'}`}>
                                {link.label.split(' ')[0]}
                            </span>
                            <span>{link.label.split(' ').slice(1).join(' ')}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-6 border-t border-white/5 space-y-4">
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1 text-center">Precisa de Ajuda?</p>
                    <Link href="/dashboard/support" className="block w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[11px] font-bold rounded-lg text-center transition-all">
                        Falar com Consultor
                    </Link>
                </div>
                
                <form action="/api/auth/logout" method="POST">
                    <button type="submit" className="w-full py-3 bg-white/[0.03] text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl font-bold cursor-pointer text-center transition-all text-xs border border-transparent hover:border-red-400/20">
                        Finalizar Sessão
                    </button>
                </form>
            </div>
        </aside>
    );
}

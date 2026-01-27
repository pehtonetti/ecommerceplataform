"use client";

import Link from 'next/link';
import { ShoppingBag, Menu, User, LayoutDashboard, Settings, LogOut, Coins, Heart, MapPin } from 'lucide-react';
import { Button } from './ui/Button';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { toast } from 'sonner';
import { MiniCart } from './ui/MiniCart';
import { useRouter } from 'next/navigation';

export function Header({ user }: { user?: any }) {
    const router = useRouter();

    const handleSearch = (filters: any) => {
        const params = new URLSearchParams();
        if (filters.query) params.set('q', filters.query);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-colors duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Mobile Menu & Logo */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="md:hidden -ml-2">
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-foreground/5 h-10 w-10 rounded-lg flex items-center justify-center border border-border/50 group-hover:border-primary/50 transition-colors p-1.5">
                            <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden sm:block group-hover:text-primary transition-colors">Simplify</span>
                    </Link>
                </div>

                {/* Search Bar - Desktop */}
                <div className="hidden md:block flex-1 max-w-xl">
                    <SearchBar onSearch={handleSearch} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    <MiniCart />

                    {user ? (
                        <div className="relative group">
                            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity p-1">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                    {user.name?.charAt(0) || <User className="h-4 w-4" />}
                                </div>
                                <div className="hidden sm:flex flex-col items-start text-xs">
                                    <span className="font-semibold">{user.name?.split(' ')[0]}</span>
                                    <span className="text-muted-foreground capitalize">{user.role === 'admin' ? 'Administrador' : 'Cliente'}</span>
                                </div>
                            </button>

                            {/* Dropdown Menu - Via CSS Group Hover to ensure it works smoothly */}
                            <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                <div className="p-3 border-b border-border bg-muted/30">
                                    <p className="text-xs font-bold truncate">{user.name}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className="bg-yellow-400 text-yellow-900 rounded-full p-0.5">
                                            <Coins className="w-3 h-3" />
                                        </div>
                                        <span className="text-[10px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-tighter">
                                            {user.loyaltyPoints?.toLocaleString() || 0} Pontos
                                        </span>
                                    </div>
                                </div>

                                <nav className="p-2 flex flex-col gap-1">
                                    {(user.role === 'admin' || user.role === 'editor') && (
                                        <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-primary/10 text-primary font-medium transition-colors">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Painel Admin
                                        </Link>
                                    )}

                                    <Link href="/orders" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                        <ShoppingBag className="w-4 h-4" />
                                        Meus Pedidos
                                    </Link>

                                    <Link href="/account/loyalty" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/10 text-yellow-700 dark:text-yellow-500 font-medium transition-colors">
                                        <Coins className="w-4 h-4" />
                                        Pontos & Recompensas
                                    </Link>

                                    <Link href="/account/wishlist" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                        <Heart className="w-4 h-4" />
                                        Favoritos
                                    </Link>

                                    <Link href="/account/addresses" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                        <MapPin className="w-4 h-4" />
                                        Endereços
                                    </Link>

                                    <Link href="/account" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                        <Settings className="w-4 h-4" />
                                        Minha Conta
                                    </Link>

                                    <div className="h-px bg-border my-1"></div>

                                    <form action={async () => {
                                        const { logout } = await import('@/backend/actions/auth-actions');
                                        await logout();
                                    }}>
                                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600 dark:hover:bg-red-900/20 transition-colors">
                                            <LogOut className="w-4 h-4" />
                                            Sair da Conta
                                        </button>
                                    </form>
                                </nav>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button size="sm" className="gap-2">
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">Entrar</span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Sub-Header (Content Boxes / Navigation) */}
            <div className="border-t border-border/50 hidden md:block">
                <div className="container mx-auto px-4 h-10 flex items-center gap-6 text-sm overflow-x-auto">
                    <Link href="/search?category=eletronicos" className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Eletrônicos</Link>
                    <Link href="/search?category=smartphones" className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Smartphones</Link>
                    <Link href="/search?category=notebooks" className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Notebooks</Link>
                    <Link href="/search?category=audio" className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Áudio</Link>
                    <Link href="/search?category=acessorios" className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Acessórios</Link>
                    <div className="border-l border-border/50 h-4 mx-2"></div>
                    <Link href="/offers" className="text-orange-600 font-medium hover:text-orange-700 transition-colors whitespace-nowrap">Ofertas do Dia</Link>
                </div>
            </div>

            {/* Search Bar - Mobile */}
            <div className="md:hidden px-4 pb-3">
                <SearchBar onSearch={handleSearch} />
            </div>
        </header>
    );
}

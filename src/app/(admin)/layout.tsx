import Link from 'next/link';
import {
    LayoutDashboard, Package, Settings, ShoppingBag, Users, ListTree,
    Warehouse, CreditCard, Truck, TicketPercent, Megaphone, BarChart3,
    ShieldAlert, FileText, Headphones, TrendingUp
} from 'lucide-react';
import { Button } from '@/frontend/components/ui/Button';
import { LogoutButton } from '@/frontend/components/auth/LogoutButton';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50 text-neutral-900 dark:bg-black dark:text-neutral-50 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-zinc-100 dark:border-zinc-800 hidden md:flex flex-col shadow-sm z-10 transition-all duration-300">
                <div className="p-6">
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
                        <LayoutDashboard className="h-6 w-6 text-zinc-900 dark:text-white" />
                        <span>Admin</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
                    <p className="px-3 text-xs font-semibold text-muted-foreground mb-2 mt-2 uppercase tracking-wider">Geral</p>
                    <NavItem href="/admin" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />

                    <p className="px-3 text-xs font-semibold text-muted-foreground mb-2 mt-6 uppercase tracking-wider">Loja</p>
                    <NavItem href="/admin/products" icon={<Package className="h-4 w-4" />} label="Produtos" />
                    <NavItem href="/admin/categories" icon={<ListTree className="h-4 w-4" />} label="Categorias" />
                    <NavItem href="/admin/inventory" icon={<Warehouse className="h-4 w-4" />} label="Estoque" />
                    <NavItem href="/admin/promotions" icon={<TicketPercent className="h-4 w-4" />} label="Cupons & Promo" />

                    <p className="px-3 text-xs font-semibold text-muted-foreground mb-2 mt-6 uppercase tracking-wider">Vendas</p>
                    <NavItem href="/admin/orders" icon={<ShoppingBag className="h-4 w-4" />} label="Pedidos" />
                    <NavItem href="/admin/payments" icon={<CreditCard className="h-4 w-4" />} label="Pagamentos" />
                    <NavItem href="/admin/shipping" icon={<Truck className="h-4 w-4" />} label="Envio & Logística" />
                    <NavItem href="/admin/fiscal" icon={<FileText className="h-4 w-4" />} label="Fiscal (NFe)" />

                    <p className="px-3 text-xs font-semibold text-muted-foreground mb-2 mt-6 uppercase tracking-wider">Pessoas</p>
                    <NavItem href="/admin/customers" icon={<Users className="h-4 w-4" />} label="Clientes" />
                    <NavItem href="/admin/staff" icon={<ShieldAlert className="h-4 w-4" />} label="Equipe & Permissões" />
                    <NavItem href="/admin/support" icon={<Headphones className="h-4 w-4" />} label="Suporte & SAC" />

                    <p className="px-3 text-xs font-semibold text-muted-foreground mb-2 mt-6 uppercase tracking-wider">Gestão</p>
                    <NavItem href="/admin/marketing" icon={<Megaphone className="h-4 w-4" />} label="Marketing" />
                    <NavItem href="/admin/reports" icon={<BarChart3 className="h-4 w-4" />} label="Relatórios" />
                    <NavItem href="/admin/analytics" icon={<TrendingUp className="h-4 w-4" />} label="Analytics (IA)" />
                    <NavItem href="/admin/settings" icon={<Settings className="h-4 w-4" />} label="Configurações" />
                </nav>

                <div className="p-4 border-t border-border">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="md:hidden h-16 glass border-b border-border flex items-center px-4">
                    {/* Mobile Header (Simplified) */}
                    <span className="font-bold">Admin Panel</span>
                </div>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            {icon}
            {label}
        </Link>
    )
}

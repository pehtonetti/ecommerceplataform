import { Button } from "@/frontend/components/ui/Button";
import { Users, ShoppingBag, DollarSign, TrendingUp, Package, BarChart3, Store } from "lucide-react";
import Link from 'next/link';
import { getDashboardStats, getRecentOrders, getLowStockProducts, getTopSellingProducts } from "@/backend/actions/dashboard-actions";

export default async function AdminDashboard() {
    const [statsData, recentOrders, lowStock, topSelling] = await Promise.all([
        getDashboardStats(),
        getRecentOrders(),
        getLowStockProducts(),
        getTopSellingProducts()
    ]);

    const stats = [
        {
            name: 'Receita Total',
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(statsData.revenue.value / 100),
            change: statsData.revenue.change,
            icon: DollarSign,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        },
        {
            name: 'Pedidos Totais',
            value: statsData.orders.value.toString(),
            change: statsData.orders.change,
            icon: ShoppingBag,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            name: 'Clientes',
            value: statsData.customers.value.toString(),
            change: statsData.customers.change,
            icon: Users,
            color: 'text-violet-500',
            bg: 'bg-violet-500/10'
        },
        {
            name: 'Baixo Estoque',
            value: statsData.lowStock.value.toString(),
            change: '', // No trending for stock yet
            icon: Package,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10'
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
                    <p className="text-muted-foreground mt-1">Resumo da performance da loja em tempo real.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                        <Store className="w-4 h-4" />
                        Ir para Loja
                    </Link>
                    <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                        Exportar Relatório
                    </button>
                </div>
            </div>

            {/* Row 1: Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <div
                        key={stat.name}
                        className={
                            "p-6 rounded-xl hover:shadow-xl transition-shadow glass-stat relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                        }
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs relative z-10">
                            {stat.change && (
                                <span className={`${stat.change.startsWith('+') ? 'text-green-500' : 'text-zinc-500'} font-medium flex items-center gap-1`}>
                                    {stat.change.startsWith('+') && <TrendingUp className="w-3 h-3" />}
                                    {stat.change}
                                </span>
                            )}
                            <span className="text-muted-foreground ml-2">geral</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Row 2: Charts & Activity */}
            <div className="grid gap-6 md:grid-cols-7">
                {/* Main Chart Area */}
                <div className="md:col-span-4 p-6 rounded-xl min-h-[400px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-lg">Vendas vs. Período</h3>
                    </div>
                    <div className="flex-1 flex items-center justify-center text-muted-foreground bg-gray-50/50 dark:bg-zinc-800/20 rounded-lg border border-dashed border-gray-200 dark:border-zinc-700">
                        <div className="text-center">
                            <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                            <p>Dados de vendas em tempo real</p>
                            <p className="text-xs mt-1">Integração Analytics ativa</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity / Notifications */}
                <div className="md:col-span-3 p-6 rounded-xl min-h-[400px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
                    <h3 className="font-semibold text-lg mb-4">Atividade Recente</h3>
                    <div className="space-y-6">
                        {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                            <div key={order.id} className="flex gap-4 items-start">
                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                                <div>
                                    <p className="text-sm font-medium">Novo pedido #{order.id.substring(0, 8)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {order.customerName} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total / 100)}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-muted-foreground">Nenhuma atividade recente.</p>
                        )}

                        {lowStock.length > 0 && (
                            <div className="flex gap-4 items-start">
                                <div className="w-2 h-2 mt-2 rounded-full bg-red-500" />
                                <div>
                                    <p className="text-sm font-medium">Alerta de Estoque</p>
                                    <p className="text-xs text-muted-foreground">
                                        {lowStock.length} produtos com baixo estoque.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Row 3: Operational Quick Views */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Últimos Pedidos</h3>
                        <Link href="/admin/orders" className="text-xs text-blue-600 hover:underline">Ver todos</Link>
                    </div>
                    <div className="space-y-3">
                        {recentOrders.slice(0, 3).map(order => (
                            <div key={order.id} className="flex justify-between items-center p-3 bg-white/50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                <div>
                                    <p className="font-medium text-sm">#{order.id.slice(0, 8)}</p>
                                    <p className="text-xs text-muted-foreground">{order.status}</p>
                                </div>
                                <Button size="sm" variant="outline" className="h-7 text-xs">Ver</Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Mais Vendidos</h3>
                    </div>
                    <div className="space-y-3">
                        {topSelling.length > 0 ? topSelling.map((prod, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <span className="text-sm line-clamp-1">{prod.name}</span>
                                <span className="text-sm font-bold text-zinc-900 dark:text-white">{prod.sales} un.</span>
                            </div>
                        )) : <p className="text-sm text-muted-foreground">Sem dados de vendas.</p>}
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Estoque Crítico</h3>
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs rounded-full">Alerta</span>
                    </div>
                    <div className="space-y-3">
                        {lowStock.length > 0 ? lowStock.map((prod, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <span className="text-sm text-red-600 dark:text-red-400 line-clamp-1">{prod.name}</span>
                                <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">Restam {prod.stock}</span>
                            </div>
                        )) : <p className="text-sm text-green-600">Estoque saudável.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

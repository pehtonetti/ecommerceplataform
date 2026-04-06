import { getDashboardStats } from '@/backend/actions/dashboard-actions';
import { getStoreContext } from '@/backend/lib/store-context';
import {
    Package, ShoppingBag, Users, BarChart3, FileText,
    Image, Tag, Star, Palette, Zap, ArrowRight, ExternalLink,
    TrendingUp, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const QUICK_ACTIONS = [
    {
        href: '/dashboard/settings/appearance',
        icon: Palette,
        label: 'Personalizar Loja',
        desc: 'Cores, logo, tema e identidade visual',
        color: 'from-violet-500 to-purple-600',
        bg: 'bg-violet-50 dark:bg-violet-950/20',
        border: 'border-violet-200 dark:border-violet-500/20',
        text: 'text-violet-700 dark:text-violet-400',
    },
    {
        href: '/dashboard/products',
        icon: Package,
        label: 'Adicionar Produtos',
        desc: 'Cadastre produtos com fotos e preços',
        color: 'from-indigo-500 to-blue-600',
        bg: 'bg-indigo-50 dark:bg-indigo-950/20',
        border: 'border-indigo-200 dark:border-indigo-500/20',
        text: 'text-indigo-700 dark:text-indigo-400',
    },
    {
        href: '/dashboard/banners',
        icon: Image,
        label: 'Criar Banners',
        desc: 'Destaque promoções na página inicial',
        color: 'from-amber-500 to-orange-600',
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        border: 'border-amber-200 dark:border-amber-500/20',
        text: 'text-amber-700 dark:text-amber-400',
    },
    {
        href: '/dashboard/blog',
        icon: FileText,
        label: 'Publicar no Blog',
        desc: 'Conquiste clientes com conteúdo SEO',
        color: 'from-emerald-500 to-teal-600',
        bg: 'bg-emerald-50 dark:bg-emerald-950/20',
        border: 'border-emerald-200 dark:border-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-400',
    },
    {
        href: '/dashboard/coupons',
        icon: Tag,
        label: 'Criar Cupons',
        desc: 'Atraia clientes com descontos especiais',
        color: 'from-pink-500 to-rose-600',
        bg: 'bg-pink-50 dark:bg-pink-950/20',
        border: 'border-pink-200 dark:border-pink-500/20',
        text: 'text-pink-700 dark:text-pink-400',
    },
    {
        href: '/dashboard/apps',
        icon: Zap,
        label: 'Conectar Apps',
        desc: 'WhatsApp, Google Analytics, Meta Pixel',
        color: 'from-sky-500 to-cyan-600',
        bg: 'bg-sky-50 dark:bg-sky-950/20',
        border: 'border-sky-200 dark:border-sky-500/20',
        text: 'text-sky-700 dark:text-sky-400',
    },
];

export default async function MerchantDashboardHome() {
    const store = await getStoreContext();
    const result = await getDashboardStats();

    const stats = result.success ? result : null;
    const isNewStore = !stats || (stats.sales?.total === 0 && stats.products?.total === 0);

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        {isNewStore ? `Bem-vindo à Simplify! 🎉` : `Olá, ${store.name}!`}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                        Sua loja:
                        <a
                            href={`http://${store.slug}.simplify.com.br`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-indigo-500 hover:text-indigo-400 transition-colors"
                        >
                            {store.slug}.simplify.com.br
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Loja no ar · Plano {store.plan.charAt(0).toUpperCase() + store.plan.slice(1)}
                </div>
            </div>

            {/* Welcome Banner for new stores */}
            {isNewStore && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-500/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
                    <div className="relative">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-2">Sua loja foi criada com sucesso!</p>
                        <h2 className="text-2xl font-black mb-2">Configure sua loja em 3 passos rápidos</h2>
                        <p className="text-indigo-100 text-sm mb-4">
                            Adicione produtos, personalize o visual e comece a vender em minutos.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/dashboard/products" className="px-4 py-2 bg-white text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors">
                                + Adicionar 1º produto
                            </Link>
                            <Link href="/dashboard/settings/appearance" className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-bold hover:bg-white/20 transition-colors">
                                Personalizar visual
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* KPI Cards */}
            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            label: 'Faturamento',
                            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((stats.sales?.total || 0) / 100),
                            sub: `${stats.sales?.totalOrders || 0} pedidos`,
                            icon: TrendingUp,
                            color: 'text-emerald-600',
                            bg: 'bg-emerald-50 dark:bg-emerald-950/20',
                        },
                        {
                            label: 'Pedidos Pendentes',
                            value: stats.orders?.pending || 0,
                            sub: 'Aguardando envio',
                            icon: ShoppingBag,
                            color: 'text-amber-600',
                            bg: 'bg-amber-50 dark:bg-amber-950/20',
                        },
                        {
                            label: 'Clientes',
                            value: stats.customers?.total || 0,
                            sub: `+${stats.customers?.new || 0} este mês`,
                            icon: Users,
                            color: 'text-blue-600',
                            bg: 'bg-blue-50 dark:bg-blue-950/20',
                        },
                        {
                            label: 'Produtos',
                            value: stats.products?.total || 0,
                            sub: `${stats.products?.active || 0} ativos`,
                            icon: Package,
                            color: 'text-indigo-600',
                            bg: 'bg-indigo-50 dark:bg-indigo-950/20',
                        },
                    ].map((kpi) => {
                        const Icon = kpi.icon;
                        return (
                            <div key={kpi.label} className="p-5 rounded-2xl border bg-card shadow-sm">
                                <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center mb-3`}>
                                    <Icon className={`w-4.5 h-4.5 ${kpi.color}`} />
                                </div>
                                <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
                                <p className="text-2xl font-black text-foreground mt-0.5">{kpi.value}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Quick Actions Grid */}
            <div>
                <h2 className="text-lg font-bold mb-4">Ferramentas da Loja</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {QUICK_ACTIONS.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={action.href}
                                href={action.href}
                                className={`group flex items-center gap-4 p-5 rounded-2xl border ${action.border} ${action.bg} hover:shadow-md transition-all duration-200 no-underline`}
                            >
                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md shrink-0`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-bold text-sm ${action.text}`}>{action.label}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{action.desc}</p>
                                </div>
                                <ArrowRight className={`w-4 h-4 ${action.text} shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all`} />
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Analytics Preview */}
            <div className="flex items-center justify-between p-5 rounded-2xl border bg-card shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <p className="font-bold text-sm">Analytics em tempo real</p>
                        <p className="text-xs text-muted-foreground">Acompanhe visitantes, vendas e conversões</p>
                    </div>
                </div>
                <Link
                    href="/dashboard/analytics"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors no-underline"
                >
                    Ver Analytics <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

        </div>
    );
}

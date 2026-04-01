import { getDashboardStats } from '@/backend/actions/analytics-actions';
import { getStoreContext } from '@/backend/lib/store-context';
import { SetupWizard } from '@/components/merchant/SetupWizard';

export default async function MerchantDashboardHome() {
    const store = await getStoreContext();
    const stats: any = await getDashboardStats();

    if (stats.error) {
        return (
            <div className="p-8 rounded-2xl bg-red-50 border border-red-100 text-red-900 dark:bg-red-950/20 dark:border-red-500/20 dark:text-red-400">
                <h3 className="font-bold flex items-center gap-2">
                    <span>⚠️</span> Erro ao carregar os dados
                </h3>
                <p className="text-sm mt-1">{stats.error}</p>
            </div>
        );
    }

    const { sales, customers, products, orders } = stats;

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tightest bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Bem-vindo, {store.name}!
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1 truncate max-w-md">
                        Painel de controle: <span className="font-mono text-indigo-500">{store.slug}.simplify.com.br</span>
                    </p>
                </div>
                {store.plan === 'trial-5brl' && (
                    <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-500/20 text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-500/5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        PLANO PROMOCIONAL ATIVO
                    </div>
                )}
            </div>

            <SetupWizard store={store} stats={stats} />


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Cartão de Vendas (Total) */}
                <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 m-0 mb-2">Faturamento Total</h3>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sales?.total || 0)}
                    </div>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-2">{sales?.totalOrders || 0} pedidos</p>
                </div>

                {/* Cartão de Pedidos Pendentes */}
                <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 m-0 mb-2">Pedidos Pendentes</h3>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {orders?.pending || 0}
                    </div>
                    <p className="text-xs font-medium text-amber-500 dark:text-amber-400 mt-2">Aguardando envio</p>
                </div>

                {/* Cartão de Clientes */}
                <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 m-0 mb-2">Clientes Totais</h3>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {customers?.total || 0}
                    </div>
                    <p className="text-xs font-medium text-blue-500 dark:text-blue-400 mt-2">+{customers?.new || 0} nos últimos 30 dias</p>
                </div>

                {/* Cartão de Produtos */}
                <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 m-0 mb-2">Seus Produtos</h3>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {products?.total || 0}
                    </div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">{products?.active || 0} ativos nesta loja</p>
                </div>
            </div>

            {/* Quick Actions Placeholder */}
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Próximos Passos
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                    <li>Adicione seu primeiro produto para começar a vender.</li>
                    <li>Configure suas opções de frete em Ajustes da Loja.</li>
                    <li>Compartilhe o link: <a href={`http://${store.slug}.simplify.com.br`} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">{store.slug}.simplify.com.br</a></li>
                </ul>
            </div>
        </div>
    );
}

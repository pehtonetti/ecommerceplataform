import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminStoresPage() {
    const user = await getCurrentUser();
    
    // Apenas o verdadeiro Dono da Plataforma (Super Admin) pode acessar
    if (!user || user.role !== 'admin') {
        redirect('/');
    }

    // Busca todas as lojas, seus donos e a volumetria de dados
    const stores = await prisma.store.findMany({
        include: {
            owner: {
                select: {
                    name: true,
                    email: true
                }
            },
            _count: {
                select: {
                    orders: true,
                    products: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold m-0 text-gray-900 dark:text-white tracking-tight">Lojas da Plataforma (Simplify)</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Gerencie todos os lojistas cadastrados em seu CMS.</p>
                </div>
                <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl font-semibold text-sm">
                    Total: {stores.length} Lojas
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b-2 border-gray-100 dark:border-zinc-800 text-gray-500 dark:text-gray-400 text-sm">
                            <th className="p-4 font-semibold">Loja</th>
                            <th className="p-4 font-semibold">Lojista / Contato</th>
                            <th className="p-4 font-semibold">Plano</th>
                            <th className="p-4 font-semibold">Volumetria</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map((store: any) => (
                            <tr key={store.id} className="border-b border-gray-50 dark:border-zinc-900 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors duration-150">
                                <td className="p-4">
                                    <div className="font-semibold text-gray-900 dark:text-white">{store.name}</div>
                                    <div className="text-sm text-indigo-600 dark:text-indigo-400">{store.slug}.simplify.com.br</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-gray-900 dark:text-white">{store.owner?.name || '---'}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{store.owner?.email || 'N/A'}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        store.plan === 'trial-5brl' 
                                            ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' 
                                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'
                                    }`}>
                                        {store.plan}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                    <div>{store._count.products} Produtos</div>
                                    <div>{store._count.orders} Pedidos</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        store.active 
                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                            : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                                    }`}>
                                        {store.active ? 'Ativa' : 'Suspensa'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="px-4 py-2 bg-transparent border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                        Gerenciar
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {stores.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    Nenhuma loja cadastrada na Simplify ainda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

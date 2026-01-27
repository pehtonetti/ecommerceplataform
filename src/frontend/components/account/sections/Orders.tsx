'use client';

import { Package, Search, Calendar, DollarSign, ChevronRight, Filter } from 'lucide-react';
import Link from 'next/link';

interface OrdersProps {
    orders: any[];
}

export function Orders({ orders }: OrdersProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Histórico de Pedidos
                </h2>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar pedido..."
                            className="pl-9 pr-4 py-2 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
                        />
                    </div>
                    <button className="p-2 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                        <Filter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="glass p-12 text-center border-dashed border-2 border-gray-200 dark:border-white/10">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum pedido encontrado</h3>
                    <p className="text-gray-500 mb-6">Você ainda não realizou nenhuma compra conosco.</p>
                    <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Começar a Comprar
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="glass p-6 border border-white/20 hover:border-blue-500/30 transition-all group rounded-xl">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                                        <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total / 100)}
                                        </p>
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {order.status === 'paid' ? 'Pago' : order.status === 'pending' ? 'Pendente' : order.status}
                                        </span>
                                    </div>
                                    <Link href={`/order-success?orderId=${order.id}`} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </Link>
                                </div>
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {order.items?.map((item: any) => (
                                    <div key={item.id} className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-100 dark:bg-white/5 overflow-hidden border border-gray-200 dark:border-white/10 relative">
                                        <img src={item.product?.imageUrl} alt="" className="w-full h-full object-cover" />
                                        <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1 rounded-tl">x{item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex gap-3">
                                <button className="text-sm font-medium text-blue-600 hover:underline">Rastrear Entrega</button>
                                <span className="text-gray-300">|</span>
                                <button className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Ver Nota Fiscal</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

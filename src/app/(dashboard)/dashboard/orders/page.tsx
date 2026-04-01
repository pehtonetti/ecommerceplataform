import { getMerchantOrders } from "@/backend/actions/order-actions";
import { Button } from "@/frontend/components/ui/Button";
import { 
    Search, 
    Filter, 
    ShoppingCart, 
    Clock, 
    CheckCircle2, 
    Truck, 
    AlertCircle,
    Eye,
    ChevronRight
} from "lucide-react";
import Link from "next/link";

export default async function MerchantOrdersPage() {
    const { orders = [] } = await getMerchantOrders();

    const statusMap: any = {
        'pending': { label: 'Pendente', icon: <Clock className="w-4 h-4" />, class: 'bg-amber-100 text-amber-700 border-amber-200' },
        'paid': { label: 'Pago', icon: <CheckCircle2 className="w-4 h-4" />, class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        'shipped': { label: 'Enviado', icon: <Truck className="w-4 h-4" />, class: 'bg-blue-100 text-blue-700 border-blue-200' },
        'delivered': { label: 'Entregue', icon: <CheckCircle2 className="w-4 h-4" />, class: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
        'cancelled': { label: 'Cancelado', icon: <AlertCircle className="w-4 h-4" />, class: 'bg-red-100 text-red-700 border-red-200' },
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Pedidos Recebidos
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Acompanhe e gerencie as vendas da sua loja em tempo real.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-full">
                        Exportar CSV
                    </Button>
                </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm space-y-1">
                    <p className="text-xs font-semibold text-muted font-mono uppercase tracking-tighter">Total Hoje</p>
                    <p className="text-2xl font-bold text-foreground">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                            orders.reduce((acc, curr) => acc + curr.total, 0) / 100
                        )}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 py-2">
                <div className="relative flex-1 max-w-sm group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-indigo-500" />
                    <input 
                        placeholder="Buscar por ID ou Cliente..." 
                        className="w-full bg-card border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all border-border/60 hover:border-border"
                    />
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex rounded-xl">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar Status
                </Button>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                <th className="h-14 px-6 align-middle font-bold text-muted-foreground/80 uppercase tracking-widest text-[10px]">ID Pedido</th>
                                <th className="h-14 px-6 align-middle font-bold text-muted-foreground/80 uppercase tracking-widest text-[10px]">Cliente</th>
                                <th className="h-14 px-6 align-middle font-bold text-muted-foreground/80 uppercase tracking-widest text-[10px]">Total</th>
                                <th className="h-14 px-6 align-middle font-bold text-muted-foreground/80 uppercase tracking-widest text-[10px]">Status</th>
                                <th className="h-14 px-6 align-middle font-bold text-muted-foreground/80 uppercase tracking-widest text-[10px]">Data</th>
                                <th className="h-14 px-6 align-middle font-bold text-muted-foreground/80 uppercase tracking-widest text-[10px] text-right">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {(orders as any[]).map((order) => (
                                <tr key={order.id} className="hover:bg-muted/20 transition-colors group">
                                    <td className="px-6 py-5 align-middle">
                                        <span className="font-mono font-bold text-indigo-600/80">#{order.id.slice(0, 8).toUpperCase()}</span>
                                    </td>
                                    <td className="px-6 py-5 align-middle">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">{order.user?.name}</span>
                                            <span className="text-xs text-muted-foreground">{order.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 align-middle">
                                        <span className="font-bold text-foreground">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total / 100)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 align-middle">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-shadow group-hover:shadow-sm ${statusMap[order.status]?.class || ''}`}>
                                            {statusMap[order.status]?.icon}
                                            {statusMap[order.status]?.label || order.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 align-middle text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-5 align-middle text-right">
                                        <Link href={`/dashboard/orders/${order.id}`}>
                                            <Button variant="ghost" size="sm" className="rounded-lg hover:bg-indigo-50 hover:text-indigo-600 font-bold gap-2">
                                                Ver
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center animate-pulse">
                                                <ShoppingCart className="w-8 h-8 text-muted-foreground/50" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-xl">Aguardando sua primeira venda</h3>
                                                <p className="text-muted-foreground max-w-xs mx-auto">
                                                    Divulgue sua loja para começar a receber pedidos! Assim que alguém comprar, os dados aparecerão aqui.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

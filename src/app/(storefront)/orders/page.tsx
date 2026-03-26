import { getUserOrders } from "@/backend/actions/order-actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { Package, ChevronRight, Truck, Calendar, CreditCard, Clock } from "lucide-react";
import { OrderActions } from "./OrderActions";
import { ORDER_STATUSES, OrderStatus } from "@/lib/order-status";
import Link from "next/link";
import { Header } from "@/frontend/components/Header";
import { Footer } from "@/frontend/components/Footer";

export default async function OrdersPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login?redirect=/orders');
    }

    const result = await getUserOrders(user.id);
    const orders = (result.orders || []).sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col relative overflow-hidden">
             {/* Subtle Luxury Aurora Background (Light) */}
             <div className="fixed inset-0 z-[-1]">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-50/50 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-50/50 blur-[150px] rounded-full"></div>
            </div>

            <Header />

            <main className="flex-1 container mx-auto px-4 pt-40 pb-20 relative z-10">
                <FadeIn>
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-12 text-left">
                            <h1 className="text-5xl font-bold mb-3 tracking-tight text-zinc-900">Meus Pedidos</h1>
                            <p className="text-zinc-500 font-medium text-lg">
                                Acompanhe sua jornada SimplifyTech.
                            </p>
                        </div>

                        {orders.length === 0 ? (
                            <div className="text-center py-24 bg-white/70 backdrop-blur-3xl border border-white rounded-[3rem] shadow-sm">
                                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-100">
                                    <Package className="w-10 h-10 text-zinc-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Sua galeria está vazia</h3>
                                <p className="text-zinc-500 mb-8 max-w-xs mx-auto font-medium">Você ainda não adquiriu produtos de nossa coleção exclusiva.</p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 bg-zinc-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                                >
                                    Abrir Catálogo
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-8">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {orders.map((order: any) => (
                                    <div
                                        key={order.id}
                                        className="group relative"
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200 to-white rounded-[2.6rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                                        <div className="relative bg-white/70 backdrop-blur-3xl border border-white rounded-[2.5rem] overflow-hidden transition-all duration-300 shadow-sm group-hover:shadow-md">
                                            <div className="p-8 md:p-10">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <p className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                                                                #{order.id.slice(0, 8).toUpperCase()}
                                                            </p>
                                                            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${ORDER_STATUSES[order.status as OrderStatus]?.color || 'bg-zinc-50 text-zinc-500'}`}>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                                                {ORDER_STATUSES[order.status as OrderStatus]?.label || order.status}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-6 text-zinc-400 font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4" />
                                                                <span className="text-xs">
                                                                    {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                                                                        day: '2-digit',
                                                                        month: 'long',
                                                                        year: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 uppercase tracking-tighter">
                                                                <Clock className="w-4 h-4" />
                                                                <span className="text-xs">
                                                                    {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-10">
                                                        <div className="text-right">
                                                            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-1">Total</p>
                                                            <p className="text-3xl font-bold text-zinc-900 tracking-tight">
                                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                                                    .format(order.total / 100)}
                                                            </p>
                                                        </div>
                                                        <Link 
                                                            href={`/order-success?orderId=${order.id}`}
                                                            className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-300 shadow-sm"
                                                        >
                                                            <ChevronRight className="w-6 h-6" />
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-8 border-t border-zinc-50">
                                                    <div className="flex items-center gap-5">
                                                        <div className="flex -space-x-5">
                                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                            {order.items.slice(0, 3).map((item: any) => (
                                                                <div
                                                                    key={item.id}
                                                                    className="w-16 h-16 bg-white border-2 border-[#FBFBFB] rounded-[1.2rem] p-2 overflow-hidden shadow-sm transition-transform hover:translate-y-[-4px] hover:z-10"
                                                                >
                                                                    {item.product.imageUrl && (
                                                                        // eslint-disable-next-line @next/next/no-img-element
                                                                        <img
                                                                            src={item.product.imageUrl}
                                                                            alt={item.product.name}
                                                                            className="w-full h-full object-contain"
                                                                        />
                                                                    )}
                                                                </div>
                                                            ))}
                                                            {order.items.length > 3 && (
                                                                <div className="w-16 h-16 bg-zinc-50 border-2 border-[#FBFBFB] rounded-[1.2rem] flex items-center justify-center text-[10px] font-bold text-zinc-500 shadow-sm">
                                                                    +{order.items.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-bold text-zinc-900">
                                                                {order.items.length === 1 ? order.items[0].product.name : `${order.items[0].product.name} e mais ${order.items.length - 1} itens`}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                                                                <Truck className="w-3.5 h-3.5" />
                                                                <span>{order.shippingMethod || 'Logística Padrão'}</span>
                                                                <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
                                                                <span>{order.address?.city}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                                        <OrderActions order={order} />
                                                        {order.status === 'pending' && (
                                                            <Link 
                                                                href={`/order-success?orderId=${order.id}`}
                                                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 h-14 rounded-2xl font-bold transition-all shadow-md shadow-indigo-100 active:scale-[0.98]"
                                                            >
                                                                <CreditCard className="w-4 h-4" />
                                                                Pagar Agora
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </FadeIn>
            </main>
            <Footer />
        </div>
    );
}


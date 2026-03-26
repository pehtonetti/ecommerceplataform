import { getOrderDetails } from "@/backend/actions/order-actions";
import { Header } from "@/frontend/components/Header";
import { Footer } from "@/frontend/components/Footer";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { CheckCircle, Package, MapPin, CreditCard, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PixPayment } from "@/frontend/components/checkout/PixPayment";

interface PageProps {
    searchParams: Promise<{ orderId?: string; session_id?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const orderId = params.orderId;

    if (!orderId) {
        notFound();
    }

    const result = await getOrderDetails(orderId);

    if (result.error || !result.order) {
        notFound();
    }

    const { order } = result;

    return (
        <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col relative overflow-hidden">
             {/* Subtle Luxury Aurora Background (Light) */}
             <div className="fixed inset-0 z-[-1]">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-50/50 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-50/50 blur-[150px] rounded-full"></div>
            </div>

            <Header />

            <main className="flex-1 container mx-auto px-4 pt-32 pb-20 relative z-10">
                <FadeIn className="max-w-4xl mx-auto">
                    {/* Success Header */}
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-100 shadow-sm">
                            <CheckCircle className="w-12 h-12 text-indigo-600" />
                        </div>
                        <h1 className="text-4xl font-bold mb-3 tracking-tight text-zinc-900">
                            {order.status === 'paid' ? 'Pedido Confirmado' : 'Pedido Realizado'}
                        </h1>
                        <p className="text-zinc-500 text-lg max-w-md mx-auto">
                            {order.status === 'paid'
                                ? 'Seu pagamento foi aprovado. Em breve você receberá as atualizações de envio.'
                                : 'Quase lá! Finalize o pagamento via PIX para darmos andamento ao seu pedido.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Main Content (Order Data) */}
                        <div className="lg:col-span-12 space-y-6">
                            
                            {/* PIX AREA - HIGHLIGHTED */}
                            {order.status === 'pending' && (
                                <div className="bg-white/40 backdrop-blur-3xl border border-white rounded-[2.5rem] p-1 shadow-[0_8px_32px_rgba(0,0,0,0.04)] mb-8 overflow-hidden group">
                                    <div className="relative bg-white/60 rounded-[2.4rem] p-8 md:p-12">
                                        <PixPayment orderId={order.id} amount={order.total} />
                                    </div>
                                </div>
                            )}

                            {/* Order Quick Summary Card */}
                            <div className="bg-white/70 backdrop-blur-2xl border border-white p-8 rounded-[2rem] shadow-sm grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Número</p>
                                    <p className="font-mono text-lg font-medium text-zinc-900 tracking-widest">#{order.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Total</p>
                                    <p className="text-xl font-bold text-zinc-900">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                            .format(order.total / 100)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${order.status === 'paid' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'}`}></div>
                                        <p className={`text-sm font-bold ${order.status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                                            {order.status === 'paid' ? 'Pago' : 'Aguardando Pagamento'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Entrega</p>
                                    <p className="text-sm font-semibold text-zinc-900">{order.shippingDays} dias úteis</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Items Section */}
                                <div className="bg-white/70 backdrop-blur-2xl border border-white p-6 rounded-[2rem] shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-5 h-5 text-indigo-600" />
                                            <h2 className="font-bold text-zinc-900 uppercase tracking-wider text-xs">Itens do Pedido</h2>
                                        </div>
                                        <span className="text-zinc-400 text-[10px] font-bold bg-zinc-50 px-2 py-1 rounded-full uppercase tracking-tighter">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</span>
                                    </div>
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-100">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex gap-4 p-3 rounded-2xl hover:bg-zinc-50 transition-colors border border-transparent">
                                                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-zinc-100 p-1">
                                                    {item.product.imageUrl && (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={item.product.imageUrl}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                                    <p className="font-bold text-zinc-900 text-sm truncate">{item.product.name}</p>
                                                    <p className="text-[10px] text-zinc-400 mt-1 font-medium">Quantidade: {item.quantity}</p>
                                                    <p className="font-bold text-indigo-600 mt-2 text-sm">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                                            .format((item.price * item.quantity) / 100)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery & Security Info */}
                                <div className="space-y-6">
                                    {/* Shipping Address */}
                                    {order.address && (
                                        <div className="bg-white/70 backdrop-blur-2xl border border-white p-6 rounded-[2rem] shadow-sm h-full">
                                            <div className="flex items-center gap-2 mb-6">
                                                <MapPin className="w-5 h-5 text-indigo-600" />
                                                <h2 className="font-bold text-zinc-900 uppercase tracking-wider text-xs">Endereço de Entrega</h2>
                                            </div>
                                            <div className="text-zinc-500 text-sm space-y-2 leading-relaxed font-medium">
                                                <p className="font-bold text-zinc-900">{order.address.street}, {order.address.number}</p>
                                                {order.address.complement && <p className="bg-zinc-50 p-2 rounded-lg inline-block text-xs">{order.address.complement}</p>}
                                                <p>{order.address.neighborhood}</p>
                                                <p>{order.address.city} - {order.address.state}</p>
                                                <p className="font-mono text-zinc-400 text-xs">CEP {order.address.zipCode}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Security Shield */}
                                    <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-[2rem] flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-indigo-50 flex items-center justify-center shrink-0 shadow-sm">
                                            <ShieldCheck className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-zinc-900 text-sm">Compra Protegida Simplify</p>
                                            <p className="text-zinc-500 text-xs mt-1 font-medium">Sua transação é monitorada e segura.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href="/orders"
                                    className="flex-1 inline-flex items-center justify-center h-14 px-8 rounded-2xl font-bold bg-zinc-900 text-white hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg shadow-zinc-200"
                                >
                                    Ver Meus Pedidos
                                </Link>
                                <Link
                                    href="/"
                                    className="flex-1 inline-flex items-center justify-center h-14 px-8 rounded-2xl font-bold bg-white border border-zinc-100 text-zinc-900 hover:bg-zinc-50 transition-all active:scale-[0.98]"
                                >
                                    Continuar Comprando
                                </Link>
                            </div>

                            {/* Need Help? */}
                            <div className="text-center pt-8">
                                <Link href="/support" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-indigo-600 transition-colors">
                                    <HelpCircle className="w-4 h-4" />
                                    Precisa de ajuda com este pedido?
                                </Link>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </main>

            <Footer />
        </div>
    );
}

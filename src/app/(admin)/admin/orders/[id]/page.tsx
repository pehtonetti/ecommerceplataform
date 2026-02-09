import { getOrderDetails } from "@/backend/actions/order-actions";
import { Header } from "@/frontend/components/Header";
import { Footer } from "@/frontend/components/Footer";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { Package, MapPin, Truck, DollarSign, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminOrderActions } from "@/frontend/components/admin/AdminOrderActions";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
    const { id } = await params;

    const result = await getOrderDetails(id);

    if (result.error || !result.order) {
        notFound();
    }

    const { order } = result;

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        delivered: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    const statusLabels = {
        pending: 'Aguardando Pagamento',
        paid: 'Pago',
        shipped: 'Enviado',
        delivered: 'Entregue',
        cancelled: 'Cancelado',
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
                <FadeIn>
                    <div className="max-w-5xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <Link
                                href="/admin/orders"
                                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold">Pedido #{order.id.slice(0, 8).toUpperCase()}</h1>
                                <p className="text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Coluna Principal */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Status */}
                                <div className="glass rounded-xl border border-border p-6">
                                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-primary" />
                                        Status do Pedido
                                    </h2>
                                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                                        {statusLabels[order.status as keyof typeof statusLabels]}
                                    </span>
                                </div>

                                {/* Produtos */}
                                <div className="glass rounded-xl border border-border p-6">
                                    <h2 className="font-semibold mb-4">Produtos</h2>
                                    <div className="space-y-4">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                                                <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                                                    {item.product.imageUrl && (
                                                        /* eslint-disable-next-line @next/next/no-img-element */
                                                        <img
                                                            src={item.product.imageUrl}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.product.name}</p>
                                                    <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Preço unitário: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price / 100)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((item.price * item.quantity) / 100)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Endereço de Entrega */}
                                {order.address && (
                                    <div className="glass rounded-xl border border-border p-6">
                                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            Endereço de Entrega
                                        </h2>
                                        <div className="text-sm space-y-1">
                                            <p className="font-medium">{order.user.name}</p>
                                            <p>{order.address.street}, {order.address.number}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Coluna Lateral */}
                            <div className="space-y-6">
                                {/* Ações Administrativas */}
                                <AdminOrderActions
                                    orderId={order.id}
                                    invoices={order.invoices || []}
                                    orderStatus={order.status}
                                />

                                {/* Resumo Financeiro */}
                                <div className="glass rounded-xl border border-border p-6">
                                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-primary" />
                                        Resumo Financeiro
                                    </h2>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.subtotal / 100)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Frete</span>
                                            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((order.shippingCost || 0) / 100)}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-border font-bold text-lg">
                                            <span>Total</span>
                                            <span className="text-primary">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total / 100)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Informações de Envio */}
                                {order.shippingMethod && (
                                    <div className="glass rounded-xl border border-border p-6">
                                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                                            <Truck className="w-5 h-5 text-primary" />
                                            Informações de Envio
                                        </h2>
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Método</p>
                                                <p className="font-medium">{order.shippingMethod}</p>
                                            </div>
                                            {order.shippingDays && (
                                                <div>
                                                    <p className="text-muted-foreground">Prazo</p>
                                                    <p className="font-medium">{order.shippingDays} dias úteis</p>
                                                </div>
                                            )}
                                            {order.trackingCode && (
                                                <div>
                                                    <p className="text-muted-foreground">Código de Rastreio</p>
                                                    <p className="font-mono text-xs bg-gray-100 dark:bg-zinc-800 p-2 rounded">{order.trackingCode}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Cliente */}
                                <div className="glass rounded-xl border border-border p-6">
                                    <h2 className="font-semibold mb-4">Cliente</h2>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Nome</p>
                                            <p className="font-medium">{order.user.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">E-mail</p>
                                            <p className="font-medium">{order.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </main>

            <Footer />
        </div >
    );
}

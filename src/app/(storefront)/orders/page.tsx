import { getUserOrders } from "@/backend/actions/order-actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { Package, ChevronRight, Truck } from "lucide-react";
import Link from "next/link";
import { OrderActions } from "./OrderActions";

export default async function OrdersPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login?redirect=/orders');
    }

    const result = await getUserOrders(user.id);
    const orders = result.orders || [];

    return (
        <div className="min-h-full font-sans flex flex-col">
            <main className="flex-1 container mx-auto px-4 pt-8 pb-20">
                <FadeIn>
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
                        <p className="text-muted-foreground mb-8">
                            Acompanhe o status de todos os seus pedidos
                        </p>

                        {orders.length === 0 ? (
                            <div className="text-center py-20 glass rounded-xl border border-border">
                                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground mb-4">Você ainda não fez nenhum pedido</p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 text-primary hover:underline"
                                >
                                    Começar a Comprar
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order: any) => (
                                    <div
                                        key={order.id}
                                        className="glass rounded-xl border border-border p-6 hover:border-primary transition-colors"
                                    >
                                        <Link href={`/order-success?orderId=${order.id}`} className="block">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <p className="font-mono text-sm text-muted-foreground">
                                                        Pedido #{order.id.slice(0, 8).toUpperCase()}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                                            .format(order.total / 100)}
                                                    </p>
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                        order.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                                        }`}>
                                                        {order.status === 'pending' ? 'Aguardando Pagamento' :
                                                            order.status === 'paid' ? 'Pago' :
                                                                order.status === 'shipped' ? 'Enviado' :
                                                                    order.status === 'delivered' ? 'Entregue' : 'Cancelado'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Truck className="w-4 h-4" />
                                                    <span>{order.shippingMethod || 'N/A'}</span>
                                                </div>
                                                {order.address && (
                                                    <span>
                                                        {order.address.city} - {order.address.state}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {order.items.slice(0, 4).map((item: any) => (
                                                    <div
                                                        key={item.id}
                                                        className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0"
                                                    >
                                                        {item.product.imageUrl && (
                                                            <img
                                                                src={item.product.imageUrl}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                                {order.items.length > 4 && (
                                                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <span className="text-xs font-medium">+{order.items.length - 4}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        {/* Actions integrated here */}
                                        <OrderActions order={order} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </FadeIn>
            </main>
        </div>
    );
}

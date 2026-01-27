import { getOrderDetails } from "@/backend/actions/order-actions";
import { createPaymentSession } from "@/backend/actions/payment-actions";
import { Header } from "@/frontend/components/Header";
import { Footer } from "@/frontend/components/Footer";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { CheckCircle, Package, MapPin, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface PageProps {
    searchParams: Promise<{ orderId?: string; session_id?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const orderId = params.orderId;
    const sessionId = params.session_id;

    if (!orderId) {
        notFound();
    }

    const result = await getOrderDetails(orderId);

    if (result.error || !result.order) {
        notFound();
    }

    const { order } = result;

    // Se não tem session_id, criar sessão de pagamento
    if (!sessionId && order.status === 'pending') {
        const paymentResult = await createPaymentSession(orderId);

        if (paymentResult.sessionUrl) {
            redirect(paymentResult.sessionUrl);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
                <FadeIn className="max-w-3xl mx-auto">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">
                            {order.status === 'paid' ? 'Pagamento Confirmado!' : 'Pedido Criado!'}
                        </h1>
                        <p className="text-muted-foreground">
                            {order.status === 'paid'
                                ? 'Seu pagamento foi processado com sucesso.'
                                : 'Complete o pagamento para confirmar seu pedido.'}
                        </p>
                    </div>

                    {/* Payment Status */}
                    {order.status === 'pending' && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-6">
                            <div className="flex items-start gap-4">
                                <CreditCard className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                                        Aguardando Pagamento
                                    </h3>
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-4">
                                        Você será redirecionado para a página de pagamento. Se não for redirecionado automaticamente, clique no botão abaixo.
                                    </p>
                                    <form action={async () => {
                                        'use server'
                                        const paymentResult = await createPaymentSession(orderId);
                                        if (paymentResult.sessionUrl) {
                                            redirect(paymentResult.sessionUrl);
                                        }
                                    }}>
                                        <button
                                            type="submit"
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                                        >
                                            Pagar Agora
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Info */}
                    <div className="glass rounded-xl border border-border p-6 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Número do Pedido</p>
                                <p className="font-mono font-semibold">#{order.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Total</p>
                                <p className="font-semibold">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                        .format(order.total / 100)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Status</p>
                                <p className={`font-semibold ${order.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {order.status === 'paid' ? 'Pago' : 'Aguardando Pagamento'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Prazo de Entrega</p>
                                <p className="font-semibold">{order.shippingDays} dias úteis</p>
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="glass rounded-xl border border-border p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-primary" />
                            <h2 className="font-semibold">Itens do Pedido</h2>
                        </div>
                        <div className="space-y-3">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex gap-4 pb-3 border-b border-border last:border-0">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.product.imageUrl && (
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
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                                .format((item.price * item.quantity) / 100)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.address && (
                        <div className="glass rounded-xl border border-border p-6 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-primary" />
                                <h2 className="font-semibold">Endereço de Entrega</h2>
                            </div>
                            <div className="text-sm">
                                <p>{order.address.street}, {order.address.number}</p>
                                {order.address.complement && <p>{order.address.complement}</p>}
                                <p>{order.address.neighborhood}</p>
                                <p>{order.address.city} - {order.address.state}</p>
                                <p>CEP: {order.address.zipCode}</p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/orders"
                            className="flex-1 inline-flex items-center justify-center h-11 px-8 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25 transition-all"
                        >
                            Ver Meus Pedidos
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 inline-flex items-center justify-center h-11 px-8 rounded-lg font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all"
                        >
                            Continuar Comprando
                        </Link>
                    </div>

                    {/* Info */}
                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                            <strong>Próximos passos:</strong> {order.status === 'paid'
                                ? 'Iniciaremos a preparação do seu pedido. Você receberá um e-mail quando ele for enviado.'
                                : 'Complete o pagamento para confirmarmos seu pedido. Você receberá um e-mail com as instruções.'}
                        </p>
                    </div>
                </FadeIn>
            </main>

            <Footer />
        </div>
    );
}

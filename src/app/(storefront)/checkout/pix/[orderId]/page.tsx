import { PixPayment } from "@/frontend/components/checkout/PixPayment";
import { getOrderDetails } from "@/backend/actions/order-actions";
import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function PixPaymentPage({ params }: PageProps) {
    const { orderId } = await params;

    // Busca detalhes do pedido
    const result = await getOrderDetails(orderId);

    if (result.error || !result.order) {
        redirect('/cart');
    }

    const { order } = result;

    // Verifica se o pedido já foi pago
    if (order.status === 'paid' || order.status === 'processing') {
        redirect(`/checkout/success/${orderId}`);
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans pb-20">
            <main className="container mx-auto px-4 pt-32">
                <PixPayment orderId={orderId} amount={order.total} />
            </main>
        </div>
    );
}

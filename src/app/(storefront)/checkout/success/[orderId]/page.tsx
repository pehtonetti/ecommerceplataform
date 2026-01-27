import { SuccessContent } from "./SuccessContent";

interface PageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function CheckoutSuccessPage({ params }: PageProps) {
    const { orderId } = await params;

    return <SuccessContent orderId={orderId} />;
}

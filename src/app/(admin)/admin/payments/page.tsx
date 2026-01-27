import { FadeIn } from "@/frontend/components/ui/Motion";
import { PaymentGateways } from "./PaymentGateways";

export default function PaymentsPage() {
    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
                        <p className="text-muted-foreground">Gerencie transações e gateways de pagamento.</p>
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                <PaymentGateways />
            </FadeIn>
        </div>
    );
}

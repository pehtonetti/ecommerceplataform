
import { FadeIn } from '@/frontend/components/ui/Motion';

export default function ShippingPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <FadeIn>
                <h1 className="text-3xl font-bold mb-8">Política de Envio</h1>
                <div className="glass p-8 rounded-xl opacity-90">
                    <p className="mb-4">
                        Enviamos para todo o Brasil. O prazo de postagem é de até 2 dias úteis após a confirmação do pagamento.
                    </p>
                    <p>
                        Você receberá o código de rastreamento por e-mail assim que seu pedido for despachado.
                    </p>
                </div>
            </FadeIn>
        </div>
    );
}


import { FadeIn } from '@/frontend/components/ui/Motion';

export default function FAQPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <FadeIn>
                <h1 className="text-3xl font-bold mb-8">Perguntas Frequentes</h1>
                <div className="space-y-6">
                    <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-bold mb-2">Qual o prazo de entrega?</h3>
                        <p className="text-muted-foreground">O prazo depende da sua região e é calculado no checkout.</p>
                    </div>
                    <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-bold mb-2">Quais as formas de pagamento?</h3>
                        <p className="text-muted-foreground">Aceitamos Cartão de Crédito, PIX e Boleto.</p>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}

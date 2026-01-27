
import { FadeIn } from '@/frontend/components/ui/Motion';

export default function ReturnsPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <FadeIn>
                <h1 className="text-3xl font-bold mb-8">Trocas e Devoluções</h1>
                <div className="glass p-8 rounded-xl opacity-90">
                    <p className="mb-4">
                        Você tem 7 dias corridos após o recebimento para solicitar a devolução por arrependimento.
                    </p>
                    <p>
                        Para trocas por defeito, o prazo é de 30 dias. Entre em contato conosco via chat ou e-mail.
                    </p>
                </div>
            </FadeIn>
        </div>
    );
}

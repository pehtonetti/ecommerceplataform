import { FadeIn } from "@/frontend/components/ui/Motion";
import { ContactForm } from "@/frontend/components/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-white dark:bg-black font-sans flex flex-col min-h-full">
            <main className="flex-1 container mx-auto px-4 pt-8 pb-20">
                <FadeIn className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
                        <p className="text-muted-foreground text-lg">
                            Estamos aqui para ajudar! Envie sua mensagem e responderemos em breve.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="glass rounded-xl border border-border p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">E-mail</h3>
                                        <p className="text-sm text-muted-foreground">contato@lojatechpremium.com.br</p>
                                        <p className="text-sm text-muted-foreground">suporte@lojatechpremium.com.br</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass rounded-xl border border-border p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Telefone</h3>
                                        <p className="text-sm text-muted-foreground">(11) 1234-5678</p>
                                        <p className="text-sm text-muted-foreground">WhatsApp: (11) 98765-4321</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass rounded-xl border border-border p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Endereço</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Av. Paulista, 1000<br />
                                            Bela Vista, São Paulo - SP<br />
                                            CEP: 01310-100
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass rounded-xl border border-border p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Horário de Atendimento</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Segunda a Sexta: 9h às 18h<br />
                                            Sábado: 9h às 13h<br />
                                            Domingo: Fechado
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="glass rounded-xl border border-border p-8">
                                <h2 className="text-2xl font-bold mb-6">Envie sua Mensagem</h2>
                                <ContactForm />
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-center mb-8">Perguntas Frequentes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass rounded-xl border border-border p-6">
                                <h3 className="font-semibold mb-2">Qual o prazo de entrega?</h3>
                                <p className="text-sm text-muted-foreground">
                                    O prazo varia de acordo com sua localização e o método de envio escolhido. Você pode calcular o frete no checkout.
                                </p>
                            </div>

                            <div className="glass rounded-xl border border-border p-6">
                                <h3 className="font-semibold mb-2">Como rastrear meu pedido?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Após o envio, você receberá um código de rastreamento por e-mail. Você também pode acompanhar em &quot;Meus Pedidos&quot;.
                                </p>
                            </div>

                            <div className="glass rounded-xl border border-border p-6">
                                <h3 className="font-semibold mb-2">Posso trocar ou devolver?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Sim! Você tem 7 dias para devolver produtos conforme o Código de Defesa do Consumidor.
                                </p>
                            </div>

                            <div className="glass rounded-xl border border-border p-6">
                                <h3 className="font-semibold mb-2">Quais formas de pagamento aceitam?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Aceitamos cartões de crédito e débito via Stripe. Em breve: PIX e boleto bancário.
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </main>
        </div>
    );
}

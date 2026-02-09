import { Header } from "@/frontend/components/Header";
import { Footer } from "@/frontend/components/Footer";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { FileText } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
                <FadeIn className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Termos de Uso</h1>
                            <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
                        </div>
                    </div>

                    <div className="glass rounded-xl border border-border p-8 space-y-6">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">1. Aceitação dos Termos</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Ao acessar e usar a Loja Tech Premium, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá usar nosso site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">2. Uso do Site</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                Você concorda em usar este site apenas para fins legais e de maneira que não infrinja os direitos de terceiros ou restrinja ou iniba o uso e aproveitamento deste site por qualquer outra pessoa.
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>Não usar o site para atividades ilegais ou fraudulentas</li>
                                <li>Não tentar obter acesso não autorizado ao site ou sistemas relacionados</li>
                                <li>Não transmitir vírus, malware ou qualquer código malicioso</li>
                                <li>Respeitar os direitos de propriedade intelectual</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">3. Produtos e Serviços</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Todos os produtos estão sujeitos à disponibilidade. Reservamo-nos o direito de limitar as quantidades de qualquer produto que oferecemos. Todas as descrições de produtos ou preços de produtos estão sujeitos a alterações a qualquer momento sem aviso prévio.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">4. Preços e Pagamento</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                Todos os preços estão em Reais (BRL) e incluem impostos aplicáveis. Reservamo-nos o direito de modificar os preços a qualquer momento. Os métodos de pagamento aceitos incluem:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>Cartões de crédito (via Stripe)</li>
                                <li>Cartões de débito</li>
                                <li>PIX (em breve)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">5. Envio e Entrega</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Os prazos de entrega são estimativas e podem variar. Não nos responsabilizamos por atrasos causados por transportadoras ou eventos fora de nosso controle. O risco de perda e o título de propriedade dos produtos passam para você após a entrega à transportadora.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">6. Política de Devolução</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Você tem o direito de devolver produtos dentro de 7 dias após o recebimento, conforme o Código de Defesa do Consumidor. Os produtos devem estar em sua embalagem original e em perfeitas condições. O reembolso será processado dentro de 10 dias úteis após recebermos o produto devolvido.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">7. Propriedade Intelectual</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Todo o conteúdo deste site, incluindo textos, gráficos, logos, ícones, imagens e software, é propriedade da Loja Tech Premium e está protegido por leis de direitos autorais. Você não pode reproduzir, distribuir ou criar trabalhos derivados sem nossa permissão expressa por escrito.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">8. Limitação de Responsabilidade</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Não seremos responsáveis por quaisquer danos indiretos, incidentais, especiais ou consequenciais resultantes do uso ou incapacidade de usar nosso site ou produtos, mesmo que tenhamos sido avisados da possibilidade de tais danos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">9. Modificações dos Termos</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no site. É sua responsabilidade revisar periodicamente estes termos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">10. Lei Aplicável</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Estes termos serão regidos e interpretados de acordo com as leis do Brasil. Qualquer disputa relacionada a estes termos estará sujeita à jurisdição exclusiva dos tribunais brasileiros.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">11. Contato</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através da nossa página de contato ou pelo e-mail: contato@lojatechpremium.com.br
                            </p>
                        </section>
                    </div>
                </FadeIn>
            </main>

            <Footer />
        </div>
    );
}

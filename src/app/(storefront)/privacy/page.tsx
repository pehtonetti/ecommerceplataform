import { Header } from "@/frontend/components/Header";
import { Footer } from "@/frontend/components/Footer";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { Shield, Lock, Eye, Database, UserX } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
                <FadeIn className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Política de Privacidade</h1>
                            <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
                        </div>
                    </div>

                    <div className="glass rounded-xl border border-border p-8 space-y-6">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">1. Introdução</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                A Loja Tech Premium está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) e outras legislações aplicáveis.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Database className="w-5 h-5 text-primary" />
                                <h2 className="text-2xl font-bold">2. Informações que Coletamos</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                Coletamos as seguintes categorias de informações:
                            </p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex gap-2">
                                    <span className="font-semibold min-w-[150px]">Dados de Cadastro:</span>
                                    <span>Nome, e-mail, CPF, telefone, data de nascimento</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-semibold min-w-[150px]">Endereço:</span>
                                    <span>CEP, rua, número, complemento, bairro, cidade, estado</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-semibold min-w-[150px]">Pagamento:</span>
                                    <span>Dados de cartão (processados via Stripe - não armazenamos)</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-semibold min-w-[150px]">Navegação:</span>
                                    <span>IP, cookies, páginas visitadas, tempo de permanência</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-semibold min-w-[150px]">Pedidos:</span>
                                    <span>Histórico de compras, produtos visualizados, carrinho</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Eye className="w-5 h-5 text-primary" />
                                <h2 className="text-2xl font-bold">3. Como Usamos suas Informações</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                Utilizamos suas informações para:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>Processar e entregar seus pedidos</li>
                                <li>Enviar confirmações e atualizações sobre pedidos</li>
                                <li>Processar pagamentos de forma segura</li>
                                <li>Melhorar nossos produtos e serviços</li>
                                <li>Personalizar sua experiência de compra</li>
                                <li>Enviar comunicações de marketing (com seu consentimento)</li>
                                <li>Prevenir fraudes e garantir a segurança</li>
                                <li>Cumprir obrigações legais e regulatórias</li>
                            </ul>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Lock className="w-5 h-5 text-primary" />
                                <h2 className="text-2xl font-bold">4. Compartilhamento de Dados</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                Podemos compartilhar suas informações com:
                            </p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li>
                                    <strong>Processadores de Pagamento:</strong> Stripe (para processar transações)
                                </li>
                                <li>
                                    <strong>Transportadoras:</strong> Para entrega de produtos
                                </li>
                                <li>
                                    <strong>Provedores de E-mail:</strong> SendGrid (para envio de e-mails transacionais)
                                </li>
                                <li>
                                    <strong>Autoridades:</strong> Quando exigido por lei
                                </li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed mt-3">
                                <strong>Não vendemos</strong> suas informações pessoais a terceiros.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">5. Cookies e Tecnologias Similares</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                Utilizamos cookies para:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>Manter você conectado</li>
                                <li>Lembrar suas preferências (tema, idioma)</li>
                                <li>Analisar o uso do site</li>
                                <li>Personalizar conteúdo e anúncios</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed mt-3">
                                Você pode gerenciar cookies através das configurações do seu navegador.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <UserX className="w-5 h-5 text-primary" />
                                <h2 className="text-2xl font-bold">6. Seus Direitos (LGPD)</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                De acordo com a LGPD, você tem o direito de:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li><strong>Confirmação:</strong> Saber se tratamos seus dados</li>
                                <li><strong>Acesso:</strong> Solicitar cópia dos seus dados</li>
                                <li><strong>Correção:</strong> Corrigir dados incompletos ou desatualizados</li>
                                <li><strong>Anonimização:</strong> Solicitar anonimização dos dados</li>
                                <li><strong>Eliminação:</strong> Solicitar exclusão de dados desnecessários</li>
                                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                                <li><strong>Revogação:</strong> Revogar consentimento a qualquer momento</li>
                                <li><strong>Oposição:</strong> Opor-se ao tratamento de dados</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed mt-3">
                                Para exercer seus direitos, entre em contato através de: <strong>privacidade@lojatechpremium.com.br</strong>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">7. Segurança dos Dados</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Implementamos medidas técnicas e organizacionais para proteger suas informações, incluindo:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-3">
                                <li>Criptografia de dados sensíveis (SSL/TLS)</li>
                                <li>Senhas criptografadas com bcrypt</li>
                                <li>Acesso restrito a dados pessoais</li>
                                <li>Monitoramento de segurança contínuo</li>
                                <li>Backups regulares</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">8. Retenção de Dados</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Mantemos suas informações pelo tempo necessário para cumprir as finalidades descritas nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei. Após esse período, os dados serão anonimizados ou excluídos de forma segura.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">9. Menores de Idade</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Nosso site não é direcionado a menores de 18 anos. Não coletamos intencionalmente informações de menores sem o consentimento dos pais ou responsáveis legais.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">10. Alterações nesta Política</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas por e-mail ou através de um aviso em nosso site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">11. Contato</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Para questões sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais, entre em contato com nosso Encarregado de Proteção de Dados (DPO):
                            </p>
                            <div className="mt-3 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                <p className="text-sm"><strong>E-mail:</strong> privacidade@lojatechpremium.com.br</p>
                                <p className="text-sm"><strong>Telefone:</strong> (11) 1234-5678</p>
                            </div>
                        </section>
                    </div>
                </FadeIn>
            </main>

            <Footer />
        </div>
    );
}

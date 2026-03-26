import { Header } from "@/frontend/components/Header";
import { Footer } from "@/frontend/components/Footer";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { Shield, Lock, Eye, Database, UserX } from "lucide-react";

export default function PrivacyPage() {
    return (
                <div className="min-h-screen bg-[#FBFBFB] dark:bg-black font-sans flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
                <FadeIn className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 bg-blue-500/5 rounded-2xl flex items-center justify-center border border-blue-500/10 shadow-sm">
                            <Shield className="w-7 h-7 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">Privacidade & Transparência</h1>
                            <p className="text-zinc-500 mt-1">Sua segurança é nossa prioridade absoluta.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-xl shadow-zinc-200/40 p-10 md:p-16 space-y-12 text-zinc-800">
                        <section>
                            <div className="text-sm font-medium text-blue-600 mb-2 uppercase tracking-widest">Compromisso LGPD</div>
                            <h2 className="text-2xl font-semibold mb-6 text-zinc-900">1. Introdução</h2>
                            <p className="leading-relaxed text-zinc-600 text-lg">
                                A **Simplify Tech** está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais em conformidade com a **Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)**.
                            </p>
                        </section>

                        <section className="bg-zinc-50/50 rounded-2xl p-8 border border-zinc-100">
                            <div className="flex items-center gap-3 mb-6">
                                <Database className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-semibold text-zinc-900">2. Dados que Coletamos</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <ul className="space-y-4 text-zinc-600">
                                    <li className="flex flex-col">
                                        <span className="font-semibold text-zinc-900">Dados de Cadastro</span>
                                        <span className="text-sm">Nome completo, E-mail, CPF e Telefone.</span>
                                    </li>
                                    <li className="flex flex-col">
                                        <span className="font-semibold text-zinc-900">Logística de Entrega</span>
                                        <span className="text-sm">Endereço completo para remessa de produtos.</span>
                                    </li>
                                </ul>
                                <ul className="space-y-4 text-zinc-600">
                                    <li className="flex flex-col">
                                        <span className="font-semibold text-zinc-900">Dados Financeiros</span>
                                        <span className="text-sm">Processado via gateways seguros (não armazenamos dados de cartão).</span>
                                    </li>
                                    <li className="flex flex-col">
                                        <span className="font-semibold text-zinc-900">Navegação Técnica</span>
                                        <span className="text-sm">IP, cookies essenciais e histórico de navegação interna.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* ... Rest of sections refined ... */}
                        
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <UserX className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-semibold text-zinc-900">3. Seus Direitos Fundamentais</h2>
                            </div>
                            <p className="text-zinc-600 mb-6 italic border-l-2 border-blue-500 pl-4">
                                Você possui controle total sobre seus dados. A qualquer momento, você pode solicitar:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
                                {[
                                    'Acesso completo aos dados',
                                    'Correção de dados imprecisos',
                                    'Exclusão definitiva da conta',
                                    'Portabilidade de informações',
                                    'Revogação de consentimento',
                                    'Informação sobre compartilhamento'
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-2 p-3 bg-white border border-zinc-100 rounded-xl shadow-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="pt-10 border-t border-zinc-100">
                            <h2 className="text-2xl font-semibold mb-6 text-zinc-900">4. Contato Encarregado (DPO)</h2>
                            <p className="text-zinc-600 leading-relaxed mb-6">
                                Para exercer qualquer um de seus direitos ou tirar dúvidas sobre nossa governança de dados, entre em contato com nosso DPO oficial:
                            </p>
                            <div className="bg-zinc-900 text-white rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <p className="text-zinc-400 text-sm mb-1 uppercase tracking-wider">Canal Direto</p>
                                    <p className="text-xl font-medium">privacidade@simplifytech.eu</p>
                                </div>
                                <div className="h-px w-10 bg-zinc-700 hidden md:block" />
                                <div className="text-center md:text-right">
                                    <p className="text-zinc-400 text-sm mb-1 uppercase tracking-wider">Atendimento</p>
                                    <p className="text-xl font-medium">Segunda a Sexta, 09h às 18h</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-zinc-400 text-sm">
                            Última atualização: {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date())}
                        </p>
                    </div>
                </FadeIn>
            </main>

            <Footer />
        </div>
    );
}

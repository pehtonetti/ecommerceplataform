import { Header } from "@/frontend/components/Header";
import { Footer } from "@/frontend/components/Footer";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { FileText } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#FBFBFB] dark:bg-black font-sans flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
                <FadeIn className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 bg-blue-500/5 rounded-2xl flex items-center justify-center border border-blue-500/10 shadow-sm">
                            <FileText className="w-7 h-7 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">Termos & Condições de Uso</h1>
                            <p className="text-zinc-500 mt-1">Regras de uso e transparência Simplify Tech.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] border border-zinc-200/60 shadow-xl shadow-zinc-200/40 p-10 md:p-16 space-y-12 text-zinc-800">
                        <section>
                            <h2 className="text-2xl font-semibold mb-6 text-zinc-900">1. Aceitação dos Termos</h2>
                            <p className="leading-relaxed text-zinc-600">
                                Ao acessar e usar a **Simplify Tech**, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá usar nosso site.
                            </p>
                        </section>

                        <section className="bg-zinc-50/50 rounded-2xl p-8 border border-zinc-100">
                            <h2 className="text-2xl font-semibold mb-6 text-zinc-900">2. Uso do Site</h2>
                            <p className="text-zinc-600 leading-relaxed mb-4">
                                Você concorda em usar este site apenas para fins legais e de maneira que não infrinja os direitos de terceiros ou restrinja o uso por qualquer outra pessoa.
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-500">
                                <li className="flex items-center gap-2">• Proibido uso para fins fraudulentos</li>
                                <li className="flex items-center gap-2">• Proibido tentativa de acesso forçado</li>
                                <li className="flex items-center gap-2">• Proibido distribuir malware</li>
                                <li className="flex items-center gap-2">• Respeito à propriedade intelectual</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-6 text-zinc-900">3. Produtos e Preços</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                Todos os produtos estão sujeitos à disponibilidade em estoque. Reservamo-nos o direito de limitar as quantidades de qualquer produto que oferecemos. Preços estão em **Reais (BRL)** e incluem todos os impostos incidentes no Brasil.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-6 text-zinc-900">4. Direito de Arrependimento</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                Conforme o **Código de Defesa do Consumidor**, você possui o direito de desistência da compra em até **7 dias corridos** após o recebimento, com reembolso total garantido caso o produto esteja em estado original.
                            </p>
                        </section>

                        <section className="pt-10 border-t border-zinc-100 text-center">
                            <p className="text-zinc-500 mb-6">Dúvidas sobre nossos termos legais?</p>
                            <a href="mailto:suporte@simplifytech.eu" className="inline-flex items-center gap-2 bg-zinc-900 text-white px-8 py-3 rounded-2xl font-medium hover:bg-zinc-800 transition-all">
                                Falar com Suporte Jurídico
                            </a>
                        </section>
                    </div>

                    <div className="mt-8 text-center text-zinc-400 text-sm">
                        Última revisão: {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date())}
                    </div>
                </FadeIn>
            </main>

            <Footer />
        </div>
    );
}

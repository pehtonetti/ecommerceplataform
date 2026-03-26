'use client';

import { useState } from 'react';
import { MessageCircle, HelpCircle, FileText, Clock, X, Send, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function Support() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isTicketFormOpen, setIsTicketFormOpen] = useState(false);
    const [ticketMessage, setTicketMessage] = useState('');
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { sender: 'bot', text: 'Olá! Bem-vindo ao suporte ao vivo. Como posso ajudar você hoje?' }
    ]);

    const [isFAQOpen, setIsFAQOpen] = useState(false);

    const faqs = [
        { q: "Quais são as formas de pagamento aceitas?", a: "Aceitamos cartões de crédito (Visa, Mastercard, Elo, Amex), Pix e Boleto bancário (somente no checkout)." },
        { q: "Qual é o prazo de entrega?", a: "O prazo varia conforme o seu CEP e a modalidade de envio escolhida na finalização da compra. Você pode calcular na página do produto." },
        { q: "Como rastreio meu pedido?", a: "Assim que o pedido for despachado, você receberá o código de rastreio por e-mail e poderá acompanhá-lo na aba detalhada de histórico." },
        { q: "Posso alterar o endereço de entrega após fechar a compra?", a: "Não. Por questões rígidas de segurança e logística automatizada, o endereço não pode ser alterado após o pagamento." },
        { q: "Qual o prazo legal para solicitar devolução?", a: "Você tem até 7 dias corridos após o recebimento do produto físico para acionar o seu Direito Legal de Arrependimento e receber o estorno." },
        { q: "O produto veio com defeito. O que faço?", a: "Na aba 'Abrir Ticket', selecione 'Produto com Defeito' e anexe fotos. Faremos a troca sem nenhum custo adicional." },
        { q: "Como cancelar minha compra rapidamente?", a: "Se o pedido ainda não foi faturado (gerado a Nota Fiscal), você pode pedir o cancelamento. Se já enviou, recuse a entrega na porta." },
        { q: "Em quanto tempo ocorre o estorno no meu cartão de crédito?", a: "Após a liberação pelo nosso departamento, o banco do seu cartão pode levar de 1 a 2 fechamentos de fatura para registrar o crédito compensado." },
        { q: "Vocês possuem endereço e loja física para retirada?", a: "No momento atual operamos suas compras de forma 100% online, garantindo os melhores estoques nacionais com rapidez de envio." },
        { q: "Os produtos vendidos no site são todos originais?", a: "Sim, absolutamente todos os nossos produtos acompanham a Nota Fiscal (XML/PDF) e têm a garantia oficial legal das marcas." },
        { q: "Esqueci de colocar um produto na sacola e já paguei. Tem como adicionar?", a: "Infelizmente o sistema bloqueia modificações de carrinho após fechado. Recomendamos que você realize uma nova compra adicional." },
        { q: "Gerei um boleto, mas perdi a data de vencimento. E agora?", a: "Pedidos com boletos atrasados expiram e o estoque volta para a loja. Basta você entrar e realizar o seu pedido e compra novamente do zero." },
        { q: "Meu pedido no cartão de crédito foi recusado/cancelado de imediato, por quê?", a: "Normalmente, a anti-fraude do seu próprio banco trava operações que fujam de seu padrão financeiro. Ligue no verso de seu cartão para liberar ou pague via Pix instantâneo." },
        { q: "Efetuei o meu PIX e o status ainda consta aguardando. Isso é normal?", a: "Sim, o Pix costuma aprovar instantaneamente, porém é comum que o Banco Central coloque em uma fila secundária, podendo levar de 10 a 60 minutos." },
        { q: "Aonde que eu digito um código para usar e aplicar meu Cupom Promocional?", a: "No seu carrinho de compras, logo acima do fechamento financeiro de valores, haverá um local chamado 'Adicionar Cupom'." },
        { q: "É possível agendar a minha entrega via telefone?", a: "As entregas seguem as rotas criadas de forma automatizada via transportadoras. O sistema te notifica para que tenha alguém em casa." },
        { q: "Vocês entregam via Correios tradicionais ou outras transportadoras?", a: "O carrinho definirá de forma inteligente o frete com os métodos de envios mais rápidos baseados no seu estado da federação, operando desde Sedex a Loggi e Jadlog." },
        { q: "Quero alterar a senha da minha conta, por qual menu ou tela eu prossigo?", a: "Dentro das opções padrão do site, faça 'Sair' de sua conta e pressione a opção 'Esqueci a minha senha' na tela nativa de login de usuários." },
        { q: "Meu status consta como pago, mas mudou para pendência de Separação de Logística. Foi extraviado?", a: "Fique tranquilo! 'Em Separação' simboliza o seu pacote que já está dentro do nosso armazém recebendo reforço na fita da caixa plástica." },
        { q: "A caixa transportada do correio está rasgada. Aceito ou Rejeito?", a: "A instrução formal das agências indica clara RECUSA da compra na porta. Logo em sequência abra o Ticket Oficial documentando." }
    ];

    const handleSendChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;
        setChatHistory([...chatHistory, { sender: 'user', text: chatMessage }]);
        setChatMessage('');
        
        // Simular resposta do atendente
        setTimeout(() => {
            setChatHistory(prev => [...prev, { sender: 'bot', text: 'Nossos atendentes estão em horário de pico, mas já vamos te responder. Aguarde um instante!' }]);
        }, 1500);
    };

    const handleOpenTicket = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketMessage.trim()) return toast.error('Descreva o problema!');
        toast.success('Ticket aberto com sucesso! Nossa equipe técnica analisará.');
        setTicketMessage('');
        setIsTicketFormOpen(false);
    };

    return (
        <div className="space-y-8 relative">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Suporte e Ajuda
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                    onClick={() => { setIsChatOpen(!isChatOpen); setIsTicketFormOpen(false); setIsFAQOpen(false); }}
                    className="glass p-6 text-center border border-white/20 hover:border-blue-500/50 transition-colors cursor-pointer group"
                >
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Chat Online</h3>
                    <p className="text-sm text-gray-500 mt-2">Converse com nossos atendentes em tempo real.</p>
                </div>

                <div 
                    onClick={() => { setIsTicketFormOpen(!isTicketFormOpen); setIsChatOpen(false); setIsFAQOpen(false); }}
                    className="glass p-6 text-center border border-white/20 hover:border-purple-500/50 transition-colors cursor-pointer group"
                >
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Abrir Ticket</h3>
                    <p className="text-sm text-gray-500 mt-2">Para problemas mais complexos ou devoluções.</p>
                </div>

                <div 
                    onClick={() => { setIsFAQOpen(!isFAQOpen); setIsChatOpen(false); setIsTicketFormOpen(false); }}
                    className="glass p-6 text-center border border-white/20 hover:border-orange-500/50 transition-colors cursor-pointer group"
                >
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <HelpCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">FAQ Automático</h3>
                    <p className="text-sm text-gray-500 mt-2">Encontre as soluções das 20 dúvidas mais recorrentes.</p>
                </div>
            </div>

            {/* Simulated Live Chat Modal/Dock */}
            {isChatOpen && (
                <div className="fixed bottom-4 right-4 w-80 bg-white shadow-2xl rounded-t-xl rounded-b-md border border-gray-200 z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
                    <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
                        <span className="font-bold flex items-center gap-2"><MessageCircle className="w-4 h-4"/> Chat de Atendimento</span>
                        <button onClick={() => setIsChatOpen(false)}><X className="w-4 h-4" /></button>
                    </div>
                    <div className="h-64 bg-gray-50 p-4 overflow-y-auto flex flex-col gap-3">
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`max-w-[85%] p-2 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-blue-100 text-blue-900 self-end rounded-tr-none' : 'bg-gray-200 text-gray-800 self-start rounded-tl-none'}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSendChat} className="border-t border-gray-200 p-2 flex bg-white gap-2">
                        <input value={chatMessage} onChange={e => setChatMessage(e.target.value)} type="text" placeholder="Digite aqui..." className="flex-1 bg-transparent text-sm outline-none px-2 text-black" />
                        <button type="submit" className="p-2 bg-blue-600 text-white rounded"><Send className="w-4 h-4"/></button>
                    </form>
                </div>
            )}

            {/* TICKET FORM */}
            {isTicketFormOpen && (
                <div className="glass p-6 border border-white/20 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-xl flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                            Novo Ticket de Suporte Oficial
                        </h3>
                        <button onClick={() => setIsTicketFormOpen(false)} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5"/></button>
                    </div>
                    
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg">
                        <p className="text-sm text-amber-800 flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <strong>Texto Informativo:</strong> Utilize os tickets apenas para resoluções complexas que exijam resposta por e-mail, como cancelamentos definitivos, estornos, envios travados na transportadora ou garantias de longo prazo. O tempo de resposta estimado é de até 48 horas úteis.
                        </p>
                    </div>

                    <form onSubmit={handleOpenTicket} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Motivo / Assunto</label>
                            <select className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-purple-500 bg-white">
                                <option>Atraso na Entrega</option>
                                <option>Produto com Defeito / Garantia</option>
                                <option>Estorno / Cancelamento</option>
                                <option>Erro no Sistema</option>
                                <option>Outros</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Preenchimento do Problema</label>
                            <textarea 
                                value={ticketMessage}
                                onChange={e => setTicketMessage(e.target.value)}
                                rows={4} 
                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 resize-none bg-white" 
                                placeholder="Descreva os detalhes do seu problema. Quanto mais informações, mais rápido poderemos ajudar..."
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setIsTicketFormOpen(false)} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 font-medium transition-colors">Cancelar</button>
                            <button type="submit" className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded font-medium shadow-lg hover:opacity-90 transition-opacity">Abrir Ticket Oficial</button>
                        </div>
                    </form>
                </div>
            )}

            {/* FAQ Area Expandable */}
            {isFAQOpen && (
                <div className="glass p-6 border border-white/20 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
                        <h3 className="font-bold text-xl flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                            Top 20 Perguntas Frequentes Essenciais (FAQ)
                        </h3>
                        <button onClick={() => setIsFAQOpen(false)} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5"/></button>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, idx) => (
                            <details key={idx} className="group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <summary className="font-bold p-4 cursor-pointer text-gray-800 list-none flex justify-between items-center outline-none selection:bg-transparent">
                                    <div className="flex items-center gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">{idx + 1}</span>
                                        {faq.q}
                                    </div>
                                    <span className="text-gray-400 group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                                </summary>
                                <div className="p-4 pt-0 text-gray-600 text-sm border-t border-gray-100 bg-orange-50/30">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            )}

            <div className="glass p-6 border border-white/20 mt-8">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    Tickets Recentes
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-lg">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Resolvido</span>
                                <h4 className="font-medium text-sm">Troca de Produto - Pedido #1234</h4>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Atualizado há 2 dias</p>
                        </div>
                        <button className="text-sm text-blue-600 hover:underline">Ver detalhes</button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-lg">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Em Aberto</span>
                                <h4 className="font-medium text-sm">Dúvida sobre entrega</h4>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Criado hoje às 14:00</p>
                        </div>
                        <button className="text-sm text-blue-600 hover:underline">Ver detalhes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

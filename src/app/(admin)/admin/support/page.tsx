"use client";

import { useState } from "react";
import { Button } from "@/frontend/components/ui/Button";
import { Input } from "@/frontend/components/ui/Input";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { MessageSquare, Mail, AlertCircle, CheckCircle, Clock, Save, Phone, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

// MOCK DATA
const INITIAL_TICKETS = [
    { id: 1, subject: "Problema com entrega", user: "Maria Silva", status: "open", priority: "high", date: "2 horas atrás", channel: "whatsapp" },
    { id: 2, subject: "Dúvida sobre tamanho", user: "João Santos", status: "pending", priority: "medium", date: "5 horas atrás", channel: "email" },
    { id: 3, subject: "Troca de produto", user: "Ana Paula", status: "resolved", priority: "low", date: "1 dia atrás", channel: "whatsapp" },
];

const INITIAL_TEMPLATES = [
    { id: 1, name: "Boas-vindas", subject: "Bem-vindo à Loja!", body: "Olá {nome}, obrigado por se cadastrar..." },
    { id: 2, name: "Pedido Enviado", subject: "Seu pedido está a caminho", body: "Olá {nome}, seu pedido #{pedido} foi enviado..." },
    { id: 3, name: "Troca de Senha", subject: "Recuperação de Senha", body: "Clique no link para redefinir sua senha..." },
];

export default function SupportPage() {
    const [tickets, setTickets] = useState(INITIAL_TICKETS);
    const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
    const [whatsappNumber, setWhatsappNumber] = useState("5511999999999");
    const [activeTab, setActiveTab] = useState<'tickets' | 'whatsapp' | 'emails'>('tickets');

    // -- EMAIL TEMPLATE HANDLERS --
    const handleUpdateTemplate = (id: number, field: string, value: string) => {
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const handleSaveTemplates = () => {
        toast.success("Modelos de e-mail salvos com sucesso!");
    };

    // -- WHATSAPP HANDLERS --
    const handleSaveWhatsapp = () => {
        toast.success(`Integração salva! Redirecionamento configurado para: ${whatsappNumber}`);
    };

    return (
        <div className="space-y-8 pb-20">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Suporte Digital</h1>
                        <p className="text-muted-foreground">Central de atendimento, WhatsApp e modelos de e-mail.</p>
                    </div>
                </div>
            </FadeIn>

            {/* TABS CONFIGURATION */}
            <div className="flex gap-2 border-b border-border pb-1">
                <button
                    onClick={() => setActiveTab('tickets')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tickets' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Tickets ({tickets.filter(t => t.status === 'open').length})
                </button>
                <button
                    onClick={() => setActiveTab('whatsapp')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'whatsapp' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Configurar WhatsApp
                </button>
                <button
                    onClick={() => setActiveTab('emails')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'emails' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Modelos de E-mail
                </button>
            </div>

            {/* TAB CONTENT: TICKETS */}
            {activeTab === 'tickets' && (
                <FadeIn className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass p-6 rounded-xl border border-border flex items-center gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Abertos</p>
                                <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'open').length}</p>
                            </div>
                        </div>
                        <div className="glass p-6 rounded-xl border border-border flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Resolvidos</p>
                                <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'resolved').length}</p>
                            </div>
                        </div>
                        <div className="glass p-6 rounded-xl border border-border flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Tickets</p>
                                <p className="text-2xl font-bold">{tickets.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-xl border border-border overflow-hidden">
                        <div className="divide-y divide-border">
                            {tickets.map((ticket) => (
                                <div key={ticket.id} className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${ticket.channel === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {ticket.channel === 'whatsapp' ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">{ticket.subject}</h4>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                {ticket.user} • {ticket.date}
                                                {ticket.priority === 'high' && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded ml-2">Alta Prioridade</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-2 py-1 rounded-full ${ticket.status === 'open' ? 'bg-red-100 text-red-700' :
                                                ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {ticket.status === 'open' ? 'Aberto' : ticket.status === 'resolved' ? 'Resolvido' : 'Pendente'}
                                        </span>
                                        <Button size="sm" variant="outline">Ver Detalhes</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            )}

            {/* TAB CONTENT: WHATSAPP */}
            {activeTab === 'whatsapp' && (
                <FadeIn className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass p-6 rounded-xl border border-border space-y-6">
                        <div className="flex items-center gap-3 border-b border-border pb-4">
                            <div className="bg-green-500 p-2 rounded-lg text-white">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Configuração WhatsApp</h2>
                                <p className="text-sm text-muted-foreground">Redirecionamento automático de clientes.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Número do WhatsApp (Com DDI)</label>
                                <Input
                                    value={whatsappNumber}
                                    onChange={(e) => setWhatsappNumber(e.target.value)}
                                    placeholder="5511999999999"
                                />
                                <p className="text-xs text-muted-foreground">Formato: 55 + DDD + Número (apenas números)</p>
                            </div>

                            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
                                <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2">Tutorial Passo a Passo</h3>
                                <ul className="list-disc pl-4 space-y-2 text-sm text-green-700 dark:text-green-300">
                                    <li>Cadastre o número oficial da sua empresa acima.</li>
                                    <li>Nos botões "Fale Conosco" do site, o link será gerado automaticamente.</li>
                                    <li>O link padrão será: <code className="bg-white/50 px-1 rounded">https://wa.me/{whatsappNumber}</code></li>
                                    <li>Configure mensagens automáticas no seu WhatsApp Business para saudações iniciais.</li>
                                </ul>
                            </div>

                            <Button onClick={handleSaveWhatsapp} className="w-full bg-green-600 hover:bg-green-700 text-white">
                                <Save className="w-4 h-4 mr-2" /> Salvar Configuração WhatsApp
                            </Button>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-xl border border-border flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <img src="/images/qr-code-placeholder.png" alt="QR Code" className="w-48 h-48 opacity-20 mx-auto" />
                            <p className="text-muted-foreground">O QR Code para início rápido aparecerá aqui após salvar.</p>
                        </div>
                    </div>
                </FadeIn>
            )}

            {/* TAB CONTENT: EMAILS */}
            {activeTab === 'emails' && (
                <FadeIn className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Modelos de E-mail Editáveis</h2>
                        <Button onClick={handleSaveTemplates}>
                            <Save className="w-4 h-4 mr-2" /> Salvar Todos
                        </Button>
                    </div>

                    <div className="grid gap-6">
                        {templates.map((template) => (
                            <div key={template.id} className="glass p-6 rounded-xl border border-border space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-lg">{template.name}</h3>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Automático</span>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Assunto</label>
                                    <Input
                                        value={template.subject}
                                        onChange={(e) => handleUpdateTemplate(template.id, 'subject', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Corpo do E-mail (HTML/Texto)</label>
                                    <textarea
                                        className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm"
                                        value={template.body}
                                        onChange={(e) => handleUpdateTemplate(template.id, 'body', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button variant="outline" className="w-full border-dashed">
                        <Plus className="w-4 h-4 mr-2" /> Adicionar Novo Modelo
                    </Button>
                </FadeIn>
            )}
        </div>
    );
}

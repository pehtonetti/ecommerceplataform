"use client";

import { FadeIn } from "@/frontend/components/ui/Motion";
import { Button } from "@/frontend/components/ui/Button";
import { Input } from "@/frontend/components/ui/Input";
import { Textarea } from "@/frontend/components/ui/Textarea";
import { Mail, Send, Megaphone, Share2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { sendEmailCampaign } from "@/backend/actions/marketing-actions";

export default function MarketingPage() {
    const [emailSubject, setEmailSubject] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendTest = async () => {
        setLoading(true);
        try {
            await sendEmailCampaign(emailSubject || "Teste", "<b>Conteúdo de Teste</b>");
            toast.success("Email de teste enviado!");
        } catch (e) {
            toast.error("Erro ao enviar email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Marketing & Ads</h1>
                        <p className="text-muted-foreground">Campanhas de email, redes sociais e integracões com Ads.</p>
                    </div>
                </div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Email Marketing */}
                <FadeIn delay={0.1}>
                    <div className="glass p-6 rounded-xl border border-border h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <Mail className="h-5 w-5 text-blue-500" />
                            <h2 className="text-lg font-semibold">Email Marketing (HTML)</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Assunto da Campanha</label>
                                <Input
                                    id="marketing-email-subject"
                                    placeholder="Ex: Ofertas Imperdíveis de Natal!"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Conteúdo HTML</label>
                                <Textarea
                                    id="marketing-email-content"
                                    placeholder="<div><h1>Olá Cliente!</h1>...</div>"
                                    className="h-40 font-mono text-xs"
                                />
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                                <Button variant="outline" onClick={handleSendTest} disabled={loading}>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Testar Envio"}
                                </Button>
                                <Button disabled={loading}>
                                    <Send className="w-4 h-4 mr-2" />
                                    Enviar Campanha
                                </Button>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Ads Integations */}
                <FadeIn delay={0.2} className="space-y-6">
                    {/* Google Ads */}
                    <div className="glass p-6 rounded-xl border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Megaphone className="h-5 w-5 text-green-500" />
                                <div>
                                    <h2 className="font-semibold">Google Ads</h2>
                                    <p className="text-xs text-muted-foreground">Integrado para Google Shopping</p>
                                </div>
                            </div>
                            <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Ativo</div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Sincronização de produtos automática. Última atualização há 2 horas.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Configurar Feed</Button>
                    </div>

                    {/* Meta Ads */}
                    <div className="glass p-6 rounded-xl border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Share2 className="h-5 w-5 text-blue-600" />
                                <div>
                                    <h2 className="font-semibold">Meta Ads (Facebook/Instagram)</h2>
                                    <p className="text-xs text-muted-foreground">Pixel & API de Conversões</p>
                                </div>
                            </div>
                            <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Ativo</div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">Gerenciar Pixel</Button>
                            <Button variant="outline" size="sm" className="flex-1">Catálogo</Button>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="glass p-6 rounded-xl border border-border">
                        <h3 className="font-semibold mb-3">Login Social</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-background rounded border border-border">
                                <span className="text-sm">Google Login</span>
                                <span className="text-xs font-mono text-muted-foreground">client_id_...7a9f</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-background rounded border border-border">
                                <span className="text-sm">Facebook Login</span>
                                <span className="text-xs font-mono text-muted-foreground">app_id_...8b21</span>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}

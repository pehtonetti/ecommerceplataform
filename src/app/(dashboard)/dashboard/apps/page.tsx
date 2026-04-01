'use client';

import { useState, useEffect } from 'react';
import { getStoreConfig, updateStoreConfig } from '@/backend/actions/store-config-actions';
import { Button } from '@/frontend/components/ui/Button';
import { Input } from '@/frontend/components/ui/Input';
import { 
    MessageSquare, 
    BarChart3, 
    Facebook, 
    Check, 
    ExternalLink,
    Zap,
    ShieldCheck
} from 'lucide-react';

interface StoreConfig {
    whatsappNumber: string | null;
    googleAnalyticsId: string | null;
    facebookPixelId: string | null;
}

export default function AppsPage() {
    const [config, setConfig] = useState<StoreConfig>({
        whatsappNumber: '',
        googleAnalyticsId: '',
        facebookPixelId: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function loadConfig() {
        const res = await getStoreConfig();
        if (res.success && res.config) {
            setConfig({
                whatsappNumber: res.config.whatsappNumber || '',
                googleAnalyticsId: res.config.googleAnalyticsId || '',
                facebookPixelId: res.config.facebookPixelId || ''
            });
        }
        setIsLoading(false);
    }

    useEffect(() => {
        loadConfig();
    }, []);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        const res = await updateStoreConfig({
            whatsappNumber: config.whatsappNumber ?? undefined,
            googleAnalyticsId: config.googleAnalyticsId ?? undefined,
            facebookPixelId: config.facebookPixelId ?? undefined
        });

        if (res.success) {
            setMessage({ type: 'success', text: 'Configurações de apps salvas com sucesso!' });
        } else {
            setMessage({ type: 'error', text: res.error || 'Erro ao salvar.' });
        }
        setIsSaving(false);
    }

    if (isLoading) return <div className="p-8 text-center animate-pulse">Carregando Central de Apps...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tightest bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Central de Integrações
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Conecte sua loja com as melhores ferramentas do mercado em segundos.</p>
                </div>
                <div className="flex items-center gap-2 p-1 px-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    CONEXÃO SEGURA SSL
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {message && (
                    <div className={`p-4 rounded-2xl border animate-in zoom-in-95 duration-300 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-500/20' : 'bg-red-50 border-red-100 text-red-700 dark:bg-red-950/20 dark:border-red-500/20'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* WhatsApp */}
                    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-border/50 p-6 flex flex-col shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Popular</div>
                        </div>
                        <h3 className="text-lg font-bold mb-2">WhatsApp Button</h3>
                        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Mostre um botão flutuante para seus clientes tirarem dúvidas direto no seu Zap.</p>
                        <div className="mt-auto space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Número com DDD</label>
                                <Input 
                                    placeholder="Ex: 11999999999" 
                                    value={config?.whatsappNumber || ''} 
                                    onChange={(e) => setConfig(prev => ({...prev, whatsappNumber: e.target.value}))}
                                    className="rounded-xl border-border/60"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Google Analytics */}
                    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-border/50 p-6 flex flex-col shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Google Analytics 4</h3>
                        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Monitore visitas, origens de tráfego e comportamento dos usuários na sua loja.</p>
                        <div className="mt-auto space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ID de Medição (G-XXXXX)</label>
                                <Input 
                                    placeholder="G-BXXXXXXX" 
                                    value={config?.googleAnalyticsId || ''} 
                                    onChange={(e) => setConfig(prev => ({...prev, googleAnalyticsId: e.target.value}))}
                                    className="rounded-xl border-border/60"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Facebook Pixel */}
                    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-border/50 p-6 flex flex-col shadow-sm hover:shadow-md transition-all group border-b-4 border-b-indigo-500/30">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                <Facebook className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-bold uppercase tracking-widest leading-none">
                                <Zap className="w-2.5 h-2.5 fill-current" />
                                Pro
                            </div>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Meta Pixel</h3>
                        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Otimize seus anúncios no Instagram e Facebook com rastreamento de conversão.</p>
                        <div className="mt-auto space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pixel ID</label>
                                <Input 
                                    placeholder="123456789012345" 
                                    value={config?.facebookPixelId || ''} 
                                    onChange={(e) => setConfig(prev => ({...prev, facebookPixelId: e.target.value}))}
                                    className="rounded-xl border-border/60"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button 
                        type="submit" 
                        disabled={isSaving}
                        className="rounded-2xl px-12 py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 gap-2 text-lg"
                    >
                        {isSaving ? 'Salvando...' : (
                            <>
                                <Check className="w-5 h-5" />
                                Salvar Integrações
                            </>
                        )}
                    </Button>
                </div>
            </form>

            <div className="p-8 rounded-2xl bg-zinc-950 text-white border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles className="w-32 h-32" />
                </div>
                <div className="relative z-10 max-w-xl space-y-4">
                    <h4 className="text-xl font-bold flex items-center gap-2">
                        Precisa de ajuda para conectar?
                    </h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Nossas integrações foram desenhadas para agilidade extrema. Basta colar o ID e nós cuidamos da injeção de código otimizada, garantindo que sua loja continue carregando instantaneamente.
                    </p>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl gap-2 font-bold">
                        Ver tutoriais
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function Sparkles(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    )
}

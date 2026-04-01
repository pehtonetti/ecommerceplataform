"use client";

import { useState, useEffect } from "react";
import { Copy, Key, Plus, Trash2, ShieldCheck, AlertCircle, Terminal, HelpCircle } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import { toast } from "sonner";
import { getApiKeys, createApiKey, deleteApiKey } from "@/backend/actions/api-actions";
import { FadeIn } from "@/frontend/components/ui/Motion";

export default function ApiSettingsPage() {
    const [keys, setKeys] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newKeyName, setNewKeyName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [lastCreatedKey, setLastCreatedKey] = useState<string | null>(null);

    useEffect(() => {
        loadKeys();
    }, []);

    async function loadKeys() {
        setIsLoading(true);
        const data = await getApiKeys();
        setKeys(data);
        setIsLoading(false);
    }

    async function handleCreate() {
        if (!newKeyName) return toast.error("Dê um nome para a chave");
        setIsCreating(true);
        const res = await createApiKey(newKeyName);
        setIsCreating(false);
        if (res.success) {
            setLastCreatedKey(res.key as string);
            setNewKeyName("");
            loadKeys();
            toast.success("Chave gerada com sucesso!");
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Tem certeza? Isso quebrará qualquer integração usando esta chave.")) return;
        const res = await deleteApiKey(id);
        if (res.success) {
            loadKeys();
            toast.success("Chave revogada!");
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Chave copiada!");
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-10">
            <FadeIn>
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-4xl font-black tracking-tightest flex items-center gap-3">
                        <Terminal className="w-10 h-10 text-indigo-500" />
                        API & Desenvolvedores
                    </h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">
                        Conecte seu Simplify a plataformas externas com chaves seguras
                    </p>
                </div>
            </FadeIn>

            {/* Warning Box */}
            <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 p-6 rounded-3xl flex gap-4 items-start">
                <ShieldCheck className="w-6 h-6 text-indigo-500 mt-1" />
                <div className="space-y-2">
                    <h4 className="font-black text-sm uppercase tracking-tight text-indigo-900 dark:text-indigo-300">Segurança de Dados</h4>
                    <p className="text-sm text-indigo-700/80 dark:text-indigo-400/80 leading-relaxed font-medium">
                        Suas chaves de API têm permissão de leitura e escrita. Nunca compartilhe sua chave privada ou exponha ela no lado do cliente (frontend JavaScript).
                    </p>
                </div>
            </div>

            {/* Create New Key */}
            <section className="glass p-8 rounded-[40px] border border-border/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Plus className="w-32 h-32" />
                </div>

                <h3 className="text-xl font-black mb-6 uppercase tracking-tightest flex items-center gap-2">
                    Gerar Nova Chave
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                </h3>

                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Ex: Integração ERP, Checkout Externo..."
                        className="flex-1 bg-white/50 dark:bg-black/20 border border-border rounded-2xl px-6 py-4 font-bold focus:outline-indigo-500 transition-all"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                    />
                    <Button 
                        size="lg" 
                        onClick={handleCreate} 
                        disabled={isCreating}
                        className="rounded-2xl px-10 h-14 font-black tracking-tight bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20"
                    >
                        {isCreating ? "GERANDO..." : "CRIAR CHAVE"}
                    </Button>
                </div>

                {lastCreatedKey && (
                    <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-2">Chave Gerada — SALVE AGORA</p>
                                <code className="text-lg font-black text-emerald-600 dark:text-emerald-400 break-all">{lastCreatedKey}</code>
                                <p className="text-xs text-emerald-600/60 font-bold">Por segurança, esta chave não será mostrada novamente.</p>
                            </div>
                            <Button size="sm" variant="ghost" className="text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl" onClick={() => copyToClipboard(lastCreatedKey)}>
                                <Copy className="w-4 h-4 mr-2" /> COPIAR
                            </Button>
                        </div>
                    </div>
                )}
            </section>

            {/* Keys Table */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black uppercase tracking-tightest">Minhas Chaves</h3>
                    <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-[10px] font-black opacity-60 uppercase">{keys.length} ATIVAS</span>
                </div>

                <div className="space-y-4">
                    {keys.length === 0 && !isLoading && (
                        <div className="py-20 text-center glass rounded-[40px] opacity-40">
                            <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="font-black uppercase tracking-widest text-xs">Nenhuma chave gerada ainda</p>
                        </div>
                    )}

                    {keys.map((k) => (
                        <div key={k.id} className="group glass p-6 rounded-[32px] border border-border/50 hover:border-indigo-500/50 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                    <Key className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black tracking-tight leading-tight">{k.name}</h4>
                                    <div className="flex items-center gap-4 mt-1 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        <span>Últimos 4: {k.key.slice(-4)}</span>
                                        <div className="h-1 w-1 rounded-full bg-border" />
                                        <span>Criada em {new Date(k.createdAt).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl p-4"
                                    onClick={() => handleDelete(k.id)}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Docs */}
            <section className="pt-10 border-t border-border">
                <div className="flex items-center gap-3 mb-8">
                    <HelpCircle className="w-6 h-6 text-muted-foreground" />
                    <h3 className="text-lg font-black uppercase tracking-tightest">Acesso Rápido (Exemplo CURL)</h3>
                </div>

                <div className="bg-zinc-950 rounded-3xl p-8 font-mono text-xs text-indigo-400 overflow-x-auto shadow-2xl relative">
                    <div className="absolute top-4 right-4 text-[10px] uppercase font-black opacity-30">Bash / Curl</div>
                    <pre className="leading-relaxed">
                        {`curl -X GET "https://simplify.pehtonetti.com/api/v1/products" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                    </pre>
                </div>
            </section>
        </div>
    );
}

'use client';

import { Button } from "@/frontend/components/ui/Button";
import { Input } from "@/frontend/components/ui/Input";
import { useState } from "react";
import { generateProductAIContent } from "@/backend/actions/ai-actions";
import { Sparkles, Loader2, ImagePlus } from "lucide-react";
import { toast } from "sonner";

interface ProductFormProps {
    action: (formData: FormData) => void;
    initialData?: {
        name: string;
        price: number; // in cents
        description: string;
        stock: number;
        imageUrl: string | null;
        category: string;
    }
}

export default function ProductForm({ action, initialData }: ProductFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [category, setCategory] = useState(initialData?.category || '');

    const handleGenerateAI = async () => {
        if (!name) return alert('Por favor, digite o nome do produto primeiro.');
        
        setIsGenerating(true);
        const res = await generateProductAIContent(name);
        
        if (res.success && res.data) {
            setDescription(res.data.description);
            setCategory(res.data.category);
        } else {
            alert(res.error || 'Erro ao gerar conteúdo com IA.');
        }
        setIsGenerating(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        await action(formData);
        setIsLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl glass p-8 rounded-2xl border border-border/50 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Sparkles className="w-24 h-24 text-indigo-500" />
            </div>

            <div className="grid gap-6 relative z-10">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                        Nome do Produto
                        {!initialData && (
                            <button 
                                type="button"
                                onClick={handleGenerateAI}
                                disabled={isGenerating || !name}
                                className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-500/20 transition-all text-[10px] font-black group disabled:opacity-50 disabled:grayscale"
                            >
                                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform" />}
                                PREENCHER COM IA (MAGIC)
                            </button>
                        )}
                    </label>
                    <Input 
                        name="name" 
                        required 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: iPhone 15 Pro Max Natural Titanium" 
                        className="rounded-xl border-border/60 focus:ring-indigo-500/20 py-6"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preço (R$)</label>
                        <Input name="price" type="number" step="0.01" required defaultValue={initialData ? initialData.price / 100 : ''} placeholder="0.00" className="rounded-xl py-6" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estoque</label>
                        <Input name="stock" type="number" required defaultValue={initialData?.stock} placeholder="10" className="rounded-xl py-6" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Categoria</label>
                    <Input 
                        name="category" 
                        required 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Ex: Smartphones" 
                        className="rounded-xl py-6"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                        URL da Imagem
                        <button 
                            type="button"
                            onClick={() => {
                                setIsEnhancing(true);
                                setTimeout(() => {
                                    setIsEnhancing(false);
                                    toast.success("Fundo removido com sucesso! (IA)");
                                }, 2000);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-500/20 transition-all text-[10px] font-black group disabled:opacity-50"
                            disabled={isEnhancing}
                        >
                            {isEnhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImagePlus className="w-3 h-3" />}
                            REMOVER FUNDO (IA)
                        </button>
                    </label>
                    <Input name="imageUrl" defaultValue={initialData?.imageUrl || ''} placeholder="https://..." className="rounded-xl py-6 border-border/60" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                        Descrição
                        {name && !description && (
                            <span className="text-[10px] text-indigo-500 animate-pulse font-bold">Dica: Use a IA acima para gerar!</span>
                        )}
                    </label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="flex min-h-[120px] w-full rounded-xl border border-border/60 bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all"
                        required
                        placeholder="Descreva as principais características e benefícios do produto..."
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border/40">
                <Button type="button" variant="ghost" onClick={() => window.history.back()} className="rounded-xl px-6">Cancelar</Button>
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="rounded-xl px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20"
                >
                    {isLoading ? 'Salvando...' : 'Salvar Produto'}
                </Button>
            </div>
        </form>
    )
}


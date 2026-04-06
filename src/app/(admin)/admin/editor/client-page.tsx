"use client";

import { useState } from "react";
import { saveLayoutConfig } from "@/backend/actions/layout-actions";
import { toast } from "sonner";
import { 
    Layout, 
    Monitor, 
    Smartphone, 
    Undo, 
    Redo, 
    Save, 
    Plus,
    Type,
    Image as ImageIcon
} from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditorPageClient({ initialData }: { initialData: any }) {
    const [saving, setSaving] = useState(false);
    
    const handleSave = async () => {
        setSaving(true);
        try {
            await saveLayoutConfig(initialData);
            toast.success("Layout da loja salvo com sucesso!");
        } catch (error) {
            toast.error("Erro ao salvar o layout.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-zinc-100 dark:bg-zinc-950">
            {/* Header / Toolbar */}
            <header className="h-16 border-b border-border bg-white dark:bg-zinc-950 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white">
                        <Layout className="w-5 h-5 flex-shrink-0" />
                    </div>
                    <div>
                        <h1 className="font-bold text-sm tracking-tightest whitespace-nowrap">SIMPLIFY EDITOR</h1>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">V1.0 (Alpha)</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-border">
                    <button className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm text-indigo-600 shadow-indigo-500/10">
                        <Monitor className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white dark:hover:bg-zinc-800 transition-all">
                        <Smartphone className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 opacity-40">
                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg" disabled><Undo className="w-4 h-4" /></Button>
                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg" disabled><Redo className="w-4 h-4" /></Button>
                    </div>
                    <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 h-10 font-bold gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 text-xs"
                    >
                        {saving ? "Salvando..." : (
                            <>
                                <Save className="w-4 h-4" />
                                Publicar Loja
                            </>
                        )}
                    </Button>
                </div>
            </header>

            {/* Main Editor UI */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Components */}
                <aside className="w-72 border-r border-border bg-white dark:bg-zinc-950 flex flex-col overflow-y-auto">
                    <div className="p-6 flex-1">
                        <h3 className="text-xs font-black uppercase tracking-widest mb-6 opacity-60">Componentes Visuais</h3>
                        <div className="space-y-3">
                            <div className="p-4 rounded-2xl border border-dashed border-border hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all cursor-move group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <Layout className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold opacity-70 group-hover:opacity-100">Hero Section</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl border border-dashed border-border hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all cursor-move group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <Type className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold opacity-70 group-hover:opacity-100">Texto / Título</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl border border-dashed border-border hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all cursor-move group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold opacity-70 group-hover:opacity-100">Botão Chamada</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl border border-dashed border-border hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all cursor-move group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <ImageIcon className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold opacity-70 group-hover:opacity-100">Banner Único</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-border bg-indigo-500/5 mt-auto">
                        <p className="text-[10px] font-black uppercase tracking-tightest mb-2 opacity-60">Instruções CMS</p>
                        <p className="text-[10px] leading-relaxed opacity-50">Arraste os componentes para a área central. O novo CMS Simplify v1.0 sincroniza seu banco automaticamente.</p>
                    </div>
                </aside>

                {/* Canvas Area */}
                <main className="flex-1 p-12 overflow-y-auto flex items-center justify-center">
                    <div className="w-full max-w-4xl aspect-[16/10] bg-white dark:bg-zinc-950 shadow-2xl rounded-[40px] border border-border/50 flex items-center justify-center border-dashed group hover:border-indigo-300 transition-all">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mx-auto group-hover:scale-110 transition-transform">
                                <Plus className="w-10 h-10" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-black uppercase tracking-widest">Inicie seu Layout</h2>
                                <p className="text-xs text-muted-foreground font-medium opacity-60">Arraste um componente para começar a criar.</p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Panel: Settings */}
                <aside className="w-80 border-l border-border bg-white dark:bg-zinc-950 flex flex-col p-6">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-6 opacity-60">Propriedades</h3>
                    <div className="flex-1 flex items-center justify-center border border-dashed border-border rounded-3xl p-8 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 leading-relaxed">Selecione um componente no canvas para editar suas configurações visuais e links.</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}

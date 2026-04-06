"use client";

import { useState, useTransition } from "react";
import { createBanner } from "@/backend/actions/banner-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/frontend/components/ui/Button";
import { Plus, Loader2, X } from "lucide-react";

export function CreateBannerButton() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await createBanner(fd);
            if (result.success) {
                toast.success('Banner criado!');
                setOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || 'Erro ao criar banner');
            }
        });
    };

    return (
        <>
            <Button onClick={() => setOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20">
                <Plus className="mr-2 h-4 w-4" /> Novo Banner
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-card rounded-2xl border shadow-2xl w-full max-w-md p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold">Novo Banner</h2>
                            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Título *</label>
                                <input name="title" required placeholder="Ex: Super Oferta de Verão" className="w-full bg-muted/50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Subtítulo</label>
                                <input name="subtitle" placeholder="Até 50% de desconto" className="w-full bg-muted/50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">URL da Imagem *</label>
                                <input name="imageUrl" type="url" required placeholder="https://..." className="w-full bg-muted/50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Link de destino</label>
                                <input name="link" defaultValue="/" placeholder="/produtos ou /ofertas" className="w-full bg-muted/50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Ordem de exibição</label>
                                <input name="order" type="number" defaultValue="0" min="0" className="w-full bg-muted/50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">Cancelar</Button>
                                <Button type="submit" disabled={isPending} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Banner'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

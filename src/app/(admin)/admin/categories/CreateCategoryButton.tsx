"use client";

import { useState } from "react";
import { Button } from "@/frontend/components/ui/Button";
import { Plus, Loader2 } from "lucide-react";
import { createCategory } from "@/backend/actions/category-actions";
import { toast } from "sonner";
import { Input } from "@/frontend/components/ui/Input";

export function CreateCategoryButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        try {
            await createCategory(formData);
            toast.success("Categoria criada com sucesso!");
            setIsOpen(false);
        } catch {
            toast.error("Erro ao criar categoria");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Categoria
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-6">
                        <h2 className="text-xl font-bold mb-4">Nova Categoria</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Nome</label>
                                <Input name="name" placeholder="Ex: Smartphones" required />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Descrição</label>
                                <Input name="description" placeholder="Breve descrição..." />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

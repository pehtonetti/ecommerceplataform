"use client";

import { useState } from "react";
import { Button } from "@/frontend/components/ui/Button";
import { Edit, Trash, Loader2 } from "lucide-react";
import { updateCategory, deleteCategory } from "@/backend/actions/category-actions";
import { toast } from "sonner";
import { Input } from "@/frontend/components/ui/Input";

type Category = { id: string; name: string; description: string | null; slug: string };

export function CategoryActionsClient({ category }: { category: Category }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        
        try {
            await updateCategory(category.id, formData);
            toast.success("Categoria atualizada com sucesso!");
            setIsEditOpen(false);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Erro ao atualizar categoria");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteCategory(category.id);
            toast.success("Categoria removida com sucesso!");
            setIsDeleteOpen(false);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Erro ao excluir categoria");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            {/* Botão de Editar */}
            <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)}>
                <Edit className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
            </Button>
            
            {/* Modal de Editar */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 text-left">
                        <h2 className="text-xl font-bold mb-4">Editar Categoria</h2>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Nome</label>
                                <Input name="name" defaultValue={category.name} required />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Descrição</label>
                                <Input name="description" defaultValue={category.description || ''} />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Botão de Excluir */}
            <Button variant="ghost" size="sm" onClick={() => setIsDeleteOpen(true)}>
                <Trash className="w-4 h-4 text-red-500 hover:text-red-700 transition-colors" />
            </Button>

            {/* Modal de Excluir */}
            {isDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 text-left">
                        <h2 className="text-xl font-bold text-red-500 mb-2">Aviso de Exclusão</h2>
                        <p className="text-muted-foreground mb-6">
                            Você tem certeza que deseja deletar a categoria <strong>{category.name}</strong>? Esta ação é irreversível.
                        </p>
                        <div className="flex justify-end gap-2 text-right">
                            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleDelete} disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash className="w-4 h-4 mr-2" />}
                                Deletar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

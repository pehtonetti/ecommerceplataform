"use client";

import { useState } from "react";
import { Button } from "@/frontend/components/ui/Button";
import { RefreshCw, Loader2 } from "lucide-react";
import { addInventoryBatch } from "@/backend/actions/inventory-actions";
import { toast } from "sonner";
import { Input } from "@/frontend/components/ui/Input";

export function RestockButton({ product }: { product: { id: string, name: string, stock: number } }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.append("productId", product.id);
        
        try {
            await addInventoryBatch(formData);
            toast.success("Lote de estoque registrado com sucesso!");
            setIsOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Erro ao registrar lote");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button size="sm" variant="outline" className="text-xs" onClick={() => setIsOpen(true)}>
                <RefreshCw className="mr-2 h-3 w-3" />
                Nova Entrada
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 text-left">
                        <h2 className="text-lg font-bold mb-2">Registrar Entrada de Lote</h2>
                        <p className="text-sm text-muted-foreground mb-6">Produto: <strong>{product.name}</strong></p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Código do Lote</label>
                                <Input name="batchCode" placeholder="Ex: LOTE-2023-A" required />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Qtde Entrada</label>
                                    <Input type="number" name="quantity" min="1" required placeholder="0" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Custo Unt. (R$)</label>
                                    <Input type="number" step="0.01" name="costPrice" min="0" placeholder="0.00" />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Fornecedor</label>
                                <Input name="supplierName" placeholder="Nome do Fabricante/Fornecedor" />
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Registrar"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

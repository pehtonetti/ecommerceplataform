"use client";

import { useState } from "react";
import { Button } from "@/frontend/components/ui/Button";
import { RefreshCw, Loader2 } from "lucide-react";
import { updateStock } from "@/backend/actions/inventory-actions";
import { toast } from "sonner";
import { Input } from "@/frontend/components/ui/Input";

export function RestockButton({ product }: { product: { id: string, name: string, stock: number } }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stock, setStock] = useState(product.stock);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateStock(product.id, Number(stock));
            toast.success("Estoque atualizado!");
            setIsOpen(false);
        } catch {
            toast.error("Erro ao atualizar estoque");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button size="sm" variant="outline" className="text-xs" onClick={() => setIsOpen(true)}>
                <RefreshCw className="mr-2 h-3 w-3" />
                Repor Estoque
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-6">
                        <h2 className="text-lg font-bold mb-2">Atualizar Estoque</h2>
                        <p className="text-sm text-muted-foreground mb-4">{product.name}</p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="text-sm font-medium mb-1 block">Quantidade Atual</label>
                                <Input
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(Number(e.target.value))}
                                    min="0"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
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
        </>
    );
}

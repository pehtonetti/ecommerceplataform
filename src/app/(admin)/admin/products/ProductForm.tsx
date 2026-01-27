'use client';

import { Button } from "@/frontend/components/ui/Button";
import { Input } from "@/frontend/components/ui/Input";
import { useState } from "react";

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        await action(formData);
        setIsLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl glass p-6 rounded-xl border border-border">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Nome do Produto</label>
                    <Input name="name" required defaultValue={initialData?.name} placeholder="Ex: Fone de Ouvido Premium" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Preço (R$)</label>
                        <Input name="price" type="number" step="0.01" required defaultValue={initialData ? initialData.price / 100 : ''} placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Estoque</label>
                        <Input name="stock" type="number" required defaultValue={initialData?.stock} placeholder="10" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Categoria</label>
                    <Input name="category" required defaultValue={initialData?.category} placeholder="Ex: Eletrônicos" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">URL da Imagem</label>
                    <Input name="imageUrl" defaultValue={initialData?.imageUrl || ''} placeholder="https://..." />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição</label>
                    <textarea
                        name="description"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                        defaultValue={initialData?.description}
                        placeholder="Descreva o produto..."
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="ghost" onClick={() => window.history.back()}>Cancelar</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Produto'}</Button>
            </div>
        </form>
    )
}

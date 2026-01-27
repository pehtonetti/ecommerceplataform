"use client";

import { useState } from "react";
import { Button } from "@/frontend/components/ui/Button";
import { Input } from "@/frontend/components/ui/Input";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, Check, Star } from "lucide-react";
import { addAddress, deleteAddress, setDefaultAddress } from "@/backend/actions/address-actions";
import { useRouter } from "next/navigation";

interface Address {
    id: string;
    zipCode: string;
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    label?: string | null;
    isDefault: boolean;
}

export function AddressManager({ initialAddresses }: { initialAddresses: Address[] }) {
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAddAddress = async (formData: FormData) => {
        setIsLoading(true);
        const res = await addAddress(formData);
        setIsLoading(false);

        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Endereço adicionado!");
            setIsAdding(false);
            router.refresh();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja remover este endereço?")) return;
        const res = await deleteAddress(id);
        if (res.success) {
            toast.success("Endereço removido");
            router.refresh();
        } else {
            toast.error(res.error);
        }
    };

    const handleSetDefault = async (id: string) => {
        const res = await setDefaultAddress(id);
        if (res.success) {
            toast.success("Endereço padrão atualizado");
            router.refresh();
        } else {
            toast.error(res.error);
        }
    };

    return (
        <div className="space-y-8">
            {/* List */}
            <div className="grid gap-4 sm:grid-cols-2">
                {initialAddresses.map((addr) => (
                    <div
                        key={addr.id}
                        className={`relative p-4 rounded-xl border transition-all ${addr.isDefault
                                ? "border-primary bg-primary/5 dark:bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                    >
                        {addr.isDefault && (
                            <div className="absolute top-2 right-2 text-xs font-semibold text-primary flex items-center gap-1 bg-white dark:bg-zinc-900 px-2 py-1 rounded-full shadow-sm">
                                <Star className="w-3 h-3 fill-current" /> Padrão
                            </div>
                        )}

                        <div className="pr-12">
                            <strong className="block text-lg mb-1">{addr.label || "Casa/Trabalho"}</strong>
                            <p className="text-sm text-muted-foreground">
                                {addr.street}, {addr.number} {addr.complement && `- ${addr.complement}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {addr.neighborhood} - {addr.city}/{addr.state}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">CEP: {addr.zipCode}</p>
                        </div>

                        <div className="mt-4 flex gap-2 border-t border-border/50 pt-3">
                            {!addr.isDefault && (
                                <button
                                    onClick={() => handleSetDefault(addr.id)}
                                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                                >
                                    <Check className="w-3 h-3" /> Definir como Padrão
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(addr.id)}
                                className="text-xs font-medium text-red-500 hover:text-red-700 ml-auto flex items-center gap-1"
                            >
                                <Trash2 className="w-3 h-3" /> Remover
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add New Button */}
            {!isAdding && (
                <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full py-8 border-dashed border-2">
                    <Plus className="w-5 h-5 mr-2" /> Adicionar Novo Endereço
                </Button>
            )}

            {/* Add Form */}
            {isAdding && (
                <div className="bg-gray-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-border animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-semibold mb-4 text-lg">Novo Endereço</h3>
                    <form action={handleAddAddress} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input name="zipCode" placeholder="CEP (00000-000)" required />
                            <Input name="label" placeholder="Rótulo (ex: Casa)" />
                        </div>
                        <div className="grid grid-cols-[3fr_1fr] gap-4">
                            <Input name="street" placeholder="Rua / Avenida" required />
                            <Input name="number" placeholder="Número" required />
                        </div>
                        <Input name="complement" placeholder="Complemento (Opcional)" />
                        <div className="grid grid-cols-2 gap-4">
                            <Input name="neighborhood" placeholder="Bairro" required />
                            <Input name="city" placeholder="Cidade" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input name="state" placeholder="Estado (UF)" maxLength={2} required />
                            {/* Country hidden default Brasil */}
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Salvando..." : "Salvar Endereço"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

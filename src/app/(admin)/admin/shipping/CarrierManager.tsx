"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle, XCircle, Globe, Key } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import { createCarrier, toggleCarrierStatus, deleteCarrier } from "@/backend/actions/shipping-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CarrierManager({ carriers }: { carriers: any[] }) {
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const res = await createCarrier(formData);

        if (res.success) {
            toast.success("Transportadora adicionada!");
            setIsAdding(false);
            router.refresh();
        } else {
            toast.error(res.error);
        }
    };

    const handleToggle = async (id: string, active: boolean) => {
        await toggleCarrierStatus(id, active);
        toast.info(active ? "Transportadora desativada" : "Transportadora ativada");
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza?")) return;
        await deleteCarrier(id);
        toast.success("Transportadora removida");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Gerenciar Transportadoras</h2>
                <Button onClick={() => setIsAdding(!isAdding)} size="sm">
                    {isAdding ? "Cancelar" : <><Plus className="w-4 h-4 mr-2" /> Nova Transportadora</>}
                </Button>
            </div>

            {isAdding && (
                <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-border animate-in slide-in-from-top-2">
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Nome da Transportadora</label>
                            <input name="name" className="w-full input-field border p-2 rounded mt-1" placeholder="Ex: JadLog, Azul Cargo" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium flex items-center gap-2"><Globe className="w-3 h-3" /> Endpoint API (Cálculo)</label>
                                <input name="calculateApiUrl" className="w-full input-field border p-2 rounded mt-1" placeholder="https://api.transportadora.com/v1/calc" />
                            </div>
                            <div>
                                <label className="text-sm font-medium flex items-center gap-2"><Key className="w-3 h-3" /> API Key / Token</label>
                                <input name="apiKey" type="password" className="w-full input-field border p-2 rounded mt-1" placeholder="sk_test_..." />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button type="submit">Salvar Integração</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {carriers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Nenhuma transportadora configurada.</p>
                ) : (
                    carriers.map(carrier => (
                        <div key={carrier.id} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-sm hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${carrier.isActive ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-400'}`}>
                                    {carrier.isActive ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{carrier.name}</h3>
                                    <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                                        {carrier.calculateApiUrl ? <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> API Configurada</span> : <span>Sem Integração</span>}
                                        {carrier.apiKey && <span className="flex items-center gap-1"><Key className="w-3 h-3" /> Token Salvo</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggle(carrier.id, carrier.isActive)}
                                    className={carrier.isActive ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                                >
                                    {carrier.isActive ? "Desativar" : "Ativar"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(carrier.id)}
                                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

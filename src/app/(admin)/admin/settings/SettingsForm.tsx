"use client";

import { useState } from "react";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { Button } from "@/frontend/components/ui/Button";
import { Input } from "@/frontend/components/ui/Input";
import { updateStoreConfig } from "@/backend/actions/store-config-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function SettingsForm({ initialData }: { initialData: any }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        
        const data = {
            name: formData.get("name") as string,
            pixKey: formData.get("pixKey") as string,
            merchantCity: formData.get("merchantCity") as string,
        };

        try {
            const res = await updateStoreConfig(data);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Configurações salva com sucesso! O Checkout usará este PIX.");
            }
        } catch (error) {
            toast.error("Erro crítico ao salvar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
            <FadeIn>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Configurações Base / Pagamento</h1>
                        <p className="text-muted-foreground mt-1">Gerencie chaves PIX, cidade e nome na geração da fatura.</p>
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Alterações
                    </Button>
                </div>
            </FadeIn>

            <FadeIn delay={0.1} className="grid gap-6 glass p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold mb-2">Informações Requeridas (PIX BCB)</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Nome na Fatura / Beneficiário</label>
                        <Input
                            name="name"
                            defaultValue={initialData?.name || ""}
                            required
                            placeholder="LOJA TECH LTDA"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Cidade Sede (Sem acentos)</label>
                        <Input
                            name="merchantCity"
                            defaultValue={initialData?.merchantCity || "Sao Paulo"}
                            required
                            placeholder="Sao Paulo"
                        />
                    </div>
                    <div className="grid gap-2 col-span-full">
                        <label className="text-sm font-medium">Chave PIX (Apenas Letras/Números/Email válido)</label>
                        <Input
                            name="pixKey"
                            defaultValue={initialData?.pixKey || ""}
                            required
                            placeholder="Ex: seuemail@loja.com ou CNPJ 00.000.000/0001-00"
                        />
                        <span className="text-xs text-muted-foreground">O QRCode gerado dinamicamente para cada venda repassará o pagamento exato direto para esta chave. Evite chaves aleatórias se possível pois requer formatação exata.</span>
                    </div>
                </div>
            </FadeIn>
        </form>
    );
}

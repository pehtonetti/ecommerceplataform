"use client";

import { useState } from "react";
import { Button } from "@/frontend/components/ui/Button";
import { Switch } from "@/frontend/components/ui/Switch";
import { Settings, CreditCard, Banknote } from "lucide-react";
import { toast } from "sonner";

export function PaymentGateways() {
    const [stripeActive, setStripeActive] = useState(true);
    const [pixActive, setPixActive] = useState(false);
    const [boletoActive, setBoletoActive] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        // Simulate save
        await new Promise(r => setTimeout(r, 800));
        toast.success("Configurações de pagamento salvas!");
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="glass p-6 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-indigo-500" />
                        <div>
                            <h3 className="font-semibold text-lg">Stripe (Cartão)</h3>
                            <p className="text-sm text-muted-foreground">Processamento de cartões de crédito/débito</p>
                        </div>
                    </div>
                    <Switch checked={stripeActive} onCheckedChange={setStripeActive} />
                </div>
                {stripeActive && (
                    <div className="pl-9 mt-4 space-y-3 border-l-2 border-indigo-100 dark:border-indigo-900/30 ml-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Credenciais</p>
                        <input className="w-full text-sm p-2 rounded bg-background border" type="password" placeholder="Publishable Key (pk_...)" defaultValue="pk_test_..." />
                        <input className="w-full text-sm p-2 rounded bg-background border" type="password" placeholder="Secret Key (sk_...)" defaultValue="sk_test_..." />
                    </div>
                )}
            </div>

            <div className="glass p-6 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Banknote className="h-6 w-6 text-emerald-500" />
                        <div>
                            <h3 className="font-semibold text-lg">Pix</h3>
                            <p className="text-sm text-muted-foreground">Pagamentos instantâneos (Banco Central)</p>
                        </div>
                    </div>
                    <Switch checked={pixActive} onCheckedChange={setPixActive} />
                </div>
                {pixActive && (
                    <div className="pl-9 mt-4 space-y-3 border-l-2 border-emerald-100 dark:border-emerald-900/30 ml-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Chave Pix</p>
                        <input className="w-full text-sm p-2 rounded bg-background border" type="text" placeholder="Chave Pix (CPF/CNPJ/Email)" />
                    </div>
                )}
            </div>

            <div className="glass p-6 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Banknote className="h-6 w-6 text-yellow-500" />
                        <div>
                            <h3 className="font-semibold text-lg">Boleto / TED</h3>
                            <p className="text-sm text-muted-foreground">Transferência bancária e boletos</p>
                        </div>
                    </div>
                    <Switch checked={boletoActive} onCheckedChange={setBoletoActive} />
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading} size="lg">
                    {loading ? "Salvando..." : "Salvar Configurações"}
                </Button>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/frontend/components/ui/Button";
import { Switch } from "@/frontend/components/ui/Switch";
import { CreditCard, Banknote, Loader2, MapPin, Store } from "lucide-react";
import { toast } from "sonner";
import { getStoreConfig, updateStoreConfig } from "@/backend/actions/store-config-actions";

export function PaymentGateways() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Payment toggles
    const [stripeActive, setStripeActive] = useState(true);
    const [pixActive, setPixActive] = useState(true);
    const [boletoActive, setBoletoActive] = useState(false);

    // Store configuration
    const [config, setConfig] = useState({
        storeName: "",
        pixKey: "",
        merchantCity: "",
        originZipCode: ""
    });

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        setLoading(true);
        const result = await getStoreConfig();

        if (result.success && result.config) {
            setConfig({
                storeName: result.config.storeName || "",
                pixKey: result.config.pixKey || "",
                merchantCity: result.config.merchantCity || "",
                originZipCode: result.config.originZipCode || ""
            });

            // Ativa PIX se já tiver chave configurada
            if (result.config.pixKey) {
                setPixActive(true);
            }
        }

        setLoading(false);
    };

    const handleSave = async () => {
        // Valida se PIX está ativo mas sem chave
        if (pixActive && !config.pixKey) {
            toast.error("Configure a chave PIX antes de ativar o pagamento");
            return;
        }

        if (pixActive && !config.merchantCity) {
            toast.error("Configure a cidade antes de ativar o PIX");
            return;
        }

        setSaving(true);

        const result = await updateStoreConfig({
            storeName: config.storeName,
            pixKey: pixActive ? config.pixKey : undefined,
            merchantCity: config.merchantCity,
            originZipCode: config.originZipCode
        });

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Configurações de pagamento salvas com sucesso!");
        }

        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Informações da Loja */}
            <div className="glass p-6 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                    <Store className="h-6 w-6 text-primary" />
                    <div>
                        <h3 className="font-semibold text-lg">Informações da Loja</h3>
                        <p className="text-sm text-muted-foreground">Dados básicos do estabelecimento</p>
                    </div>
                </div>
                <div className="space-y-3 mt-4">
                    <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wider font-bold block mb-2">
                            Nome da Loja
                        </label>
                        <input
                            className="w-full text-sm p-2 rounded bg-background border"
                            type="text"
                            placeholder="Ex: Simplify - Loja Online"
                            value={config.storeName}
                            onChange={(e) => setConfig({ ...config, storeName: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider font-bold block mb-2">
                                <MapPin className="w-3 h-3 inline mr-1" />
                                Cidade
                            </label>
                            <input
                                className="w-full text-sm p-2 rounded bg-background border"
                                type="text"
                                placeholder="Ex: Bauru"
                                value={config.merchantCity}
                                onChange={(e) => setConfig({ ...config, merchantCity: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider font-bold block mb-2">
                                CEP de Origem
                            </label>
                            <input
                                className="w-full text-sm p-2 rounded bg-background border"
                                type="text"
                                placeholder="00000-000"
                                value={config.originZipCode}
                                onChange={(e) => setConfig({ ...config, originZipCode: e.target.value })}
                                maxLength={9}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stripe */}
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
                        <p className="text-xs text-muted-foreground">
                            Configure suas chaves em <code className="bg-muted px-1 rounded">.env</code>
                        </p>
                    </div>
                )}
            </div>

            {/* PIX */}
            <div className="glass p-6 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Banknote className="h-6 w-6 text-emerald-500" />
                        <div>
                            <h3 className="font-semibold text-lg">PIX</h3>
                            <p className="text-sm text-muted-foreground">Pagamentos instantâneos (Banco Central)</p>
                        </div>
                    </div>
                    <Switch checked={pixActive} onCheckedChange={setPixActive} />
                </div>
                {pixActive && (
                    <div className="pl-9 mt-4 space-y-3 border-l-2 border-emerald-100 dark:border-emerald-900/30 ml-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Chave PIX</p>
                        <input
                            className="w-full text-sm p-2 rounded bg-background border font-mono"
                            type="text"
                            placeholder="CPF, CNPJ, Email, Telefone ou Chave Aleatória"
                            value={config.pixKey}
                            onChange={(e) => setConfig({ ...config, pixKey: e.target.value })}
                        />
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                            <p className="text-xs text-emerald-800 dark:text-emerald-200 font-medium mb-2">
                                ✓ Geração automática de QR Code
                            </p>
                            <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                Ao ativar o PIX, os clientes poderão pagar via QR Code gerado automaticamente com desconto de 5%
                            </p>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p className="font-bold">Tipos aceitos:</p>
                            <ul className="list-disc list-inside space-y-0.5 ml-2">
                                <li>CPF: 11 dígitos</li>
                                <li>CNPJ: 14 dígitos</li>
                                <li>Email: formato válido</li>
                                <li>Telefone: +55DDNNNNNNNNN</li>
                                <li>Chave Aleatória: UUID</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Boleto */}
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
                {boletoActive && (
                    <div className="pl-9 mt-4 border-l-2 border-yellow-100 dark:border-yellow-900/30 ml-3">
                        <p className="text-xs text-muted-foreground">
                            Em desenvolvimento
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} size="lg">
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        "Salvar Configurações"
                    )}
                </Button>
            </div>
        </div>
    );
}

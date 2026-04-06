"use client";

import { useState, useEffect } from "react";
import { Button } from "@/frontend/components/ui/Button";
import { toast } from "sonner";
import { getStoreConfig, updateStoreConfig } from "@/backend/actions/store-config-actions";
import { Save, Loader2, CreditCard, MapPin, Phone, Mail } from "lucide-react";

export function PaymentSettingsForm() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        pixKey: "",
        merchantCity: "",
        originZipCode: "",
        whatsappNumber: "",
        whatsappMessage: ""
    });

    const loadConfig = async () => {
        setLoading(true);
        const result = await getStoreConfig();

        if (result.success && result.config) {
            setFormData({
                name: result.config.name || "",
                pixKey: result.config.pixKey || "",
                merchantCity: result.config.merchantCity || "",
                originZipCode: result.config.originZipCode || "",
                whatsappNumber: result.config.whatsappNumber || "",
                whatsappMessage: result.config.whatsappMessage || ""
            });
        }

        setLoading(false);
    };

    useEffect(() => {
        loadConfig();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const result = await updateStoreConfig(formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Configurações salvas com sucesso!");
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
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informações da Loja */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Informações da Loja</h2>
                        <p className="text-sm text-muted-foreground">
                            Dados básicos do estabelecimento
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Nome da Loja *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-950"
                            placeholder="Ex: Simplify - Loja Online"
                            required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Nome que aparecerá nos comprovantes e comunicações
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <MapPin className="w-4 h-4 inline mr-1" />
                                Cidade *
                            </label>
                            <input
                                type="text"
                                value={formData.merchantCity}
                                onChange={(e) => setFormData({ ...formData, merchantCity: e.target.value })}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-950"
                                placeholder="Ex: Bauru"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                CEP de Origem
                            </label>
                            <input
                                type="text"
                                value={formData.originZipCode}
                                onChange={(e) => setFormData({ ...formData, originZipCode: e.target.value })}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-950"
                                placeholder="00000-000"
                                maxLength={9}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Para cálculo de frete
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Configurações PIX */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Pagamento PIX</h2>
                        <p className="text-sm text-muted-foreground">
                            Configure sua chave PIX para receber pagamentos
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <Mail className="w-4 h-4 inline mr-1" />
                            Chave PIX *
                        </label>
                        <input
                            type="text"
                            value={formData.pixKey}
                            onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-950 font-mono"
                            placeholder="CPF, CNPJ, email, telefone ou chave aleatória"
                            required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Esta chave será usada para gerar os QR Codes PIX
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2">
                            Tipos de chave PIX aceitos:
                        </h4>
                        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• <strong>CPF:</strong> 11 dígitos (ex: 12345678901)</li>
                            <li>• <strong>CNPJ:</strong> 14 dígitos (ex: 12345678000190)</li>
                            <li>• <strong>Email:</strong> formato válido (ex: loja@exemplo.com)</li>
                            <li>• <strong>Telefone:</strong> +55DDNNNNNNNNN (ex: +5514999999999)</li>
                            <li>• <strong>Chave Aleatória:</strong> UUID</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Configurações WhatsApp */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">WhatsApp</h2>
                        <p className="text-sm text-muted-foreground">
                            Configure o atendimento via WhatsApp
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Número do WhatsApp
                        </label>
                        <input
                            type="text"
                            value={formData.whatsappNumber}
                            onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-950"
                            placeholder="+5514999999999"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Formato: +55 + DDD + Número (com 9 dígitos)
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Mensagem Padrão
                        </label>
                        <textarea
                            value={formData.whatsappMessage}
                            onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-950"
                            placeholder="Olá! Gostaria de saber sobre meu pedido"
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={saving}
                    size="lg"
                    className="gap-2"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Salvar Configurações
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

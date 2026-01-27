"use client";

import { useState } from "react";
import { Truck, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";

export function ShippingCalculator() {
    const [cep, setCep] = useState("");
    const [loading, setLoading] = useState(false);
    const [shippingOption, setShippingOption] = useState<{ price: string; days: number } | null>(null);

    const handleCalculate = async () => {
        if (cep.length < 8) return;
        setLoading(true);

        // Simulação de cálculo de frete
        // Em produção, chamaria a API dos Correios ou Melhor Envio
        setTimeout(() => {
            const randomPrice = Math.floor(Math.random() * (40 - 15) + 15);
            const randomDays = Math.floor(Math.random() * (7 - 2) + 2);

            setShippingOption({
                price: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(randomPrice),
                days: randomDays
            });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Truck className="w-5 h-5 text-green-600" />
                <span>Calcular Frete e Prazo</span>
            </div>

            <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Digite seu CEP"
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black focus:ring-2 focus:ring-primary/50 outline-none"
                        value={cep}
                        onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    />
                </div>
                <Button size="sm" onClick={handleCalculate} disabled={loading || cep.length < 8} variant="secondary">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Calcular"}
                </Button>
            </div>

            {shippingOption && (
                <div className="mt-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-t border-dashed border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-300">
                        <span>Frete Normal</span>
                        <div className="text-right">
                            <span className="block font-bold text-gray-900 dark:text-white">{shippingOption.price}</span>
                            <span className="text-xs text-green-600">Chegará em {shippingOption.days} dias úteis</span>
                        </div>
                    </div>
                    <a href="#" className="text-xs text-blue-600 dark:text-blue-400 underline mt-1 block">
                        Ver mais opções de entrega
                    </a>
                </div>
            )}
        </div>
    );
}

"use client";

import { useState } from "react";
import { Button } from "@/frontend/components/ui/Button";
import { Input } from "@/frontend/components/ui/Input";
import { Search, Package } from "lucide-react";

export function FreightSimulator() {
    const [cep, setCep] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSimulate = async () => {
        setLoading(true);
        // Simulation mock for Correios
        await new Promise(r => setTimeout(r, 1000));

        // Simple logic based on region (mock)
        const pricePac = 2550; // R$ 25,50
        const priceSedex = 4290; // R$ 42,90

        setResult({
            pac: { price: pricePac, days: 7 },
            sedex: { price: priceSedex, days: 2 }
        });
        setLoading(false);
    };

    return (
        <div className="glass p-6 rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-6">
                <Package className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold">Simulador de Frete (Correios)</h2>
            </div>
            <div className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="CEP de Destino"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                    />
                    <Button onClick={handleSimulate} disabled={loading || cep.length < 8}>
                        <Search className="w-4 h-4" />
                    </Button>
                </div>

                {result && (
                    <div className="space-y-2 mt-4 text-sm">
                        <div className="flex justify-between p-2 bg-gray-50 dark:bg-zinc-800 rounded">
                            <span>SEDEX ({result.sedex.days} dias)</span>
                            <span className="font-bold">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.sedex.price / 100)}
                            </span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 dark:bg-zinc-800 rounded">
                            <span>PAC ({result.pac.days} dias)</span>
                            <span className="font-bold">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.pac.price / 100)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

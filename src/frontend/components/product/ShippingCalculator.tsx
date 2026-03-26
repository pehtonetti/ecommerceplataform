"use client";

import { useState } from "react";
import { Truck, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import { calculateProductShipping } from "@/backend/actions/shipping-actions";
import { toast } from "sonner";

export function ShippingCalculator({ productId }: { productId: string }) {
    const [cep, setCep] = useState("");
    const [loading, setLoading] = useState(false);
    const [quotes, setQuotes] = useState<any[]>([]);

    const handleCalculate = async () => {
        if (cep.length < 8) return;
        setLoading(true);
        setQuotes([]);

        try {
            const result = await calculateProductShipping(productId, cep);
            if (result.success && result.quotes) {
                setQuotes(result.quotes);
            } else {
                toast.error(result.error || "Erro ao calcular frete");
            }
        } catch (error) {
            toast.error("Falha na conexão");
        } finally {
            setLoading(false);
        }
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

            {quotes.length > 0 && (
                <div className="mt-3 space-y-2">
                    {quotes.map((quote, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-t border-dashed border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-300">
                            <div>
                                <span className="block font-medium text-xs uppercase opacity-70">{quote.company}</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{quote.serviceName}</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-gray-900 dark:text-white">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.price / 100)}
                                </span>
                                <span className="text-xs text-green-600 font-medium">Até {quote.deliveryDays} dias</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

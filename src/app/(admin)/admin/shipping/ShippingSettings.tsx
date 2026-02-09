"use client";

import { useState } from "react";
import { Button } from "@/frontend/components/ui/Button";
import { Input } from "@/frontend/components/ui/Input";
import { Save, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { updateStoreOriginZip } from "@/backend/actions/store-config-actions";

export function ShippingSettings({ initialZip }: { initialZip: string }) {
    const [zip, setZip] = useState(initialZip);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateStoreOriginZip(zip);
            toast.success("CEP de origem atualizado!");
        } catch {
            toast.error("Erro ao atualizar CEP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass p-6 rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-semibold">Origem do Envio</h2>
            </div>
            <div className="space-y-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">CEP de Origem</label>
                    <div className="flex gap-2">
                        <Input
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            placeholder="00000-000"
                        />
                        <Button onClick={handleSave} disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Usado para calcular o frete dos produtos.</p>
                </div>
            </div>
        </div>
    );
}

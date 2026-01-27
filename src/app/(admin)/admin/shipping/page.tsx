import { prisma } from "@/lib/prisma";
import { ShippingSettings } from "./ShippingSettings";
import { FreightSimulator } from "./FreightSimulator";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { Button } from "@/frontend/components/ui/Button";
import { Truck, Settings, MapPin } from "lucide-react";
import { CarrierManager } from "./CarrierManager";

export default async function ShippingPage() {
    const config = await prisma.storeConfig.findFirst();
    const originZip = config?.originZipCode || "17055-270";

    const carriers = await prisma.carrier.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Envio & Logística</h1>
                        <p className="text-muted-foreground">Configure métodos de envio e zonas de entrega.</p>
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.1} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ShippingSettings initialZip={originZip} />
                <FreightSimulator />
            </FadeIn>

            <FadeIn delay={0.2} className="glass p-6 rounded-xl border border-border">
                <CarrierManager carriers={carriers} />
            </FadeIn>
        </div>
    );
}

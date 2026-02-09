"use client";

import { useEffect, useState } from "react";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { MousePointer2, Clock, MapPin, Eye, ShoppingCart, User } from "lucide-react";

export default function UserBehaviorPage({ params }: { params: { id: string } }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock data for user behavior journey
    useEffect(() => {
        setTimeout(() => {
            setLogs([
                { id: 1, action: "product_view", details: { productId: "p1", name: "iPhone 15 Pro" }, timestamp: "18:20", ip: "187.12.33.1" },
                { id: 2, action: "hover", details: { element: "add_to_cart" }, timestamp: "18:21", ip: "187.12.33.1" },
                { id: 3, action: "product_view", details: { productId: "p2", name: "Sony WH-1000XM5" }, timestamp: "18:22", ip: "187.12.33.1" },
                { id: 4, action: "add_to_cart", details: { productId: "p1" }, timestamp: "18:25", ip: "187.12.33.1" },
                { id: 5, action: "exit_intent", details: { lastPage: "/cart" }, timestamp: "18:30", ip: "187.12.33.1" },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <div className="p-10 text-center">Carregando jornada do usuário...</div>;

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Jornada do Usuário</h1>
                            <p className="text-sm text-muted-foreground">ID: {params.id}</p>
                        </div>
                    </div>
                </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Clock className="w-4 h-4" /> Última Atividade
                    </div>
                    <p className="text-xl font-bold">Há 15 minutos</p>
                </div>
                <div className="glass p-6 rounded-2xl border border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" /> Localização Estimada
                    </div>
                    <p className="text-xl font-bold">São Paulo, BR</p>
                </div>
                <div className="glass p-6 rounded-2xl border border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Eye className="w-4 h-4" /> Intenção de Compra
                    </div>
                    <p className="text-xl font-bold text-orange-500">Alta (85%)</p>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-bold">Linha do Tempo de Atividades</h2>
                <div className="relative space-y-4 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-border">
                    {logs.map((log) => (
                        <div key={log.id} className="relative pl-12">
                            <div className={`absolute left-0 w-10 h-10 rounded-full border-4 border-white dark:border-zinc-900 flex items-center justify-center z-10 ${log.action === 'add_to_cart' ? 'bg-green-500 text-white' :
                                log.action === 'product_view' ? 'bg-blue-500 text-white' :
                                    'bg-gray-100 dark:bg-zinc-800 text-zinc-500'
                                }`}>
                                {log.action === 'add_to_cart' ? <ShoppingCart className="w-4 h-4" /> :
                                    log.action === 'product_view' ? <Eye className="w-4 h-4" /> :
                                        <MousePointer2 className="w-4 h-4" />}
                            </div>
                            <div className="glass p-4 rounded-xl border border-border">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold capitalize">{log.action.replace('_', ' ')}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {log.details.name || log.details.productId || log.details.element || log.details.lastPage}
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                                        {log.timestamp}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

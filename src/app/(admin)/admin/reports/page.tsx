"use client";

import { FadeIn } from "@/frontend/components/ui/Motion";
import { Button } from "@/frontend/components/ui/Button";
import { Download, TrendingDown, DollarSign, Users, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ReportsPage() {
    const [period, setPeriod] = useState("30d");

    const handleExport = () => {
        toast.success("Relatório exportado para Excel com sucesso!");
    };

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
                        <p className="text-muted-foreground">Análise detalhada de performance e vendas.</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                        >
                            <option value="7d">Últimos 7 dias</option>
                            <option value="30d">Últimos 30 dias</option>
                            <option value="90d">Últimos 3 meses</option>
                            <option value="1y">Este ano</option>
                        </select>
                        <Button onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Exportar Excel
                        </Button>
                    </div>
                </div>
            </FadeIn>

            {/* KPI Cards */}
            <FadeIn delay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-4">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <span className="text-xs font-medium text-green-600 bg-green-100 rounded-full px-2 py-0.5">+12.5%</span>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Receita Total</p>
                        <h3 className="text-2xl font-bold">R$ 45.231,89</h3>
                    </div>
                </div>
                <div className="glass p-6 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-4">
                        <ShoppingBag className="h-5 w-5 text-blue-500" />
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-0.5">+5.2%</span>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Pedidos</p>
                        <h3 className="text-2xl font-bold">342</h3>
                    </div>
                </div>
                <div className="glass p-6 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-4">
                        <Users className="h-5 w-5 text-purple-500" />
                        <span className="text-xs font-medium text-green-600 bg-green-100 rounded-full px-2 py-0.5">+18%</span>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Novos Clientes</p>
                        <h3 className="text-2xl font-bold">128</h3>
                    </div>
                </div>
                <div className="glass p-6 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-4">
                        <TrendingDown className="h-5 w-5 text-red-500" />
                        <span className="text-xs font-medium text-red-600 bg-red-100 rounded-full px-2 py-0.5">-2.1%</span>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Ticket Médio</p>
                        <h3 className="text-2xl font-bold">R$ 132,25</h3>
                    </div>
                </div>
            </FadeIn>

            {/* Charts Area */}
            <FadeIn delay={0.2} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-xl border border-border lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-6">Vendas no Período</h3>

                    {/* Mock Chart Visualization */}
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {[65, 40, 75, 55, 80, 95, 85, 40, 50, 70, 90, 100].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end gap-2 group">
                                <div
                                    className="bg-primary/80 hover:bg-primary transition-all rounded-t-sm relative group-hover:shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        R$ {(h * 150).toFixed(2)}
                                    </div>
                                </div>
                                <div className="text-xs text-center text-muted-foreground hidden sm:block">
                                    {i + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass p-6 rounded-xl border border-border space-y-6">
                    <h3 className="text-lg font-semibold">Top Produtos</h3>
                    <div className="space-y-4">
                        {[
                            { name: "Smartphone XYZ", sales: 120, revenue: "R$ 12.000" },
                            { name: "Fone Bluetooth", sales: 85, revenue: "R$ 4.250" },
                            { name: "Monitor 4K", sales: 42, revenue: "R$ 8.400" },
                            { name: "Teclado Mecânico", sales: 38, revenue: "R$ 5.700" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.sales} vendas</p>
                                </div>
                                <span className="text-sm font-semibold">{item.revenue}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { BarChart, TrendingUp, Users, ShoppingCart, Eye, MousePointer2, ArrowRight } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import Link from "next/link";

export default function AnalyticsDashboard() {
    const [stats, setStats] = useState({
        views: 12500,
        conversions: 3.2,
        avgTime: "4m 20s",
        bounceRate: "45%",
        topProducts: [
            { id: 1, name: "iPhone 15 Pro", views: 4500, sales: 120 },
            { id: 2, name: "MacBook Air M3", views: 3200, sales: 85 },
            { id: 3, name: "Sony WH-1000XM5", views: 2800, sales: 92 },
        ]
    });

    return (
        <div className="space-y-8 pb-20">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">IA & Analytics</h1>
                        <p className="text-muted-foreground">Monitoramento de comportamento e métricas de conversão.</p>
                    </div>
                </div>
            </FadeIn>

            {/* Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-xl border border-border">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Eye className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Visualizações</p>
                            <p className="text-2xl font-bold">{stats.views.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="glass p-6 rounded-xl border border-border">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Conversão</p>
                            <p className="text-2xl font-bold">{stats.conversions}%</p>
                        </div>
                    </div>
                </div>
                <div className="glass p-6 rounded-xl border border-border">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Tempo Médio</p>
                            <p className="text-2xl font-bold">{stats.avgTime}</p>
                        </div>
                    </div>
                </div>
                <div className="glass p-6 rounded-xl border border-border">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                            <MousePointer2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Taxa de Rejeição</p>
                            <p className="text-2xl font-bold">{stats.bounceRate}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Behavior Insights */}
                <div className="glass p-6 rounded-xl border border-border space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <BarChart className="w-5 h-5" /> Behavior Insights (IA)
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-border">
                            <p className="text-sm font-medium">🛒 Abandono de Carrinho</p>
                            <p className="text-xs text-muted-foreground mt-1">Detectamos que 15% dos usuários abandonam o checkout na etapa de frete.</p>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2">
                                <div className="h-full bg-orange-500 rounded-full" style={{ width: '15%' }}></div>
                            </div>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-border">
                            <p className="text-sm font-medium">🔥 Zonas de Calor (Cliques)</p>
                            <p className="text-xs text-muted-foreground mt-1">O botão "Comprar Agora" tem 4x mais cliques que o "Adicionar ao Carrinho".</p>
                        </div>
                        <Button variant="outline" className="w-full">Exportar Log de Comportamento</Button>
                    </div>
                </div>

                {/* Top Products */}
                <div className="glass p-6 rounded-xl border border-border space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" /> Produtos Mais Desejados
                    </h2>
                    <div className="divide-y divide-border">
                        {stats.topProducts.map(p => (
                            <div key={p.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{p.name}</p>
                                    <p className="text-xs text-muted-foreground">{p.views} visualizações</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">{p.sales} vendas</p>
                                    <p className="text-[10px] text-muted-foreground">{(p.sales / p.views * 100).toFixed(1)}% conv.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Recent User Journeys */}
                <div className="glass p-6 rounded-xl border border-border space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Users className="w-5 h-5" /> Jornadas Recentes
                    </h2>
                    <div className="divide-y divide-border">
                        {[
                            { id: "usr_1", name: "Pedro Silva", lastAction: "Visualizou iPhone 15", status: "quente" },
                            { id: "usr_2", name: "Maria Oliveira", lastAction: "Adicionou ao Carrinho", status: "urgente" },
                            { id: "usr_3", name: "João Santos", lastAction: "Página de Frete", status: "hesitante" },
                        ].map(user => (
                            <div key={user.id} className="py-3 flex justify-between items-center group">
                                <div>
                                    <p className="font-medium text-sm">{user.name}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase">{user.lastAction}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${user.status === 'urgente' ? 'bg-red-100 text-red-600' :
                                        user.status === 'quente' ? 'bg-orange-100 text-orange-600' :
                                            'bg-zinc-100 text-zinc-600'
                                        }`}>
                                        {user.status}
                                    </span>
                                    <Link href={`/admin/users/${user.id}/behavior`}>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

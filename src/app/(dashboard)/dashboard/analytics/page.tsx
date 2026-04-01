"use client";

import { useEffect, useState } from "react";
import { getAnalyticsData } from "@/backend/actions/analytics-actions";
import { 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area 
} from "recharts";
import { TrendingUp, ShoppingBag, Eye, Percent, ArrowUpRight, ArrowDownRight, Filter, Download, ArrowRight } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { motion } from "framer-motion";

interface SalesHistoryItem {
    name: string;
    vendas: number;
}

interface TopProduct {
    name: string;
    vendas: number;
}

interface AnalyticsData {
    stats: {
        revenue: number;
        orders: number;
        views: number;
        conversion: number | string;
    };
    salesHistory: SalesHistoryItem[];
    topProducts: TopProduct[];
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAnalyticsData().then(res => {
            setData(res as AnalyticsData);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) return <div className="p-20 text-center font-black animate-pulse uppercase tracking-widest opacity-40">Processando Inteligência de Dados...</div>;
    if (!data) return null;

    const stats = [
        { label: "Faturamento Bruto", value: `R$ ${data.stats.revenue.toLocaleString()}`, icon: TrendingUp, trend: "+12.5%", color: "indigo" },
        { label: "Total de Pedidos", value: data.stats.orders, icon: ShoppingBag, trend: "+5.2%", color: "emerald" },
        { label: "Visualizações", value: data.stats.views, icon: Eye, trend: "-2.1%", color: "violet" },
        { label: "Taxa de Conversão", value: `${data.stats.conversion}%`, icon: Percent, trend: "+0.8%", color: "amber" },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <FadeIn>
                <div className="flex items-end justify-between mb-8">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black tracking-tightest">Dashboard Analytics</h1>
                        <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Acompanhamento em tempo real da performance da sua loja</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-2xl border-border px-6 h-12 font-black tracking-tight"><Filter className="w-4 h-4 mr-2" /> ÚLTIMOS 30 DIAS</Button>
                        <Button className="rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-black px-6 h-12 font-black tracking-tight"><Download className="w-4 h-4 mr-2" /> EXPORTAR RELATÓRIO</Button>
                    </div>
                </div>
            </FadeIn>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                        <div className="glass p-8 rounded-[32px] border border-border/50 hover:border-indigo-500/30 transition-all group overflow-hidden relative">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500 group-hover:bg-${stat.color}-500 group-hover:text-white transition-all`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {stat.trend} {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest">{stat.label}</h3>
                                <p className="text-3xl font-black tracking-tightest">{stat.value}</p>
                            </div>
                            <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-700">
                                <stat.icon className="w-32 h-32" />
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass p-10 rounded-[48px] border border-border/50 bg-white/40 dark:bg-zinc-900/40 relative">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black tracking-tightest uppercase">Histórico de Faturamento</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                <span className="text-[10px] items-center font-bold uppercase tracking-widest opacity-60">Faturamento Realizado</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.salesHistory}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }} 
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px' }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
                                <Area type="monotone" dataKey="vendas" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass p-10 rounded-[48px] border border-border/50 bg-white/40 dark:bg-zinc-900/40">
                    <h3 className="text-xl font-black tracking-tightest uppercase mb-10">Produtos Top Vendedores</h3>
                    <div className="space-y-8">
                        {data.topProducts.map((p: TopProduct, i: number) => (
                            <div key={i} className="flex items-center gap-6 group">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-xs text-muted-foreground group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                    0{i + 1}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-black truncate max-w-[120px]">{p.name}</span>
                                        <span className="text-xs font-black text-indigo-500">{p.vendas} un.</span>
                                    </div>
                                    <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(p.vendas / data.topProducts[0].vendas) * 100}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="h-full bg-indigo-500 shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">Insight de Inteligência</p>
                        <p className="text-xs font-medium leading-relaxed opacity-60 italic">&quot;Seu item &apos;{data.topProducts[0]?.name}&apos; representa 42% das suas vendas totais. Considere criar um pacote &apos;Buy Together&apos; para aumentar o ticket médio.&quot;</p>
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Recent Activity Feed Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-10">
                <div className="glass p-10 rounded-[48px] border border-border/50">
                    <h3 className="text-xl font-black tracking-tightest uppercase mb-8 flex items-center gap-2">
                        Atividade de Clientes
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    </h3>
                    <div className="space-y-6">
                        {[1,2,3,4].map((n) => (
                            <div key={n} className="flex items-center gap-4 py-4 border-b border-border/30 last:border-0 opacity-60 hover:opacity-100 transition-opacity">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold leading-none">Novo Carrinho Criado — <span className="opacity-40 font-medium">há 12 min</span></p>
                                    <p className="text-[10px] font-medium opacity-60 mt-1">Visitante de São Paulo visualizou o checkout express.</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-zinc-300" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-zinc-900 text-white dark:bg-white dark:text-black p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 space-y-6">
                        <TrendingUp className="w-12 h-12" />
                        <h2 className="text-3xl font-black tracking-tightest leading-tight">Sua loja está performing acima da média do mercado.</h2>
                        <p className="text-md opacity-60 font-medium">Otimizamos o seu LCP em 40% este mês. Isso resultou em um aumento de 15% na retenção de usuários mobile.</p>
                        <Button className="rounded-full px-8 py-6 font-black bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/20">DETALHES DE PERFORMANCE</Button>
                    </div>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                        <TrendingUp className="w-64 h-64" />
                    </div>
                </div>
            </div>
        </div>
    );
}

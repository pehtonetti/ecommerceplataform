"use client";

import { Check, Sparkles, Zap, Shield, Crown } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import { toast } from "sonner";
import { FadeIn } from "@/frontend/components/ui/Motion";

const PLANS = [
    {
        name: "Free",
        id: "free",
        price: 0,
        description: "Ideal para começar seu negócio",
        features: ["Até 10 produtos", "Checkout Simples", "Domínio Simplify", "Suporte via E-mail"],
        icon: Zap,
        color: "zinc"
    },
    {
        name: "Starter",
        id: "starter",
        price: 4900,
        description: "Mais recursos para crescer",
        features: ["Produtos ilimitados", "Checkout Express", "Domínio Personalizado", "IA Assistente (100/mês)", "Analytics Básico"],
        icon: Sparkles,
        color: "indigo",
        popular: true
    },
    {
        name: "Pro",
        id: "pro",
        price: 14900,
        description: "Escala total para grandes lojas",
        features: ["Tudo do Starter", "API Pública Ilimitada", "IA Assistente Ilimitada", "Suporte Prioritário", "Remoção de Fundo de Imagem (IA)", "Multi-usuários"],
        icon: Crown,
        color: "violet"
    }
];

export function PlanSettingsClient({ store }: { store: any }) {

    async function handleSubscribe(planId: string) {
        if (planId === store.plan) {
            return toast.info("Você já está neste plano!");
        }
        
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)), 
            {
                loading: 'Redirecionando para checkout seguro...',
                success: 'Checkout gerado! (Simulação)',
                error: 'Erro ao gerar checkout',
            }
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-12">
            <FadeIn>
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black tracking-tightest">Planos & Assinatura</h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">
                        Escolha o plano ideal para a escala da sua loja
                    </p>
                </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PLANS.map((plan) => (
                    <FadeIn key={plan.id} className="relative group">
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest z-10 shadow-lg shadow-indigo-500/20">
                                Mais Popular
                            </div>
                        )}

                        <div className={`h-full glass p-10 rounded-[48px] border-2 transition-all flex flex-col ${
                            plan.id === store.plan 
                            ? 'border-indigo-500 ring-4 ring-indigo-500/5 bg-indigo-50/10' 
                            : 'border-border/50 hover:border-indigo-300'
                        }`}>
                            <div className="mb-8">
                                <div className={`p-4 w-fit rounded-3xl mb-6 ${
                                    plan.id === 'pro' 
                                    ? 'bg-violet-500/10 text-violet-500' 
                                    : plan.id === 'starter' 
                                    ? 'bg-indigo-500/10 text-indigo-500' 
                                    : 'bg-zinc-500/10 text-zinc-500'
                                }`}>
                                    <plan.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{plan.description}</p>
                            </div>

                            <div className="mb-10 flex items-baseline gap-1">
                                <span className="text-4xl font-black tracking-tightest">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price / 100)}
                                </span>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">/mês</span>
                            </div>

                            <div className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex gap-3 items-center text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                                        <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <Button 
                                className={`w-full py-8 rounded-[24px] font-black text-md tracking-tight ${
                                    plan.id === store.plan 
                                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border-none' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20'
                                }`}
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={plan.id === store.plan}
                            >
                                {plan.id === store.plan ? "PLANO ATUAL" : "ASSINAR AGORA"}
                            </Button>
                        </div>
                    </FadeIn>
                ))}
            </div>

            {store.plan !== 'free' && (
                <div className="glass p-10 rounded-[48px] border border-border/50 bg-indigo-500/5 flex items-center justify-between">
                    <div className="flex gap-6 items-center">
                        <div className="p-5 rounded-3xl bg-indigo-600 text-white">
                            <Shield className="w-10 h-10" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black tracking-tight">Status da sua assinatura</h4>
                            <p className="text-sm font-medium text-muted-foreground">Próxima renovação: **01/05/2026** no valor de R$ 49,00</p>
                        </div>
                    </div>
                    <Button variant="outline" className="rounded-2xl px-10 h-14 font-black tracking-tight border-border hover:bg-white dark:hover:bg-zinc-900 shadow-md">
                        GERENCIAR NA STRIPE
                    </Button>
                </div>
            )}
        </div>
    );
}

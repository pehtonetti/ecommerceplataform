'use client';

import { useState, useEffect } from 'react';
import { 
    CheckCircle2, 
    Circle, 
    Store, 
    Package, 
    Palette, 
    CreditCard, 
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { Button } from '@/frontend/components/ui/Button';
import Link from 'next/link';

interface SetupStep {
    id: string;
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    isCompleted: boolean;
}

interface SetupWizardProps {
    store: any;
    stats: any;
}

export function SetupWizard({ store, stats }: SetupWizardProps) {
    const [steps, setSteps] = useState<SetupStep[]>([]);
    
    useEffect(() => {
        const checkSteps = [
            {
                id: 'name',
                title: 'Nomeie sua loja',
                description: 'Defina o nome e a identidade da sua marca.',
                href: '/dashboard/settings',
                icon: <Store className="w-5 h-5" />,
                isCompleted: !!store.name && store.name !== 'Minha Loja'
            },
            {
                id: 'product',
                title: 'Adicione seu primeiro produto',
                description: 'Cadastre o que você vai vender hoje.',
                href: '/dashboard/products/new',
                icon: <Package className="w-5 h-5" />,
                isCompleted: (stats.products?.total || 0) > 0
            },
            {
                id: 'theme',
                title: 'Personalize as cores',
                description: 'Deixe a loja com a cara da sua marca.',
                href: '/dashboard/settings/appearance',
                icon: <Palette className="w-5 h-5" />,
                isCompleted: !!store.primaryColor && store.primaryColor !== '#6366f1'
            },
            {
                id: 'payment',
                title: 'Configure o pagamento',
                description: 'Ative o PIX para receber suas vendas.',
                href: '/dashboard/settings/payments',
                icon: <CreditCard className="w-5 h-5" />,
                isCompleted: !!store.pixKey
            }
        ];
        setSteps(checkSteps);
    }, [store, stats]);

    const completedCount = steps.filter(s => s.isCompleted).length;
    const progress = (completedCount / steps.length) * 100;

    if (completedCount === steps.length) return null;

    return (
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-border/50 shadow-sm overflow-hidden mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="p-6 md:p-8 border-b border-border/40 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                            <h2 className="text-xl font-bold tracking-tight">Prepare sua loja para vender</h2>
                        </div>
                        <p className="text-muted-foreground text-sm">Siga este guia prático e comece a faturar hoje mesmo.</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{Math.round(progress)}% Concluído</span>
                            <div className="w-32 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-500 transition-all duration-1000 ease-out" 
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{completedCount} de {steps.length} etapas concluídas</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-border/40">
                {steps.map((step, idx) => (
                    <Link 
                        key={step.id} 
                        href={step.href}
                        className={`p-6 group transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/50 relative ${step.isCompleted ? 'opacity-60' : 'opacity-100'}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`mt-1 p-2 rounded-xl border transition-colors ${step.isCompleted ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : 'bg-white dark:bg-zinc-950 border-border group-hover:border-indigo-200 dark:group-hover:border-indigo-500/20'}`}>
                                {step.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
                            </div>
                            <div className="space-y-1 pr-4">
                                <h3 className={`text-sm font-bold leading-none ${step.isCompleted ? 'text-emerald-700 dark:text-emerald-400 line-through decoration-emerald-500/30' : 'text-foreground'}`}>
                                    {step.title}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                            {!step.isCompleted && (
                                <ArrowRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

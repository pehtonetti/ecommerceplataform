"use client";

import { useState, useTransition, useEffect } from "react";
import { registerAndCreateStore, checkSlugAvailability } from "@/backend/actions/onboarding-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Store, ArrowRight, CheckCircle2, Zap, Globe, BarChart3,
    ShoppingBag, Palette, Shield, ChevronRight, Star, Users,
    Package, Loader2, Eye, EyeOff, Check, X
} from "lucide-react";

const CATEGORIES = [
    { value: 'moda', label: 'Moda & Vestuário', emoji: '👗' },
    { value: 'eletronicos', label: 'Eletrônicos', emoji: '📱' },
    { value: 'alimentos', label: 'Alimentos & Bebidas', emoji: '🍕' },
    { value: 'beleza', label: 'Beleza & Cosméticos', emoji: '💄' },
    { value: 'esportes', label: 'Esportes & Fitness', emoji: '⚽' },
    { value: 'casa', label: 'Casa & Decoração', emoji: '🏠' },
    { value: 'livros', label: 'Livros & Cursos', emoji: '📚' },
    { value: 'pets', label: 'Pets', emoji: '🐾' },
    { value: 'geral', label: 'Loja Geral', emoji: '🛍️' },
];

const FEATURES = [
    { icon: <Globe className="w-6 h-6" />, title: 'Sua URL própria', desc: 'sujaloja.simplify.com.br em segundos' },
    { icon: <Palette className="w-6 h-6" />, title: 'Design profissional', desc: 'Temas prontos e customizáveis' },
    { icon: <Zap className="w-6 h-6" />, title: 'Vendas imediatas', desc: 'PIX, cartão e boleto integrados' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Analytics em tempo real', desc: 'Acompanhe vendas e visitas' },
    { icon: <Shield className="w-6 h-6" />, title: 'Segurança total', desc: 'SSL e dados protegidos' },
    { icon: <Users className="w-6 h-6" />, title: 'Gestão de clientes', desc: 'CRM integrado à sua loja' },
];

const STATS = [
    { value: '12.400+', label: 'Lojistas ativos' },
    { value: 'R$ 84M+', label: 'Em vendas processadas' },
    { value: '99.9%', label: 'Uptime garantido' },
    { value: '4.9★', label: 'Avaliação média' },
];

export default function HomePage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [step, setStep] = useState<1 | 2>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [suggestedSlug, setSuggestedSlug] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        storeName: '',
        storeCategory: 'geral',
        whatsapp: '',
    });

    // Auto-generate slug preview when storeName changes
    useEffect(() => {
        if (!formData.storeName) { setSuggestedSlug(''); setSlugStatus('idle'); return; }
        const timer = setTimeout(async () => {
            setSlugStatus('checking');
            const slug = formData.storeName
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
            setSuggestedSlug(slug);
            const result = await checkSlugAvailability(slug);
            setSuggestedSlug(result.slug);
            setSlugStatus(result.available ? 'available' : 'taken');
        }, 600);
        return () => clearTimeout(timer);
    }, [formData.storeName]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.error('Preencha todos os campos'); return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('As senhas não coincidem'); return;
        }
        if (formData.password.length < 6) {
            toast.error('Senha deve ter no mínimo 6 caracteres'); return;
        }
        setStep(2);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.storeName) { toast.error('Nome da loja é obrigatório'); return; }
        if (slugStatus === 'taken') { toast.error('Escolha outro nome, este está em uso'); return; }

        startTransition(async () => {
            const fd = new FormData();
            Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
            const result = await registerAndCreateStore(fd);
            if (result.success) {
                toast.success('🎉 Loja criada com sucesso! Bem-vindo à Simplify!');
                router.push('/dashboard');
            } else {
                toast.error(result.error || 'Erro ao criar sua loja');
                if (result.error?.includes('e-mail')) setStep(1);
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#05050f] text-white overflow-x-hidden">
            {/* ── Animated background ──────────────────────────────────────── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-fuchsia-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* ── Header ───────────────────────────────────────────────────── */}
            <header className="relative z-10 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Store className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            Simplify
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors">
                            Já tenho conta
                        </Link>
                        <a href="#criar-loja" className="text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors font-medium">
                            Criar minha loja
                        </a>
                    </div>
                </div>
            </header>

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <section className="relative z-10 pt-20 pb-16 px-4">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Copy */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                            Plataforma #1 de e-commerce no Brasil
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
                            Crie sua loja
                            <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                online em 2 minutos
                            </span>
                        </h1>

                        <p className="text-lg text-white/60 leading-relaxed max-w-lg">
                            Do cadastro à primeira venda, a Simplify cuida de tudo.
                            Sem mensalidade para começar, sem complicações técnicas.
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            {FEATURES.map((f) => (
                                <div key={f.title} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/20 transition-colors">
                                    <div className="text-indigo-400 mt-0.5 shrink-0">{f.icon}</div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{f.title}</p>
                                        <p className="text-xs text-white/50 mt-0.5">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social proof */}
                        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/5">
                            {STATS.map((s) => (
                                <div key={s.label} className="text-center">
                                    <p className="text-xl font-black text-white">{s.value}</p>
                                    <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div id="criar-loja" className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-violet-500/5 rounded-3xl blur-2xl" />
                        <div className="relative bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                            {/* Step indicator */}
                            <div className="flex items-center gap-3 mb-8">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/40'}`}>
                                    {step > 1 ? <Check className="w-3 h-3" /> : '1'} Sua conta
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/20" />
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/40'}`}>
                                    2 Sua loja
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold mb-1">
                                {step === 1 ? 'Criar minha conta' : 'Configurar minha loja'}
                            </h2>
                            <p className="text-sm text-white/50 mb-6">
                                {step === 1 ? 'Gratuito para sempre. Sem cartão de crédito.' : 'Sua loja estará no ar em segundos.'}
                            </p>

                            <form onSubmit={step === 1 ? handleStep1 : handleSubmit} className="space-y-4">
                                {step === 1 && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Seu nome</label>
                                            <input
                                                id="register-name"
                                                name="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="João Silva"
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">E-mail</label>
                                            <input
                                                id="register-email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="joao@empresa.com.br"
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Senha</label>
                                            <div className="relative">
                                                <input
                                                    id="register-password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="Mínimo 6 caracteres"
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Confirmar senha</label>
                                            <input
                                                id="register-confirm-password"
                                                name="confirmPassword"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Repita a senha"
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                            />
                                        </div>
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Nome da sua loja *</label>
                                            <input
                                                id="store-name"
                                                name="storeName"
                                                type="text"
                                                value={formData.storeName}
                                                onChange={handleChange}
                                                placeholder="Ex: Moda da Maria"
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                            />
                                            {/* Slug preview */}
                                            {suggestedSlug && (
                                                <div className={`mt-2 flex items-center gap-2 text-xs transition-all ${slugStatus === 'available' ? 'text-emerald-400' : slugStatus === 'taken' ? 'text-red-400' : 'text-white/40'}`}>
                                                    {slugStatus === 'checking' && <Loader2 className="w-3 h-3 animate-spin" />}
                                                    {slugStatus === 'available' && <Check className="w-3 h-3" />}
                                                    {slugStatus === 'taken' && <X className="w-3 h-3" />}
                                                    <span>
                                                        {slugStatus === 'checking' && 'Verificando disponibilidade...'}
                                                        {slugStatus === 'available' && `✓ Disponível: ${suggestedSlug}.simplify.com.br`}
                                                        {slugStatus === 'taken' && `✗ Em uso. Tente outro nome.`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Categoria</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {CATEGORIES.map((cat) => (
                                                    <button
                                                        key={cat.value}
                                                        type="button"
                                                        onClick={() => setFormData(p => ({ ...p, storeCategory: cat.value }))}
                                                        className={`p-2.5 rounded-xl border text-left transition-all text-xs ${formData.storeCategory === cat.value
                                                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                                                            : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70'
                                                            }`}
                                                    >
                                                        <div className="text-lg mb-1">{cat.emoji}</div>
                                                        <div className="font-medium leading-tight">{cat.label}</div>
                                                    </button>
                                                ))}
                                            </div>
                                            <input type="hidden" name="storeCategory" value={formData.storeCategory} />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">WhatsApp (opcional)</label>
                                            <input
                                                id="store-whatsapp"
                                                name="whatsapp"
                                                type="text"
                                                value={formData.whatsapp}
                                                onChange={handleChange}
                                                placeholder="(11) 99999-9999"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                            />
                                        </div>
                                    </>
                                )}

                                <button
                                    id="submit-btn"
                                    type="submit"
                                    disabled={isPending || (step === 2 && slugStatus === 'taken')}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPending ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Criando sua loja...</>
                                    ) : step === 1 ? (
                                        <>Continuar <ArrowRight className="w-4 h-4" /></>
                                    ) : (
                                        <>🚀 Criar minha loja gratuitamente</>
                                    )}
                                </button>

                                {step === 2 && (
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-full text-center text-xs text-white/40 hover:text-white/70 transition-colors"
                                    >
                                        ← Voltar
                                    </button>
                                )}
                            </form>

                            {step === 1 && (
                                <p className="mt-4 text-center text-xs text-white/30">
                                    Já tem conta?{' '}
                                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                                        Fazer login
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Testimonials / Social Proof ───────────────────────────────── */}
            <section className="relative z-10 py-20 px-4 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black mb-3">Mais de 12.000 lojistas confiam</h2>
                        <p className="text-white/50">Veja o que nossos clientes dizem sobre a Simplify</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: 'Maria Santos', store: 'Moda da Maria', text: 'Em 3 dias já tinha feito minhas primeiras vendas! A plataforma é super intuitiva.', stars: 5 },
                            { name: 'Carlos Oliveira', store: 'TechGadgets', text: 'Migrei minha loja em 2 horas. O suporte é incrível e a plataforma nunca cai.', stars: 5 },
                            { name: 'Ana Pereira', store: 'Empório Natural', text: 'Faturei R$18.000 no primeiro mês. A Simplify mudou minha vida!', stars: 5 },
                        ].map((t) => (
                            <div key={t.name} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex gap-0.5 mb-3">
                                    {Array(t.stars).fill(0).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-white/70 leading-relaxed mb-4">"{t.text}"</p>
                                <div>
                                    <p className="text-sm font-bold text-white">{t.name}</p>
                                    <p className="text-xs text-white/40">{t.store}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Plans Preview ─────────────────────────────────────────────── */}
            <section className="relative z-10 py-20 px-4 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Comece grátis, cresça quando quiser
                    </div>
                    <h2 className="text-3xl font-black mb-3">Sem risco, sem contrato</h2>
                    <p className="text-white/50 max-w-lg mx-auto mb-12">
                        Plano gratuito para sempre com todas as funcionalidades básicas. 
                        Faça upgrade quando quiser mais poder.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { name: 'Free', price: 'R$ 0/mês', features: ['Até 50 produtos', '1 loja', 'Subdomain Simplify', 'Suporte por e-mail'], popular: false },
                            { name: 'Starter', price: 'R$ 49/mês', features: ['Produtos ilimitados', '1 loja', 'Domínio próprio', 'Suporte prioritário', 'Blog CMS'], popular: true },
                            { name: 'Pro', price: 'R$ 99/mês', features: ['Tudo do Starter', 'Múltiplas lojas', 'API pública', 'Analytics avançado', 'IA integrada'], popular: false },
                        ].map((plan) => (
                            <div key={plan.name} className={`p-6 rounded-2xl border text-left ${plan.popular ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/[0.02] border-white/5'}`}>
                                {plan.popular && <div className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wider">Mais popular</div>}
                                <h3 className="text-xl font-black mb-1">{plan.name}</h3>
                                <p className="text-2xl font-black text-indigo-400 mb-4">{plan.price}</p>
                                <ul className="space-y-2 mb-6">
                                    {plan.features.map(f => (
                                        <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <a href="#criar-loja" className={`block w-full text-center py-2.5 rounded-xl text-sm font-bold transition-all ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white/70'}`}>
                                    Começar agora
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <footer className="relative z-10 border-t border-white/5 py-10 px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                            <Store className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-bold text-white/80">Simplify</span>
                    </div>
                    <p className="text-xs text-white/30">© 2026 Simplify. Todos os direitos reservados.</p>
                    <div className="flex gap-4 text-xs text-white/30">
                        <Link href="/terms" className="hover:text-white/60 transition-colors">Termos</Link>
                        <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacidade</Link>
                        <Link href="/login" className="hover:text-white/60 transition-colors">Login</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

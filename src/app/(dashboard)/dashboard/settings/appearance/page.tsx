'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getStoreConfig, updateStoreAppearance } from '@/backend/actions/store-config-actions';

import { 
    Layout, 
    Palette, 
    Camera, 
    Sparkles, 
    Smartphone, 
    Monitor,
    Check,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/frontend/components/ui/Button';

export default function AppearanceSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [primaryColor, setPrimaryColor] = useState('#6366f1');
    const [theme, setTheme] = useState('minimal');
    const [logoUrl, setLogoUrl] = useState('');
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    useEffect(() => {
        const loadConfig = async () => {
            const res = await getStoreConfig();
            if (res.success && res.config) {
                setPrimaryColor(res.config.primaryColor || '#6366f1');
                setTheme(res.config.theme || 'minimal');
                setLogoUrl(res.config.logoUrl || '');
            } else {
                toast.error('Não foi possível carregar as configurações.');
            }
            setLoading(false);
        };
        loadConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const res = await updateStoreAppearance({
            primaryColor,
            theme,
            logoUrl
        });

        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success('Aparência salva com sucesso!');
        }
        setSaving(false);
    };

    if (loading) return <div className="p-12 text-center animate-pulse font-bold">Carregando Estúdio de Design...</div>;

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-0 -m-8 overflow-hidden">
            {/* Left Column: Controls */}
            <div className="w-full lg:w-[400px] bg-white dark:bg-zinc-950 border-r border-border overflow-y-auto p-8 space-y-10 custom-scrollbar">
                <div>
                    <h1 className="text-2xl font-black tracking-tightest mb-1 flex items-center gap-2">
                        Estúdio Visual
                        <Sparkles className="w-4 h-4 text-indigo-500 fill-current" />
                    </h1>
                    <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Painel de Identidade</p>
                </div>

                <section className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-foreground/70">
                            <Camera className="w-4 h-4" />
                            Logotipo
                        </h2>
                        <div className="space-y-2">
                            <input 
                                type="url"
                                value={logoUrl}
                                onChange={(e) => setLogoUrl(e.target.value)}
                                placeholder="URL da sua logo (png/svg)"
                                className="w-full p-3 rounded-xl border border-border/60 bg-zinc-50 dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                            <p className="text-[10px] text-muted-foreground leading-relaxed">Dica: Use logos com fundo transparente (PNG) para um acabamento profissional.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-foreground/70">
                            <Palette className="w-4 h-4" />
                            Paleta de Cores
                        </h2>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border/40">
                            <input 
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-12 h-12 rounded-xl cursor-pointer border-none p-0 bg-transparent"
                            />
                            <div>
                                <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Cor Primária</span>
                                <span className="font-mono text-sm font-bold">{primaryColor.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-foreground/70">
                            <Layout className="w-4 h-4" />
                            Tema de Base
                        </h2>
                        <div className="grid grid-cols-1 gap-3">
                            {['minimal', 'marketplace', 'boutique'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                                        theme === t 
                                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10' 
                                        : 'border-border hover:border-indigo-300 dark:hover:border-indigo-500/20'
                                    }`}
                                >
                                    <h3 className="text-sm font-bold uppercase tracking-tight mb-1">{t}</h3>
                                    <p className="text-[10px] text-muted-foreground leading-tight">
                                        {t === 'minimal' ? 'Limpo, moderno e focado no produto.' : t === 'marketplace' ? 'Pragmático e botões agressivos.' : 'Elegante, serifado e artístico.'}
                                    </p>
                                    {theme === t && <Check className="w-4 h-4 absolute top-4 right-4 text-indigo-600" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="pt-6 border-t border-border">
                    <Button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-7 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-500/20 gap-2 text-md transition-all active:scale-[0.98]"
                    >
                        {saving ? 'Aplicando...' : (
                            <>
                                <Check className="w-5 h-5" />
                                SALVAR ALTERAÇÕES
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Right Column: Live Preview Mockup */}
            <div className="flex-1 bg-zinc-100 dark:bg-zinc-900/50 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-8 right-8 flex items-center gap-2 p-1 bg-white dark:bg-zinc-950 rounded-xl border border-border shadow-sm z-20">
                    <button 
                        onClick={() => setPreviewMode('desktop')}
                        className={`p-2 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Monitor className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setPreviewMode('mobile')}
                        className={`p-2 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Smartphone className="w-4 h-4" />
                    </button>
                </div>

                {/* The Device Mockup */}
                <div className={`transition-all duration-700 ease-out shadow-2xl relative bg-white dark:bg-zinc-950 border-[12px] border-zinc-950 dark:border-zinc-800 rounded-[40px] overflow-hidden ${previewMode === 'mobile' ? 'w-[320px] h-[600px]' : 'w-full max-w-[90%] aspect-video'}`}>
                    {/* Interior of the store preview */}
                    <div className="h-full flex flex-col font-sans text-zinc-900 dark:text-white bg-white dark:bg-zinc-950">
                        {/* Fake Header */}
                        <header className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo" className="h-6 object-contain" />
                            ) : (
                                <span className={`font-black tracking-tighter ${theme === 'boutique' ? 'font-serif' : ''}`}>SUA LOJA</span>
                            )}
                            <div className="flex gap-3">
                                <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                            </div>
                        </header>

                        {/* Fake Hero/Content */}
                        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
                            <div className={`space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                <div className={`h-40 rounded-3xl overflow-hidden relative group`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 opacity-50" />
                                    <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                                        <div className="space-y-2">
                                            <div className="h-2 w-20 bg-zinc-400 dark:bg-zinc-600 rounded-full mx-auto" />
                                            <div className="h-4 w-40 bg-zinc-900 dark:bg-white rounded-full mx-auto" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className={`h-6 w-32 bg-zinc-900 dark:bg-white rounded-full ${theme === 'boutique' ? 'font-serif' : 'font-black uppercase tracking-widest text-[10px]'}`} />
                                    <div className="h-2 w-full bg-zinc-400 dark:bg-zinc-600 rounded-full" />
                                    <div className="h-2 w-2/3 bg-zinc-400 dark:bg-zinc-600 rounded-full" />
                                </div>

                                <button 
                                    style={{ backgroundColor: primaryColor }}
                                    className={`w-full py-4 rounded-2xl text-white font-black text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2`}
                                >
                                    ADICIONAR AO CARRINHO
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>

                            {/* Fake Product Grid */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="space-y-2">
                                        <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
                                        <div className="h-2 w-20 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                                        <div className="h-2 w-10 bg-zinc-900 dark:bg-white rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </main>
                    </div>
                </div>

                <p className="mt-8 text-xs text-muted-foreground flex items-center gap-2 font-bold uppercase tracking-widest opacity-60">
                    <ArrowRight className="w-3 h-3 animate-pulse" />
                    Preview interativo em tempo real
                </p>
            </div>
        </div>
    );
}


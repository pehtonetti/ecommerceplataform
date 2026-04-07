'use client'

import { useState, useEffect } from 'react';
import { getStoreConfig, updateStoreAppearance } from '@/backend/actions/store-config-actions';
import { Save, Layout, Palette, Type, Check, RefreshCw, Eye } from 'lucide-react';
import { toast } from 'sonner';

type LayoutSection = {
  id: string;
  active: boolean;
  title: string;
};

type ThemeConfig = {
  fontFamily: 'Inter' | 'Roboto' | 'Playfair' | 'Outfit';
  borderRadius: 'none' | 'rounded-md' | 'rounded-xl' | 'rounded-3xl';
  productCardStyle: 'minimal' | 'bordered' | 'shadowed' | 'glass';
  showAddToCartOnCard: boolean;
};

type HomeLayoutConfig = {
  theme: ThemeConfig;
  sections: LayoutSection[];
};

const defaultLayout: HomeLayoutConfig = {
  theme: {
    fontFamily: 'Inter',
    borderRadius: 'rounded-xl',
    productCardStyle: 'shadowed',
    showAddToCartOnCard: true,
  },
  sections: [
    { id: 'hero', active: true, title: 'Banners de Destaque' },
    { id: 'trending', active: true, title: 'Mais Vendidos' },
    { id: 'new-arrivals', active: true, title: 'Novidades' },
    { id: 'promo', active: true, title: 'Ofertas Imperdíveis' },
    { id: 'blog', active: true, title: 'Nosso Blog' },
    { id: 'benefits', active: true, title: 'Benefícios' },
  ]
};

export default function AppearancePage() {
  const [config, setConfig] = useState<HomeLayoutConfig>(defaultLayout);
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const result = await getStoreConfig();
      if (result.success && result.config) {
        setPrimaryColor(result.config.primaryColor || '#6366f1');
        if (result.config.homeLayout) {
          try {
            const parsed = JSON.parse(result.config.homeLayout);
            setConfig(parsed);
          } catch (e) {
            console.error("Malformatted layout JSON", e);
          }
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateStoreAppearance({
      primaryColor,
      homeLayout: JSON.stringify(config)
    });

    if (result.success) {
      toast.success('Página inicial atualizada com sucesso!');
    } else {
      toast.error('Erro ao salvar configurações');
    }
    setSaving(false);
  };

  const toggleSection = (id: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, active: !s.active } : s)
    }));
  };

  const updateSectionTitle = (id: string, title: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, title } : s)
    }));
  };

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setConfig(prev => ({
      ...prev,
      theme: { ...prev.theme, ...updates }
    }));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Palette className="w-6 h-6 text-indigo-600" />
            Personalizar Aparência
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Ajuste as cores, fontes e módulos da sua vitrine principal.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
        >
          {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Editor de Estilos */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-100 mb-2">
              <Type className="w-5 h-5 text-indigo-500" /> Identidade Visual
            </div>

            {/* Cor Primária */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Cor da Marca (Botões e Destaques)</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="color" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0 overflow-hidden" 
                />
                <input 
                  type="text" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 font-mono text-sm"
                />
              </div>
            </div>

            {/* Tipografia */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Fonte do Site</label>
              <div className="grid grid-cols-2 gap-3">
                {['Inter', 'Roboto', 'Playfair', 'Outfit'].map((font) => (
                  <button
                    key={font}
                    onClick={() => updateTheme({ fontFamily: font as any })}
                    className={`p-3 text-left border rounded-xl transition-all ${config.theme.fontFamily === font ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700' : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50'}`}
                  >
                    <span className="block font-bold" style={{ fontFamily: font }}>{font}</span>
                    <span className="text-xs opacity-60">The quick brown fox</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bordas */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Arredondamento dos Elementos</label>
              <div className="grid grid-cols-4 gap-2">
                {(['none', 'rounded-md', 'rounded-xl', 'rounded-3xl'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => updateTheme({ borderRadius: r })}
                    className={`py-2 px-1 text-xs font-bold border rounded-lg transition-all ${config.theme.borderRadius === r ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50'}`}
                  >
                    {r === 'none' ? 'Reto' : r === 'rounded-md' ? 'Médio' : r === 'rounded-xl' ? 'Grande' : 'Circular'}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-100 mb-2">
              <Layout className="w-5 h-5 text-indigo-500" /> Estilo da Vitrine
            </div>

            {/* Cards de Produto */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Design do Card de Produto</label>
              <div className="grid grid-cols-2 gap-4">
                {(['minimal', 'bordered', 'shadowed', 'glass'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateTheme({ productCardStyle: s })}
                    className={`p-4 rounded-xl border text-left transition-all ${config.theme.productCardStyle === s ? 'border-indigo-600 shadow-md ring-2 ring-indigo-100' : 'border-zinc-200 dark:border-zinc-700'}`}
                  >
                    <div className={`w-full h-20 mb-3 rounded-lg flex items-end p-2 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden`}>
                      <div className={`w-1/2 h-2/3 bg-white dark:bg-zinc-700 ${config.theme.borderRadius} ${s === 'shadowed' ? 'shadow-lg' : ''} ${s === 'bordered' ? 'border border-zinc-300' : ''} ${s === 'glass' ? 'backdrop-blur-sm bg-white/40' : ''}`}></div>
                      {s === 'minimal' && <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-zinc-300"></div>}
                    </div>
                    <span className="block text-sm font-bold capitalize">{s === 'minimal' ? 'Mínimo' : s === 'bordered' ? 'Com borda' : s === 'shadowed' ? 'Com sombra' : 'Vidro (Glass)'}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={config.theme.showAddToCartOnCard} 
                  onChange={(e) => updateTheme({ showAddToCartOnCard: e.target.checked })}
                  className="w-5 h-5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">Mostrar botão de comprar no card</span>
              </div>
              <Eye className="w-4 h-4 text-zinc-400" />
            </div>
          </section>
        </div>

        {/* Gerenciamento de Seções da Home */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              <Layout className="w-5 h-5 text-indigo-500" /> Organização da Página Inicial
            </div>

            <div className="space-y-4">
              {config.sections.map((section) => (
                <div 
                  key={section.id} 
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all ${section.active ? 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900' : 'border-transparent bg-zinc-50 dark:bg-zinc-800/50 opacity-60'}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button 
                      onClick={() => toggleSection(section.id)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${section.active ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${section.active ? 'left-7' : 'left-1'}`}></div>
                    </button>
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={section.title}
                        disabled={!section.active}
                        onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                        className="bg-transparent border-0 p-0 text-sm font-bold focus:ring-0 w-full"
                      />
                      <span className="text-[10px] uppercase tracking-widest text-zinc-400 block">ID: {section.id}</span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg ${section.active ? 'bg-green-50 text-green-600' : 'bg-zinc-100 text-zinc-400'}`}>
                    {section.active ? <Check className="w-4 h-4" /> : <Layout className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
              <p className="text-xs text-indigo-600 dark:text-indigo-400 leading-relaxed">
                <strong>Dica:</strong> Você pode renomear os títulos das seções para algo mais atraente. Por exemplo, em vez de "Novidades", use "Recém Chegados em Eletrônicos".
              </p>
            </div>
          </section>

          {/* Preview Rápido */}
          <section className="bg-zinc-900 p-8 rounded-3xl text-white overflow-hidden relative">
            <h3 className="text-lg font-bold mb-4 opacity-50 flex items-center gap-2">
              <Eye className="w-4 h-4" /> Preview do Card (Modelo)
            </h3>

            <div 
              className={`bg-white text-zinc-900 p-4 transition-all mx-auto max-w-[240px]
                ${config.theme.borderRadius} 
                ${config.theme.productCardStyle === 'shadowed' ? 'shadow-2xl shadow-white/10' : ''}
                ${config.theme.productCardStyle === 'bordered' ? 'border border-zinc-200' : ''}
                ${config.theme.productCardStyle === 'glass' ? 'bg-white/90 backdrop-blur-md' : ''}
              `}
              style={{ fontFamily: config.theme.fontFamily }}
            >
              <div className="aspect-square bg-zinc-100 rounded-lg mb-4 flex items-center justify-center font-bold text-zinc-300">IMAGEM</div>
              <div className="h-4 bg-zinc-100 rounded w-2/3 mb-2"></div>
              <div className="h-6 bg-zinc-100 rounded w-1/2 mb-4"></div>
              
              {config.theme.showAddToCartOnCard && (
                <div 
                  className={`w-full py-2 flex items-center justify-center text-xs font-bold text-white transition-all`}
                  style={{ backgroundColor: primaryColor, borderRadius: '4px' }}
                >
                  Adicionar ao Carrinho
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

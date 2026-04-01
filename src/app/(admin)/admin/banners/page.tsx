'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/frontend/components/ui/Button";
import { Input } from "@/frontend/components/ui/Input";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { Save, Plus, Trash2, Edit2, Check, X, MoveUp, MoveDown, Image as ImageIcon, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface Banner {
    id: string;
    title: string;
    subtitle: string | null;
    imageUrl: string;
    link: string;
    active: boolean;
    order: Int;
}

type Int = number;

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/banners');
            if (res.ok) {
                const data = await res.json();
                setBanners(data);
            }
        } catch (error) {
            toast.error('Erro ao carregar banners');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBanner?.title || !editingBanner?.imageUrl) {
            toast.error('Título e URL da Imagem são obrigatórios');
            return;
        }

        setIsSaving(true);
        try {
            const isNew = !editingBanner.id;
            const url = isNew ? '/api/admin/banners' : `/api/admin/banners/${editingBanner.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingBanner),
            });

            if (res.ok) {
                toast.success(isNew ? 'Banner criado!' : 'Banner atualizado!');
                setEditingBanner(null);
                fetchBanners();
            } else {
                toast.error('Erro ao salvar banner');
            }
        } catch (error) {
            toast.error('Erro de rede');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja realmente excluir este banner?')) return;

        try {
            const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Banner excluído');
                fetchBanners();
            }
        } catch (error) {
            toast.error('Erro ao excluir');
        }
    };

    const toggleActive = async (banner: Banner) => {
        try {
            const res = await fetch(`/api/admin/banners/${banner.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...banner, active: !banner.active }),
            });
            if (res.ok) {
                fetchBanners();
            }
        } catch (error) {
            toast.error('Erro ao atualizar status');
        }
    };

    if (loading && banners.length === 0) {
        return <div className="p-8 text-center">Carregando banners...</div>;
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Banners</h1>
                        <p className="text-muted-foreground">Adicione ou altere os banners promocionais da página inicial.</p>
                    </div>
                    <Button onClick={() => setEditingBanner({ title: '', subtitle: '', imageUrl: '', link: '/', active: true, order: banners.length })}>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Banner
                    </Button>
                </div>
            </FadeIn>

            {/* Editor Form */}
            {editingBanner && (
                <FadeIn>
                    <div className="glass p-6 rounded-xl border border-primary/20 bg-primary/5 shadow-xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            {editingBanner.id ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            {editingBanner.id ? 'Editar Banner' : 'Novo Banner'}
                        </h2>
                        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Título do Banner</label>
                                    <Input 
                                        value={editingBanner.title} 
                                        onChange={e => setEditingBanner({...editingBanner, title: e.target.value})}
                                        placeholder="Ex: Promoção de Natal"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subtítulo (Opcional)</label>
                                    <Input 
                                        value={editingBanner.subtitle || ''} 
                                        onChange={e => setEditingBanner({...editingBanner, subtitle: e.target.value})}
                                        placeholder="Ex: Até 50% de desconto"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Link de Destino</label>
                                    <Input 
                                        value={editingBanner.link} 
                                        onChange={e => setEditingBanner({...editingBanner, link: e.target.value})}
                                        placeholder="/search?category=notebooks"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">URL da Imagem</label>
                                    <div className="flex gap-2">
                                        <Input 
                                            value={editingBanner.imageUrl} 
                                            onChange={e => setEditingBanner({...editingBanner, imageUrl: e.target.value})}
                                            placeholder="https://..."
                                            required
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Recomendado: 1200x400px ou superior.
                                    </p>
                                </div>

                                {editingBanner.imageUrl && (
                                    <div className="relative aspect-[3/1] rounded-lg overflow-hidden border border-border bg-black/5">
                                        <img 
                                            src={editingBanner.imageUrl} 
                                            alt="Preview" 
                                            className="object-contain w-full h-full"
                                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/1200x400?text=Erro+na+Imagem')}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-border">
                                <Button type="button" variant="ghost" onClick={() => setEditingBanner(null)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? 'Salvando...' : 'Salvar Banner'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </FadeIn>
            )}

            {/* Banners List */}
            <div className="grid gap-6">
                {banners.length === 0 ? (
                    <div className="text-center py-20 glass rounded-2xl border border-dashed border-border text-muted-foreground">
                        Nenhum banner cadastrado. Clique em &quot;Novo Banner&quot; para começar.
                    </div>
                ) : (
                    banners.map((banner, index) => (
                        <FadeIn key={banner.id} delay={index * 0.05}>
                            <div className={`glass p-4 rounded-2xl border transition-all ${banner.active ? 'border-border' : 'border-zinc-200 opacity-60'}`}>
                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                    {/* Preview Container */}
                                    <div className="w-full md:w-64 aspect-[3/1] relative rounded-xl overflow-hidden bg-zinc-900 border border-border shadow-inner flex-shrink-0">
                                        <img 
                                            src={banner.imageUrl} 
                                            alt={banner.title}
                                            className="object-cover w-full h-full"
                                        />
                                        {!banner.active && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <span className="bg-black/80 text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-widest">Inativo</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Container */}
                                    <div className="flex-1 space-y-2 text-center md:text-left">
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <h3 className="text-lg font-bold">{banner.title}</h3>
                                            <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-muted-foreground">#{banner.order}</span>
                                        </div>
                                        {banner.subtitle && <p className="text-sm text-muted-foreground">{banner.subtitle}</p>}
                                        <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><LinkIcon className="w-3 h-3" /> {banner.link}</span>
                                        </div>
                                    </div>

                                    {/* Actions Container */}
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => toggleActive(banner)}
                                            className={banner.active ? "text-green-500 hover:text-green-600" : "text-zinc-400"}
                                            title={banner.active ? "Desativar" : "Ativar"}
                                        >
                                            {banner.active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => setEditingBanner(banner)}>
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(banner.id)} className="text-red-500 hover:text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    )
                ))}
            </div>
        </div>
    );
}

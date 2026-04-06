import { getAllBanners } from "@/backend/actions/banner-actions";
import { Button } from "@/frontend/components/ui/Button";
import { Plus, Image as ImageIcon, Eye, EyeOff, Trash2, Link2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BannerActions } from "./BannerActions";
import { CreateBannerButton } from "./CreateBannerButton";

export default async function BannersDashboardPage() {
    const result = await getAllBanners();
    const banners = result.success && 'banners' in result ? result.banners : [];
    const active = banners.filter(b => b.active).length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Gerencie os banners e destaques da página inicial da sua loja.
                    </p>
                </div>
                <CreateBannerButton />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div className="p-4 rounded-xl border bg-card shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-xl font-bold">{banners.length}</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl border bg-card shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Eye className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Ativos</p>
                        <p className="text-xl font-bold">{active}</p>
                    </div>
                </div>
            </div>

            {/* Banner Grid */}
            {banners.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-2xl border bg-card text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Nenhum banner criado</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-6">
                        Banners ajudam a destacar promoções e novidades na página inicial da sua loja.
                    </p>
                    <CreateBannerButton />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {banners.map((banner) => (
                        <div key={banner.id} className={`rounded-2xl border bg-card overflow-hidden shadow-sm transition-all ${!banner.active ? 'opacity-60' : ''}`}>
                            <div className="relative h-48 bg-muted">
                                <Image
                                    src={banner.imageUrl}
                                    alt={banner.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2 right-2 flex gap-1.5">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${banner.active ? 'bg-emerald-500 text-white' : 'bg-zinc-500 text-white'}`}>
                                        {banner.active ? 'Ativo' : 'Inativo'}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-black/60 text-white">
                                        #{banner.order}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold truncate">{banner.title}</h3>
                                {banner.subtitle && (
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">{banner.subtitle}</p>
                                )}
                                <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground font-mono">
                                    <Link2 className="w-3 h-3" /> {banner.link}
                                </div>
                                <BannerActions bannerId={banner.id} active={banner.active} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

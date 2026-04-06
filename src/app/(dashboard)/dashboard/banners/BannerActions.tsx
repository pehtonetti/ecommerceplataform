"use client";

import { useTransition } from "react";
import { toggleBannerActive, deleteBanner } from "@/backend/actions/banner-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/frontend/components/ui/Button";
import { Eye, EyeOff, Trash2, Loader2 } from "lucide-react";

export function BannerActions({ bannerId, active }: { bannerId: string; active: boolean }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggle = () => {
        startTransition(async () => {
            const result = await toggleBannerActive(bannerId, !active);
            if (result.success) {
                toast.success(active ? 'Banner desativado' : 'Banner ativado');
                router.refresh();
            } else {
                toast.error(result.error || 'Erro ao atualizar banner');
            }
        });
    };

    const handleDelete = () => {
        if (!confirm('Remover este banner?')) return;
        startTransition(async () => {
            const result = await deleteBanner(bannerId);
            if (result.success) {
                toast.success('Banner removido');
                router.refresh();
            } else {
                toast.error(result.error || 'Erro ao remover banner');
            }
        });
    };

    return (
        <div className="flex items-center gap-2 mt-3">
            <Button variant="outline" size="sm" onClick={handleToggle} disabled={isPending} className="flex-1 text-xs">
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : active ? <><EyeOff className="w-3.5 h-3.5 mr-1" /> Desativar</> : <><Eye className="w-3.5 h-3.5 mr-1" /> Ativar</>}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending} className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="w-3.5 h-3.5" />
            </Button>
        </div>
    );
}

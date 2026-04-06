"use client";

import { useTransition } from "react";
import { toggleCouponActive, deleteCoupon } from "@/backend/actions/coupon-merchant-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/frontend/components/ui/Button";
import { Check, X, Trash2, Loader2 } from "lucide-react";

export function CouponActions({ couponId, active }: { couponId: string; active: boolean }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggle = () => {
        startTransition(async () => {
            const result = await toggleCouponActive(couponId, !active);
            if (result.success) {
                toast.success(active ? 'Cupom desativado' : 'Cupom ativado');
                router.refresh();
            } else {
                toast.error(result.error || 'Erro ao atualizar cupom');
            }
        });
    };

    const handleDelete = () => {
        if (!confirm('Excluir este cupom permanentemente?')) return;
        startTransition(async () => {
            const result = await deleteCoupon(couponId);
            if (result.success) {
                toast.success('Cupom excluído');
                router.refresh();
            } else {
                toast.error(result.error || 'Erro ao excluir cupom');
            }
        });
    };

    return (
        <div className="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="sm" onClick={handleToggle} disabled={isPending} className={`h-8 px-2.5 text-xs ${active ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-emerald-50 hover:text-emerald-600'}`}>
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : active ? <><X className="w-3.5 h-3.5 mr-1" /> Desativar</> : <><Check className="w-3.5 h-3.5 mr-1" /> Ativar</>}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending} className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="w-3.5 h-3.5" />
            </Button>
        </div>
    );
}

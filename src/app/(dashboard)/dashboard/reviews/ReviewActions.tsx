"use client";

import { useTransition } from "react";
import { approveReview, rejectReview, deleteReview } from "@/backend/actions/review-merchant-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/frontend/components/ui/Button";
import { ThumbsUp, ThumbsDown, Trash2, Loader2 } from "lucide-react";

export function ReviewActions({ reviewId, approved }: { reviewId: string; approved: boolean }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleApprove = () => {
        startTransition(async () => {
            const result = await approveReview(reviewId);
            if (result.success) { toast.success('Avaliação aprovada'); router.refresh(); }
            else toast.error(result.error);
        });
    };

    const handleReject = () => {
        startTransition(async () => {
            const result = await rejectReview(reviewId);
            if (result.success) { toast.success('Avaliação rejeitada'); router.refresh(); }
            else toast.error(result.error);
        });
    };

    const handleDelete = () => {
        if (!confirm('Excluir esta avaliação?')) return;
        startTransition(async () => {
            const result = await deleteReview(reviewId);
            if (result.success) { toast.success('Avaliação excluída'); router.refresh(); }
            else toast.error(result.error);
        });
    };

    return (
        <div className="flex items-center gap-1 shrink-0">
            {!approved && (
                <Button variant="ghost" size="sm" onClick={handleApprove} disabled={isPending} className="h-8 px-2.5 text-xs hover:bg-emerald-50 hover:text-emerald-600">
                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><ThumbsUp className="w-3.5 h-3.5 mr-1" /> Aprovar</>}
                </Button>
            )}
            {approved && (
                <Button variant="ghost" size="sm" onClick={handleReject} disabled={isPending} className="h-8 px-2.5 text-xs hover:bg-amber-50 hover:text-amber-600">
                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><ThumbsDown className="w-3.5 h-3.5 mr-1" /> Ocultar</>}
                </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending} className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="w-3.5 h-3.5" />
            </Button>
        </div>
    );
}

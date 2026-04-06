"use client";

import { useState, useTransition } from "react";
import { togglePostPublished, deletePost } from "@/backend/actions/blog-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";

export function BlogPostActions({ postId, published }: { postId: string; published: boolean }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggle = () => {
        startTransition(async () => {
            const result = await togglePostPublished(postId, !published);
            if (result.success) {
                toast.success(published ? 'Post movido para rascunho' : 'Post publicado!');
                router.refresh();
            } else {
                toast.error(result.error || 'Erro ao atualizar post');
            }
        });
    };

    const handleDelete = () => {
        if (!confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.')) return;
        startTransition(async () => {
            const result = await deletePost(postId);
            if (result.success) {
                toast.success('Post excluído');
                router.refresh();
            } else {
                toast.error(result.error || 'Erro ao excluir post');
            }
        });
    };

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                disabled={isPending}
                className={`h-8 w-8 p-0 ${published ? 'hover:bg-amber-50 hover:text-amber-600' : 'hover:bg-emerald-50 hover:text-emerald-600'}`}
                title={published ? 'Despublicar' : 'Publicar'}
            >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isPending}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                title="Excluir post"
            >
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </div>
    );
}

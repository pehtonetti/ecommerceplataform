'use client';

import { deleteUser } from "@/backend/actions/user-actions";
import { Button } from "@/frontend/components/ui/Button";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

export function DeleteUserButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
            setIsDeleting(true);
            await deleteUser(id);
            setIsDeleting(false);
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
    )
}

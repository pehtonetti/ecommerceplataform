'use client';

import { Button } from "@/frontend/components/ui/Button";
import { Input } from "@/frontend/components/ui/Input";
import { useState } from "react";

interface UserFormProps {
    action: (formData: FormData) => void;
    initialData?: {
        name: string;
        email: string;
        role: string;
    }
    isEditing?: boolean;
}

export default function UserForm({ action, initialData, isEditing = false }: UserFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        await action(formData);
        setIsLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl glass p-6 rounded-xl border border-border">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Nome Completo</label>
                    <Input name="name" required defaultValue={initialData?.name} placeholder="João Silva" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input name="email" type="email" required defaultValue={initialData?.email} placeholder="joao@email.com" />
                </div>

                {!isEditing && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Senha</label>
                        <Input name="password" type="password" required placeholder="******" />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium">Perfil de Acesso</label>
                    <select
                        name="role"
                        defaultValue={initialData?.role || 'customer'}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="customer">Cliente</option>
                        <option value="editor">Funcionário/Editor</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="ghost" onClick={() => window.history.back()}>Cancelar</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Usuário'}</Button>
            </div>
        </form>
    )
}

import { prisma } from "@/lib/prisma";
import { Button } from "@/frontend/components/ui/Button";
import { Plus, User, Shield, Briefcase } from "lucide-react";
import Link from "next/link";
import { DeleteUserButton } from "./DeleteButton";

const roleMap: Record<string, { label: string, icon: any, color: string }> = {
    customer: { label: 'Cliente', icon: User, color: 'text-blue-500 bg-blue-500/10' },
    editor: { label: 'Funcionário', icon: Briefcase, color: 'text-orange-500 bg-orange-500/10' },
    admin: { label: 'Administrador', icon: Shield, color: 'text-red-500 bg-red-500/10' },
};

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
                    <p className="text-muted-foreground">Gerencie clientes, funcionários e administradores.</p>
                </div>
                <Link href="/admin/users/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Usuário
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border border-border">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Nome</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Função</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Data Cadastro</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {(users || []).map(user => {
                                const RoleIcon = roleMap[user.role]?.icon || User;
                                const roleStyle = roleMap[user.role]?.color || '';

                                return (
                                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">{user.name}</td>
                                        <td className="p-4 align-middle">{user.email}</td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${roleStyle}`}>
                                                <RoleIcon className="h-3 w-3" />
                                                {roleMap[user.role]?.label || user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="p-4 align-middle text-right flex justify-end gap-2">
                                            <Link href={`/admin/users/${user.id}`}>
                                                <Button variant="ghost" size="sm">Editar</Button>
                                            </Link>
                                            <DeleteUserButton id={user.id} />
                                        </td>
                                    </tr>
                                )
                            })}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                        Nenhum usuário encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

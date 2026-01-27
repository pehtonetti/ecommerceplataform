import { prisma } from "@/lib/prisma";
import { Button } from "@/frontend/components/ui/Button";
import { User, Search } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/frontend/components/ui/Motion";

export default async function CustomersPage() {
    // Busca apenas clientes
    const customers = await prisma.user.findMany({
        where: { role: 'customer' },
        orderBy: { createdAt: 'desc' },
        take: 20
    });

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
                        <p className="text-muted-foreground">Gerencie sua base de clientes.</p>
                    </div>
                    {/* Reutilizando a rota de criação de usuário */}
                    <Link href="/admin/users/new">
                        <Button>Novo Cliente</Button>
                    </Link>
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                <div className="glass p-4 rounded-xl border border-border mb-6 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input className="w-full pl-10 h-10 rounded-md border border-input bg-background/50" placeholder="Buscar por nome ou email..." />
                    </div>
                </div>

                <div className="rounded-md border border-border">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b bg-muted/30">
                                <th className="h-12 px-4 align-middle font-medium">Nome</th>
                                <th className="h-12 px-4 align-middle font-medium">Email</th>
                                <th className="h-12 px-4 align-middle font-medium">Desde</th>
                                <th className="h-12 px-4 align-middle font-medium text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{customer.name}</td>
                                    <td className="p-4 align-middle">{customer.email}</td>
                                    <td className="p-4 align-middle">{new Date(customer.createdAt).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-4 align-middle text-right">
                                        <Link href={`/admin/users/${customer.id}`}>
                                            <Button variant="ghost" size="sm">Ver Detalhes</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <User className="h-8 w-8 opacity-50" />
                                            <p>Nenhum cliente encontrado.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </FadeIn>
        </div>
    );
}

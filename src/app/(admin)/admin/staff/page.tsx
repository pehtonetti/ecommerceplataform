import { prisma } from "@/lib/prisma";
import { Button } from "@/frontend/components/ui/Button";
import { Shield, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/frontend/components/ui/Motion";

export default async function StaffPage() {
    // Busca admins e editores
    const staff = await prisma.user.findMany({
        where: {
            role: { in: ['admin', 'editor'] }
        },
        orderBy: { role: 'asc' }
    });

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Equipe & Permissões</h1>
                        <p className="text-muted-foreground">Gerencie o acesso administrativo da loja.</p>
                    </div>
                    <Link href="/admin/users/new">
                        <Button>
                            <Shield className="mr-2 h-4 w-4" />
                            Novo Membro
                        </Button>
                    </Link>
                </div>
            </FadeIn>

            <FadeIn delay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map(member => (
                    <div key={member.id} className="glass p-6 rounded-xl border border-border flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                {member.name.charAt(0).toUpperCase()}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${member.role === 'admin'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                {member.role === 'admin' ? 'Administrador' : 'Editor'}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-border flex justify-end">
                            <Link href={`/admin/users/${member.id}`}>
                                <Button variant="outline" size="sm">Gerenciar Acesso</Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </FadeIn>
        </div>
    );
}

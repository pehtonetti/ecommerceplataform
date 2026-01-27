import { updateUser } from "@/backend/actions/user-actions";
import UserForm from "../UserForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id: id }
  });

  if (!user) {
    notFound();
  }

  const updateAction = updateUser.bind(null, user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Usuário</h1>
        <p className="text-muted-foreground">Alterar permissões e dados de {user.name}.</p>
      </div>

      <UserForm
        action={updateAction}
        initialData={user}
        isEditing={true}
      />
    </div>
  );
}

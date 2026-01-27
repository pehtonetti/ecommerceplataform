import { createUser } from "@/backend/actions/user-actions";
import UserForm from "../UserForm";

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Usuário</h1>
        <p className="text-muted-foreground">Cadastre um novo cliente, funcionário ou administrador.</p>
      </div>

      <UserForm action={createUser} />
    </div>
  );
}

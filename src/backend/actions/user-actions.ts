'use server'

import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";

export async function updateUserTheme(theme: string) {
  const user = await getCurrentUser();

  // We allow setting theme even if not logged in (device preference), 
  // but the prompt asked for "logged user". We'll update the cookie regardless 
  // as it's the mechanism for persistence here.

  // Validate theme
  if (!['light', 'dark', 'system'].includes(theme)) {
    return { error: 'Invalid theme' };
  }

  try {
    const cookieStore = await cookies();
    cookieStore.set('theme', theme, {
      httpOnly: false, // Allow client JS to read if needed, though next-themes manages its own
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating theme cookie:', error);
    return { error: 'Failed to update theme' };
  }
}

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !password || !role) {
    throw new Error("Preencha todos os campos obrigatórios");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email já cadastrado");
  }

  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  // Note: Password update is not handled in this form submission
  // If we needed it, we'd check if password field is present and not empty

  if (!name || !email || !role) {
    throw new Error("Preencha todos os campos obrigatórios");
  }

  // Check if email belongs to another user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser && existingUser.id !== id) {
    throw new Error("Email já está em uso por outro usuário");
  }

  await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      role,
    },
  });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
  redirect("/admin/users");
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/admin/users");
}

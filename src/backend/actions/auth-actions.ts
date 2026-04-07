'use server'

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/crypto";
import { createSession, destroySession } from "@/backend/lib/auth";

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { success: false, error: 'Preencha todos os campos.' };
    }

    try {
        // Find user - only fetch needed fields for performance
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
            }
        });

        if (!user) {
            return { success: false, error: 'Email ou senha inválidos.' };
        }

        // Verify password using bcrypt
        const isValidPassword = await verifyPassword(password, user.password);

        if (!isValidPassword) {
            return { success: false, error: 'Email ou senha inválidos.' };
        }

        // Cria sessão segura com token aleatório no banco (não armazena userId no cookie)
        await createSession(user.id);

        // Cookie de role para fast-path no middleware (validação real é sempre pelo banco)
        const cookieStore = await cookies();
        cookieStore.set('user_role', user.role, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 30 * 24 * 60 * 60,
        });

        // Return success with redirect URL instead of redirecting directly
        // This allows the client to handle the redirect smoothly
        let redirectUrl = '/';
        if (user.role === 'admin' || user.role === 'editor') {
            redirectUrl = '/admin';
        } else if (user.role === 'merchant') {
            redirectUrl = '/dashboard';
        }

        return {
            success: true,
            redirectUrl,
            message: 'Login realizado com sucesso!'
        };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
    }
}

export async function logout() {
    await destroySession();
    redirect('/');
}

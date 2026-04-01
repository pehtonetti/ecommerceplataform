'use server'

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/crypto";

const COOKIE_NAME = 'ecommerce_session';

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Preencha todos os campos.' };
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
            return { error: 'Email ou senha inválidos.' };
        }

        // Verify password using bcrypt
        const isValidPassword = await verifyPassword(password, user.password);

        if (!isValidPassword) {
            return { error: 'Email ou senha inválidos.' };
        }

        // Set Cookie as a Session Cookie (expires when browser/tab closes)
        // Removed maxAge and expires to ensure "logout on exit" behavior
        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        // Adiciona um cookie de papel para validação rápida no middleware
        cookieStore.set('user_role', user.role, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
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
        return { error: 'Erro ao fazer login. Tente novamente.' };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    cookieStore.delete('user_role');
    redirect('/');
}

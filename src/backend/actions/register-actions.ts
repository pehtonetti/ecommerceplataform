'use server'

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sendWelcomeEmail } from "@/lib/email";

const COOKIE_NAME = 'ecommerce_session';

export async function register(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        // Validações
        if (!name || !email || !password || !confirmPassword) {
            return { success: false, error: 'Todos os campos são obrigatórios.' };
        }

        if (password !== confirmPassword) {
            return { success: false, error: 'As senhas não coincidem.' };
        }

        if (password.length < 6) {
            return { success: false, error: 'A senha deve ter no mínimo 6 caracteres.' };
        }

        // Validar e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, error: 'E-mail inválido.' };
        }

        // Verificar se e-mail já existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { success: false, error: 'Este e-mail já está cadastrado.' };
        }

        // Hash da senha
        const hashedPassword = await hashPassword(password);

        // Criar usuário
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'customer'
            }
        });

        // Enviar e-mail de boas-vindas
        try {
            await sendWelcomeEmail({
                to: email,
                name: name
            });
        } catch (emailError) {
            console.error('Erro ao enviar e-mail de boas-vindas:', emailError);
            // Não falhar o registro se o e-mail falhar
        }

        return { success: true };
    } catch (error: any) {
        if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error;
        console.error('Erro ao criar conta:', error);
        return { success: false, error: 'Erro ao criar conta. Tente novamente.' };
    }
}

'use server'

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/crypto";

export async function registerStore(formData: FormData) {
    const storeName = formData.get('storeName') as string;
    const slug = formData.get('slug') as string;
    const ownerName = formData.get('ownerName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!storeName || !slug || !email || !password || !ownerName) {
        return { error: 'Por favor, preencha todos os campos obrigatórios.' };
    }

    try {
        // Valida se email já existe
        const existingEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (existingEmail) {
            return { error: 'Já existe um usuário com este e-mail.' };
        }

        // Valida se o slug escolhido para a loja já existe na Simplify
        const existingSlug = await prisma.store.findUnique({
            where: { slug }
        });

        if (existingSlug) {
            return { error: 'O domínio (slug) escolhido já está em uso na plataforma Simplify. Tente outro.' };
        }

        // Hash da senha do Lojista
        const hashedPassword = await hashPassword(password);

        // Operação transacional para criar usuário + loja de uma vez
        await prisma.$transaction(async (tx) => {
            // 1. Cria o Lojista
            const merchant = await tx.user.create({
                data: {
                    name: ownerName,
                    email,
                    password: hashedPassword,
                    role: 'merchant' // Define papel exclusivo de lojista
                }
            });

            // 2. Cria a Loja baseada neste lojista e a vincula
            await tx.store.create({
                data: {
                    ownerId: merchant.id,
                    name: storeName,
                    slug,
                    plan: 'trial-5brl', // Logica inicial flexivel: 5 reais nos primeiros 30 dias. Podendo ser upado via painel admin Simplify depois.
                    primaryColor: '#6366f1',
                    currency: 'BRL',
                    locale: 'pt-BR'
                }
            });
        });

        return { 
            success: true, 
            message: 'Sua loja Simplify foi criada com sucesso! Faça o login.',
            redirectUrl: '/login'
        };

    } catch (error) {
        console.error("Erro ao registrar a loja:", error);
        return { error: 'Ocorreu um erro ao criar a sua loja na plataforma. Tente novamente mais tarde.' };
    }
}

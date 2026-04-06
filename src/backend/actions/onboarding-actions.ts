'use server'

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { hashPassword } from "@/lib/crypto";
import { redirect } from "next/navigation";

const COOKIE_NAME = 'ecommerce_session';

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 50);
}

/**
 * Registro em 1 etapa: cria o usuário + loja e já faz login
 */
export async function registerAndCreateStore(formData: FormData) {
    try {
        // ─── Dados do usuário ─────────────────────────────────────────────────
        const name = formData.get('name')?.toString()?.trim();
        const email = formData.get('email')?.toString()?.trim();
        const password = formData.get('password')?.toString();
        const confirmPassword = formData.get('confirmPassword')?.toString();

        // ─── Dados da loja ─────────────────────────────────────────────────────
        const storeName = formData.get('storeName')?.toString()?.trim();
        const storeCategory = formData.get('storeCategory')?.toString() || 'geral';
        const whatsapp = formData.get('whatsapp')?.toString()?.trim() || null;

        // ─── Validações ──────────────────────────────────────────────────────
        if (!name || !email || !password || !confirmPassword || !storeName) {
            return { success: false, error: 'Preencha todos os campos obrigatórios.' };
        }

        if (password !== confirmPassword) {
            return { success: false, error: 'As senhas não coincidem.' };
        }

        if (password.length < 6) {
            return { success: false, error: 'A senha deve ter no mínimo 6 caracteres.' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, error: 'E-mail inválido.' };
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { success: false, error: 'Este e-mail já está cadastrado.' };
        }

        // ─── Gerar slug único para a loja ─────────────────────────────────────
        let baseSlug = generateSlug(storeName);
        if (!baseSlug) baseSlug = 'minha-loja';

        let slug = baseSlug;
        let attempt = 0;
        while (await prisma.store.findFirst({ where: { slug } })) {
            attempt++;
            slug = `${baseSlug}-${attempt}`;
        }

        // ─── Criar usuário com role merchant ─────────────────────────────────
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'merchant',
            }
        });

        // ─── Criar loja vinculada ao usuário ─────────────────────────────────
        await prisma.store.create({
            data: {
                name: storeName,
                slug,
                ownerId: user.id,
                plan: 'free',
                primaryColor: '#6366f1',
                theme: 'minimal',
                currency: 'BRL',
                locale: 'pt-BR',
                whatsappNumber: whatsapp,
                active: true,
            }
        });

        // ─── Login automático ─────────────────────────────────────────────────
        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        cookieStore.set('user_role', 'merchant', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return { success: true, slug };
    } catch (error: any) {
        if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error;
        console.error('Register + Create Store Error:', error);
        return { success: false, error: 'Erro ao criar sua conta. Tente novamente.' };
    }
}

/**
 * Busca se um slug está disponível
 */
export async function checkSlugAvailability(slug: string) {
    try {
        const clean = generateSlug(slug);
        if (!clean) return { available: false, slug: '' };
        const existing = await prisma.store.findFirst({ where: { slug: clean } });
        return { available: !existing, slug: clean };
    } catch {
        return { available: false, slug: '' };
    }
}

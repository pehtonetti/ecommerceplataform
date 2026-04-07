import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { generateSecureToken } from './crypto';

// Duração da sessão: 30 dias em segundos
const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

export const PERMISSIONS = {
    MANAGE_PRODUCTS: 'manage_products',
    MANAGE_USERS: 'manage_users',
    MANAGE_ORDERS: 'manage_orders',
} as const;

/**
 * Cria uma nova sessão no banco com token aleatório seguro.
 * O cookie armazena o TOKEN, nunca o userId.
 */
export async function createSession(userId: string): Promise<string> {
    const token = generateSecureToken(32); // 256-bit random token
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

    await prisma.session.create({
        data: { token, userId, expiresAt },
    });

    const cookieStore = await cookies();
    cookieStore.set('ecommerce_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_MAX_AGE,
    });

    return token;
}

/**
 * Obtém o usuário autenticado validando o token no banco.
 * NUNCA confia no cookie user_role — sempre valida pelo DB.
 */
export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('ecommerce_session')?.value;

        if (!token || token.length < 32) return null;

        // Busca sessão válida (não expirada) pelo token
        const session = await prisma.session.findUnique({
            where: { token },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        loyaltyPoints: true,
                    },
                },
            },
        });

        if (!session) return null;

        // Verifica expiração
        if (session.expiresAt < new Date()) {
            await prisma.session.delete({ where: { token } });
            return null;
        }

        // Sliding window: renova a sessão se estiver na metade do tempo
        const halfLife = SESSION_MAX_AGE * 1000 / 2;
        if (session.expiresAt.getTime() - Date.now() < halfLife) {
            const newExpiry = new Date(Date.now() + SESSION_MAX_AGE * 1000);
            await prisma.session.update({
                where: { token },
                data: { expiresAt: newExpiry },
            });
        }

        return session.user;
    } catch (error) {
        console.error('[auth] Erro ao validar sessão:', error);
        return null;
    }
}

/**
 * Remove a sessão atual (logout seguro)
 */
export async function destroySession(): Promise<void> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('ecommerce_session')?.value;

        if (token) {
            await prisma.session.deleteMany({ where: { token } });
        }

        cookieStore.delete('ecommerce_session');
        cookieStore.delete('user_role');
    } catch (error) {
        console.error('[auth] Erro ao destruir sessão:', error);
    }
}

/**
 * Remove todas as sessões de um usuário (logout de todos os dispositivos)
 */
export async function destroyAllSessions(userId: string): Promise<void> {
    await prisma.session.deleteMany({ where: { userId } });
}

export async function checkPermission(permission: string) {
    const user = await getCurrentUser();
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'merchant') return true;
    if (user.role === 'editor' && permission === PERMISSIONS.MANAGE_PRODUCTS) return true;
    return false;
}

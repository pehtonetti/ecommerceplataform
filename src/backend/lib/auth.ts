import { cookies } from 'next/headers';
import { prisma } from './prisma';

export const PERMISSIONS = {
    MANAGE_PRODUCTS: 'manage_products',
    MANAGE_USERS: 'manage_users',
    MANAGE_ORDERS: 'manage_orders',
} as const;

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('ecommerce_session')?.value;

        if (!userId) {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                loyaltyPoints: true
            }
        });

        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

export async function checkPermission(permission: string) {
    const user = await getCurrentUser();

    if (!user) {
        return false;
    }

    // Admin tem todas as permissões
    if (user.role === 'admin') {
        return true;
    }

    // Lojista pode gerenciar sua própria loja (produtos, pedidos, etc)
    if (user.role === 'merchant') {
        return true;
    }

    // Editor pode gerenciar produtos
    if (user.role === 'editor' && permission === PERMISSIONS.MANAGE_PRODUCTS) {
        return true;
    }

    return false;
}

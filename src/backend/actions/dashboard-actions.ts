'use server'

import { prisma } from "@/lib/prisma";
import { getStoreId } from "@/backend/lib/store-context";

export interface DashboardStats {
    revenue: { total: number, change: number };
    orders: { total: number, change: number };
    customers: { total: number, change: number };
    lowStock: { total: number, change: number };
}

export async function getDashboardStats(): Promise<
    { success: true; sales: any; customers: any; products: any; orders: any } |
    { success: false; error: string }
> {
    try {
        const storeId = await getStoreId();

        const [
            totalRevenueResult,
            totalOrders,
            pendingOrdersCount,
            totalCustomers,
            newCustomersCount,
            totalProducts,
            activeProductsCount,
            lowStockCount
        ] = await Promise.all([
            prisma.order.aggregate({
                _sum: { total: true },
                where: { storeId, status: 'paid' }
            }),
            prisma.order.count({ where: { storeId } }),
            prisma.order.count({ where: { storeId, status: 'pending' } }),
            prisma.order.groupBy({
                by: ['userId'],
                where: { storeId },
                _count: true
            }).then(res => res.length),
            prisma.order.groupBy({
                by: ['userId'],
                where: { 
                    storeId, 
                    createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
                },
                _count: true
            }).then(res => res.length),
            prisma.product.count({ where: { storeId } }),
            prisma.product.count({ where: { storeId, active: true } }),
            prisma.product.count({ where: { storeId, stock: { lte: 5 } } })
        ]);

        const revenue = totalRevenueResult._sum.total || 0;

        return {
            success: true,
            sales: { total: revenue, totalOrders: totalOrders },
            orders: { total: totalOrders, pending: pendingOrdersCount },
            customers: { total: totalCustomers, new: newCustomersCount },
            products: { total: totalProducts, active: activeProductsCount, lowStock: lowStockCount }
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { success: false, error: "Erro ao buscar estatísticas do painel" };
    }
}

export async function getRecentOrders() {
    const storeId = await getStoreId();
    const orders = await prisma.order.findMany({
        where: { storeId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true, email: true } }
        }
    });

    return orders.map(order => ({
        id: order.id,
        customerName: order.user?.name || 'Cliente',
        total: order.total,
        status: order.status,
        date: order.createdAt
    }));
}

export async function getLowStockProducts() {
    const storeId = await getStoreId();
    return await prisma.product.findMany({
        where: { storeId, stock: { lte: 5 } },
        take: 5,
        orderBy: { stock: 'asc' },
        select: {
            id: true,
            name: true,
            stock: true,
            price: true,
            imageUrl: true
        }
    });
}

export async function getTopSellingProducts() {
    const storeId = await getStoreId();

    // Since OrderItems don't have storeId directly, we filter by Order.storeId in a nested query,
    // but groupBy doesn't support nested relation filtering yet in Prisma.
    // Shortcut for MVP multi-tenancy: get products of this store that have orderItems.
    
    // For now we will just return trending products sorted by who has lowest stock / recent created 
    // OR fetch the orders first. Let's do a simple count of order items.
    const popularProducts = await prisma.product.findMany({
        where: { storeId },
        take: 5,
        include: {
            _count: {
                select: { orderItems: true }
            }
        },
        orderBy: {
            orderItems: { _count: 'desc' }
        }
    });

    return popularProducts.map(p => ({
        name: p.name,
        sales: p._count.orderItems
    }));
}

'use server'

import { prisma } from "@/lib/prisma";

export interface DashboardStats {
    revenue: { total: number, change: number };
    orders: { total: number, change: number };
    customers: { total: number, change: number };
    lowStock: { total: number, change: number };
}

export async function getDashboardStats() {
    // In a real scenario, we would calculate changes based on dates.
    // For now, we will fetch current totals and mock the "change" to avoid complex date logic 
    // unless requested, but we will make the TOTALS real.

    const [
        totalRevenueResult,
        totalOrders,
        totalCustomers,
        lowStockCount
    ] = await Promise.all([
        prisma.order.aggregate({
            _sum: { total: true },
            where: { status: { not: 'cancelled' } } // Assuming 'cancelled' status exists or we just count all valid
        }),
        prisma.order.count(),
        prisma.user.count({ where: { role: 'customer' } }),
        prisma.product.count({ where: { stock: { lte: 5 } } })
    ]);

    const revenue = totalRevenueResult._sum.total || 0;

    return {
        revenue: { value: revenue, change: '+12.5%' }, // Mock percentage for now
        orders: { value: totalOrders, change: '+5%' },
        customers: { value: totalCustomers, change: '+2%' },
        lowStock: { value: lowStockCount, change: '0' }
    };
}

export async function getRecentOrders() {
    const orders = await prisma.order.findMany({
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
    return await prisma.product.findMany({
        where: { stock: { lte: 5 } },
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
    // This is more complex without an order_items aggregation, 
    // but we can query top order items grouping by product.
    // Prisma doesn't support easy "groupBy" on relations for this yet without raw query.
    // We will do a simple fetch of OrderItems and loose aggregation for MVP.
    // OR we can just fetch random "trending" products if order history is empty.

    // Simplification: Return random 5 products labeled as "Trending" if strict analytics
    // are not yet populated, or query OrderItems if we want to be real.

    const topItems = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
            quantity: true,
        },
        orderBy: {
            _sum: {
                quantity: 'desc',
            },
        },
        take: 5,
    });

    // Populate product names
    const productIds = topItems.map(i => i.productId);
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true }
    });

    return topItems.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
            name: product?.name || 'Produto Removido',
            sales: item._sum.quantity || 0
        };
    });
}

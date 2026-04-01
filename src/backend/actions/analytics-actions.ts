'use server'

import { prisma } from "@/lib/prisma";
import { getStoreContext } from "@/backend/lib/store-context";

export async function getAnalyticsData() {
    const store = await getStoreContext();
    if (!store) return null;

    const now = new Date();
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const start = new Date(d.getFullYear(), d.getMonth(), 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
        const label = d.toLocaleString('en-US', { month: 'short' });
        return { start, end, label };
    }).reverse();

    // 1. Sales Data (Last 6 Months)
    const salesData = await Promise.all(last6Months.map(async (month) => {
        const orders = await prisma.order.findMany({
            where: {
                storeId: store.id,
                status: 'paid',
                createdAt: {
                    gte: month.start,
                    lte: month.end
                }
            },
            select: { total: true }
        });

        const totalValue = orders.reduce((acc, curr) => acc + curr.total, 0) / 100;
        return {
            name: month.label,
            vendas: totalValue,
            pedidos: orders.length
        };
    }));

    // 2. Top Products
    const topProducts = await prisma.product.findMany({
        where: { storeId: store.id },
        orderBy: { orderItems: { _count: 'desc' } },
        take: 5,
        select: {
            name: true,
            orderItems: {
                select: { quantity: true }
            }
        }
    });

    const productsChartData = topProducts.map(p => ({
        name: p.name.split(' ').slice(0, 2).join(' '),
        vendas: p.orderItems.reduce((acc, curr) => acc + curr.quantity, 0)
    }));

    // 3. Overall Stats
    const totalOrders = await prisma.order.count({ where: { storeId: store.id } });
    const totalRevenue = await prisma.order.aggregate({
        where: { storeId: store.id, status: 'paid' },
        _sum: { total: true }
    });
    const totalViews = await prisma.productView.count({
        where: { product: { storeId: store.id } }
    });

    return {
        salesHistory: salesData,
        topProducts: productsChartData,
        stats: {
            revenue: (totalRevenue._sum.total || 0) / 100,
            orders: totalOrders,
            views: totalViews,
            conversion: totalOrders > 0 ? ((totalOrders / totalViews) * 100).toFixed(2) : 0
        }
    };
}

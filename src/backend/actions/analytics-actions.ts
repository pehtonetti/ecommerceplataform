'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

/**
 * Registra uma visualização de produto
 */
export async function trackProductView(
    productId: string,
    ipAddress?: string,
    userAgent?: string
) {
    try {
        const user = await getCurrentUser();

        await prisma.productView.create({
            data: {
                productId,
                userId: user?.id,
                ipAddress,
                userAgent,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Erro ao registrar visualização:', error);
        // Não retornar erro para não afetar a experiência do usuário
        return { success: false };
    }
}

/**
 * Obtém estatísticas gerais do dashboard (admin)
 */
export async function getDashboardStats() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return { error: 'Acesso negado' };
        }

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Total de vendas
        const totalSalesResult = await prisma.order.aggregate({
            where: {
                status: { not: 'cancelled' },
            },
            _sum: {
                total: true,
            },
            _count: true,
        });

        // Vendas dos últimos 30 dias
        const last30DaysSalesResult = await prisma.order.aggregate({
            where: {
                status: { not: 'cancelled' },
                createdAt: { gte: thirtyDaysAgo },
            },
            _sum: {
                total: true,
            },
            _count: true,
        });

        // Vendas dos últimos 7 dias
        const last7DaysSalesResult = await prisma.order.aggregate({
            where: {
                status: { not: 'cancelled' },
                createdAt: { gte: sevenDaysAgo },
            },
            _sum: {
                total: true,
            },
            _count: true,
        });

        // Total de clientes
        const totalCustomers = await prisma.user.count({
            where: { role: 'customer' },
        });

        // Novos clientes (últimos 30 dias)
        const newCustomers = await prisma.user.count({
            where: {
                role: 'customer',
                createdAt: { gte: thirtyDaysAgo },
            },
        });

        // Total de produtos
        const totalProducts = await prisma.product.count();

        // Produtos ativos
        const activeProducts = await prisma.product.count({
            where: { active: true },
        });

        // Produtos com baixo estoque (menos de 10 unidades)
        const lowStockProducts = await prisma.product.count({
            where: {
                active: true,
                stock: { lt: 10 },
            },
        });

        // Produtos sem estoque
        const outOfStockProducts = await prisma.product.count({
            where: {
                active: true,
                stock: 0,
            },
        });

        // Pedidos pendentes
        const pendingOrders = await prisma.order.count({
            where: { status: 'pending' },
        });

        // Total de avaliações
        const totalReviews = await prisma.review.count();

        // Avaliação média
        const avgRatingResult = await prisma.review.aggregate({
            _avg: {
                rating: true,
            },
        });

        return {
            sales: {
                total: totalSalesResult._sum.total || 0,
                totalOrders: totalSalesResult._count,
                last30Days: last30DaysSalesResult._sum.total || 0,
                last30DaysOrders: last30DaysSalesResult._count,
                last7Days: last7DaysSalesResult._sum.total || 0,
                last7DaysOrders: last7DaysSalesResult._count,
            },
            customers: {
                total: totalCustomers,
                new: newCustomers,
            },
            products: {
                total: totalProducts,
                active: activeProducts,
                lowStock: lowStockProducts,
                outOfStock: outOfStockProducts,
            },
            orders: {
                pending: pendingOrders,
            },
            reviews: {
                total: totalReviews,
                averageRating: avgRatingResult._avg.rating || 0,
            },
        };
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return { error: 'Erro ao buscar estatísticas' };
    }
}

/**
 * Obtém dados de vendas por dia para gráfico
 */
export async function getSalesChartData(days: number = 30) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return { error: 'Acesso negado' };
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        const orders = await prisma.order.findMany({
            where: {
                status: { not: 'cancelled' },
                createdAt: { gte: startDate },
            },
            select: {
                createdAt: true,
                total: true,
            },
        });

        // Agrupar por dia
        const salesByDay: { [key: string]: { date: string; total: number; count: number } } = {};

        orders.forEach((order) => {
            const dateKey = order.createdAt.toISOString().split('T')[0];
            if (!salesByDay[dateKey]) {
                salesByDay[dateKey] = { date: dateKey, total: 0, count: 0 };
            }
            salesByDay[dateKey].total += order.total;
            salesByDay[dateKey].count += 1;
        });

        const chartData = Object.values(salesByDay).sort((a, b) =>
            a.date.localeCompare(b.date)
        );

        return { chartData };
    } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
        return { error: 'Erro ao buscar dados do gráfico' };
    }
}

/**
 * Obtém produtos mais vendidos
 */
export async function getTopSellingProducts(limit: number = 10) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return { error: 'Acesso negado' };
        }

        const topProducts = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
            },
            _count: {
                productId: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: limit,
        });

        // Buscar informações dos produtos
        const productsWithDetails = await Promise.all(
            topProducts.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        price: true,
                    },
                });

                return {
                    product,
                    totalSold: item._sum.quantity || 0,
                    orderCount: item._count.productId,
                };
            })
        );

        return { topProducts: productsWithDetails };
    } catch (error) {
        console.error('Erro ao buscar produtos mais vendidos:', error);
        return { error: 'Erro ao buscar produtos mais vendidos' };
    }
}

/**
 * Obtém produtos mais visualizados
 */
export async function getMostViewedProducts(limit: number = 10, days: number = 30) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return { error: 'Acesso negado' };
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const viewCounts = await prisma.productView.groupBy({
            by: ['productId'],
            where: {
                createdAt: { gte: startDate },
            },
            _count: {
                productId: true,
            },
            orderBy: {
                _count: {
                    productId: 'desc',
                },
            },
            take: limit,
        });

        // Buscar informações dos produtos
        const productsWithDetails = await Promise.all(
            viewCounts.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        price: true,
                        stock: true,
                    },
                });

                return {
                    product,
                    viewCount: item._count.productId,
                };
            })
        );

        return { mostViewedProducts: productsWithDetails };
    } catch (error) {
        console.error('Erro ao buscar produtos mais visualizados:', error);
        return { error: 'Erro ao buscar produtos mais visualizados' };
    }
}

/**
 * Obtém estatísticas de categorias
 */
export async function getCategoryStats() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return { error: 'Acesso negado' };
        }

        // Produtos por categoria
        const productsByCategory = await prisma.product.groupBy({
            by: ['category'],
            where: { active: true },
            _count: {
                category: true,
            },
            orderBy: {
                _count: {
                    category: 'desc',
                },
            },
        });

        // Vendas por categoria
        const salesByCategory = await prisma.orderItem.findMany({
            include: {
                product: {
                    select: {
                        category: true,
                    },
                },
            },
        });

        const categorySales: { [key: string]: { total: number; quantity: number } } = {};

        salesByCategory.forEach((item) => {
            const category = item.product.category;
            if (!categorySales[category]) {
                categorySales[category] = { total: 0, quantity: 0 };
            }
            categorySales[category].total += item.price * item.quantity;
            categorySales[category].quantity += item.quantity;
        });

        const categoryStatsArray = Object.entries(categorySales).map(([category, data]) => ({
            category,
            totalSales: data.total,
            totalQuantity: data.quantity,
            productCount:
                productsByCategory.find((p) => p.category === category)?._count.category || 0,
        }));

        categoryStatsArray.sort((a, b) => b.totalSales - a.totalSales);

        return { categoryStats: categoryStatsArray };
    } catch (error) {
        console.error('Erro ao buscar estatísticas de categorias:', error);
        return { error: 'Erro ao buscar estatísticas de categorias' };
    }
}

/**
 * Obtém produtos com baixo estoque
 */
export async function getLowStockProducts(threshold: number = 10) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return { error: 'Acesso negado' };
        }

        const products = await prisma.product.findMany({
            where: {
                active: true,
                stock: { lt: threshold },
            },
            orderBy: {
                stock: 'asc',
            },
            select: {
                id: true,
                name: true,
                stock: true,
                imageUrl: true,
                category: true,
            },
        });

        return { lowStockProducts: products };
    } catch (error) {
        console.error('Erro ao buscar produtos com baixo estoque:', error);
        return { error: 'Erro ao buscar produtos com baixo estoque' };
    }
}

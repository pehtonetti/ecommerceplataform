import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createClient } from 'redis';
import { PrismaClient } from '@prisma/client';
import { createLogger, format, transports } from 'winston';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

// Logger
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'analytics.log' })
    ]
});

// Redis client
const redis = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD
});

redis.on('error', (err) => logger.error('Redis error:', err));
redis.connect();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Cache middleware
const cacheMiddleware = (duration: number) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const key = `cache:${req.originalUrl}`;

        try {
            const cached = await redis.get(key);
            if (cached) {
                logger.info(`Cache hit: ${key}`);
                return res.json(JSON.parse(cached));
            }

            // Override res.json to cache the response
            const originalJson = res.json.bind(res);
            res.json = (body: any) => {
                redis.setEx(key, duration, JSON.stringify(body));
                return originalJson(body);
            };

            next();
        } catch (error) {
            logger.error('Cache error:', error);
            next();
        }
    };
};

// Routes

// Dashboard statistics
app.get('/dashboard', cacheMiddleware(300), async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [totalSales, last30DaysSales, totalCustomers, totalProducts] = await Promise.all([
            prisma.order.aggregate({
                where: { status: { not: 'cancelled' } },
                _sum: { total: true },
                _count: true
            }),
            prisma.order.aggregate({
                where: {
                    status: { not: 'cancelled' },
                    createdAt: { gte: thirtyDaysAgo }
                },
                _sum: { total: true },
                _count: true
            }),
            prisma.user.count({ where: { role: 'customer' } }),
            prisma.product.count({ where: { active: true } })
        ]);

        res.json({
            totalRevenue: totalSales._sum.total || 0,
            totalOrders: totalSales._count,
            last30DaysRevenue: last30DaysSales._sum.total || 0,
            last30DaysOrders: last30DaysSales._count,
            totalCustomers,
            totalProducts
        });
    } catch (error) {
        logger.error('Dashboard error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Sales chart data
app.get('/sales/chart', cacheMiddleware(600), async (req, res) => {
    try {
        const days = parseInt(req.query.days as string) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const orders = await prisma.order.findMany({
            where: {
                status: { not: 'cancelled' },
                createdAt: { gte: startDate }
            },
            select: {
                createdAt: true,
                total: true
            }
        });

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

        res.json({ chartData });
    } catch (error) {
        logger.error('Sales chart error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Top selling products
app.get('/products/top', cacheMiddleware(600), async (req, res) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;

        const topProducts = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            _count: { productId: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: limit
        });

        const productsWithDetails = await Promise.all(
            topProducts.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        price: true
                    }
                });

                return {
                    product,
                    totalSold: item._sum.quantity || 0,
                    orderCount: item._count.productId
                };
            })
        );

        res.json({ topProducts: productsWithDetails });
    } catch (error) {
        logger.error('Top products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Most viewed products
app.get('/products/views', cacheMiddleware(600), async (req, res) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const days = parseInt(req.query.days as string) || 30;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const viewCounts = await prisma.productView.groupBy({
            by: ['productId'],
            where: { createdAt: { gte: startDate } },
            _count: { productId: true },
            orderBy: { _count: { productId: 'desc' } },
            take: limit
        });

        const productsWithDetails = await Promise.all(
            viewCounts.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        price: true,
                        stock: true
                    }
                });

                return {
                    product,
                    viewCount: item._count.productId
                };
            })
        );

        res.json({ mostViewedProducts: productsWithDetails });
    } catch (error) {
        logger.error('Most viewed products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Real-time metrics
app.get('/realtime', async (req, res) => {
    try {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const [recentOrders, recentViews, activeUsers] = await Promise.all([
            prisma.order.count({
                where: { createdAt: { gte: last24Hours } }
            }),
            prisma.productView.count({
                where: { createdAt: { gte: last24Hours } }
            }),
            prisma.user.count({
                where: { updatedAt: { gte: last24Hours } }
            })
        ]);

        res.json({
            recentOrders,
            recentViews,
            activeUsers,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Realtime metrics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'analytics', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
    logger.info(`Analytics service running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    await prisma.$disconnect();
    await redis.quit();
    process.exit(0);
});

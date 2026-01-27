import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRedisClient } from '@/lib/cache';

export async function GET() {
    const checks = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {} as Record<string, any>
    };

    // Check database
    try {
        await prisma.$queryRaw`SELECT 1`;
        checks.services.database = {
            status: 'healthy',
            message: 'Database connection successful'
        };
    } catch (error) {
        checks.status = 'unhealthy';
        checks.services.database = {
            status: 'unhealthy',
            message: 'Database connection failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }

    // Check Redis
    try {
        const redis = await getRedisClient();
        await redis.ping();
        checks.services.redis = {
            status: 'healthy',
            message: 'Redis connection successful'
        };
    } catch (error) {
        checks.status = 'degraded';
        checks.services.redis = {
            status: 'unhealthy',
            message: 'Redis connection failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }

    // Application info
    checks.services.application = {
        status: 'healthy',
        version: process.env.npm_package_version || '1.0.0',
        nodeVersion: process.version,
        uptime: process.uptime(),
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
            unit: 'MB'
        }
    };

    const statusCode = checks.status === 'healthy' ? 200 : 503;

    return NextResponse.json(checks, { status: statusCode });
}

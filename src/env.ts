/**
 * Environment Variable Configuration & Validation
 * 
 * This file acts as the single source of truth for all environment variables.
 * In production, it ensures all required keys are present, preventing runtime errors.
 */

const getVar = (key: string, required: boolean = true, fallback: string = '') => {
    const value = process.env[key];

    if (!value && required && process.env.NODE_ENV === 'production') {
        throw new Error(`❌ MISSING ENV VAR: ${key} is required for production.`);
    }

    return value || fallback;
};

export const env = {
    // Core
    NODE_ENV: process.env.NODE_ENV || 'development',
    APP_URL: getVar('NEXT_PUBLIC_APP_URL', true, 'http://localhost:3000'),

    // Database
    DATABASE_URL: getVar('DATABASE_URL'),

    // Redis (Cache)
    REDIS_URL: getVar('REDIS_URL'),
    REDIS_PASSWORD: getVar('REDIS_PASSWORD', false),

    // RabbitMQ (Queue)
    RABBITMQ_URL: getVar('RABBITMQ_URL', false), // Optional if not using queues yet

    // Email (SendGrid)
    SENDGRID_API_KEY: getVar('SENDGRID_API_KEY'),
    FROM_EMAIL: getVar('FROM_EMAIL', false, 'noreply@ecommerce.com'),

    // Stripe (Payments)
    STRIPE_SECRET_KEY: getVar('STRIPE_SECRET_KEY'),
    STRIPE_PUBLISHABLE_KEY: getVar('STRIPE_PUBLISHABLE_KEY', false), // Used in frontend mostly
    STRIPE_WEBHOOK_SECRET: getVar('STRIPE_WEBHOOK_SECRET'),

    // Fiscal (ENotas)
    ENOTAS_API_KEY: getVar('ENOTAS_API_KEY'),

    // Feature Flags (Boolean)
    FLAGS: {
        ENABLE_WISHLIST: process.env.ENABLE_WISHLIST === 'true',
        ENABLE_LOYALTY: process.env.ENABLE_LOYALTY_PROGRAM === 'true',
        ENABLE_COUPONS: process.env.ENABLE_COUPONS === 'true',
    }
} as const;

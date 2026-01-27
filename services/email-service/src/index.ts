import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { createLogger, format, transports } from 'winston';

// Load .env early
dotenv.config();

// Logger configuration
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
    ]
});

// Email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Basic SMTP config check
if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('SMTP configuration appears incomplete. Emails may fail. Check SMTP_HOST, SMTP_USER, SMTP_PASS.');
}

// Module-scoped connection objects for graceful shutdown
let rabbitConnection: any = null;
let rabbitChannel: any = null;

// Email templates
const templates = {
    orderConfirmation: (data: any) => ({
        subject: `Pedido #${data.orderNumber} Confirmado`,
        html: `
            <h1>Pedido Confirmado!</h1>
            <p>Olá ${data.customerName},</p>
            <p>Seu pedido #${data.orderNumber} foi confirmado com sucesso.</p>
            <h2>Detalhes do Pedido:</h2>
            <ul>
                ${data.items.map((item: any) => `
                    <li>${item.name} - Qtd: ${item.quantity} - R$ ${(item.price / 100).toFixed(2)}</li>
                `).join('')}
            </ul>
            <p><strong>Total: R$ ${(data.total / 100).toFixed(2)}</strong></p>
            <p>Obrigado pela sua compra!</p>
        `
    }),

    shippingUpdate: (data: any) => ({
        subject: `Atualização de Envio - Pedido #${data.orderNumber}`,
        html: `
            <h1>Seu pedido está a caminho!</h1>
            <p>Olá ${data.customerName},</p>
            <p>Seu pedido #${data.orderNumber} foi enviado.</p>
            <p><strong>Código de rastreamento:</strong> ${data.trackingCode}</p>
            <p>Previsão de entrega: ${data.estimatedDelivery}</p>
        `
    }),

    passwordReset: (data: any) => ({
        subject: 'Redefinição de Senha',
        html: `
            <h1>Redefinir Senha</h1>
            <p>Olá ${data.userName},</p>
            <p>Você solicitou a redefinição de senha.</p>
            <p>Clique no link abaixo para redefinir sua senha:</p>
            <a href="${data.resetLink}">Redefinir Senha</a>
            <p>Este link expira em 1 hora.</p>
            <p>Se você não solicitou isso, ignore este email.</p>
        `
    }),

    welcomeEmail: (data: any) => ({
        subject: 'Bem-vindo à Loja Tech Premium!',
        html: `
            <h1>Bem-vindo!</h1>
            <p>Olá ${data.userName},</p>
            <p>Obrigado por se cadastrar na Loja Tech Premium!</p>
            <p>Você ganhou <strong>${data.welcomePoints} pontos</strong> de boas-vindas!</p>
            <p>Aproveite nossas ofertas exclusivas.</p>
        `
    }),

    lowStockAlert: (data: any) => ({
        subject: `Alerta: Estoque Baixo - ${data.productName}`,
        html: `
            <h1>Alerta de Estoque Baixo</h1>
            <p>O produto <strong>${data.productName}</strong> está com estoque baixo.</p>
            <p>Estoque atual: ${data.currentStock} unidades</p>
            <p>Ação necessária: Reabastecer o estoque.</p>
        `
    })
};

// Process email messages
async function processEmail(message: any) {
    try {
        const { type, to, data } = message;

        if (!templates[type as keyof typeof templates]) {
            logger.error(`Unknown email template: ${type}`);
            return;
        }

        const template = templates[type as keyof typeof templates](data);

        await transporter.sendMail({
            from: `"Loja Tech Premium" <${process.env.SMTP_USER}>`,
            to,
            subject: template.subject,
            html: template.html
        });

        logger.info(`Email sent successfully: ${type} to ${to}`);
    } catch (error) {
        logger.error('Error sending email:', error);
        throw error;
    }
}

// Connect to RabbitMQ and consume messages
async function startEmailService() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        const channel = await connection.createChannel();

        rabbitConnection = connection;
        rabbitChannel = channel;

        // Verify SMTP transporter early to fail fast if config is invalid
        try {
            await transporter.verify();
            logger.info('SMTP transporter verified');
        } catch (err) {
            logger.error('SMTP transporter verification failed', err);
            // continue: we still connect to rabbitmq and attempt sending later
        }

        const queue = 'email_queue';
        await channel.assertQueue(queue, { durable: true });

        logger.info('Email service started. Waiting for messages...');

        channel.consume(queue, async (msg: any) => {
            if (!msg) return;
            try {
                const message = JSON.parse(msg.content.toString());
                await processEmail(message);
                channel.ack(msg);
            } catch (error) {
                logger.error('Error processing message:', error);
                // Do not requeue indefinitely. Nack without requeue so message can go to DLQ if configured.
                try {
                    channel.nack(msg, false, false);
                } catch (e) {
                    logger.error('Failed to nack message', e);
                }
            }
        });

        // Handle connection errors
        connection.on('error', (err: any) => {
            logger.error('RabbitMQ connection error:', err);
        });

        connection.on('close', () => {
            logger.warn('RabbitMQ connection closed. Reconnecting...');
            rabbitConnection = null;
            rabbitChannel = null;
            setTimeout(startEmailService, 5000);
        });

    } catch (error) {
        logger.error('Failed to start email service:', error);
        setTimeout(startEmailService, 5000);
    }
}

// Start the service
startEmailService();

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    closeGracefully();
});

process.on('SIGINT', () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    closeGracefully();
});

process.on('unhandledRejection', (reason: any) => {
    logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err: any) => {
    logger.error('Uncaught Exception:', err);
    closeGracefully(1);
});

async function closeGracefully(code = 0) {
    try {
        if (rabbitChannel) {
            try { await rabbitChannel.close(); } catch (e) { logger.warn('Error closing channel', e); }
        }
        if (rabbitConnection) {
            try { await rabbitConnection.close(); } catch (e) { logger.warn('Error closing connection', e); }
        }
    } catch (e) {
        logger.error('Error during graceful shutdown', e);
    } finally {
        process.exit(code);
    }
}

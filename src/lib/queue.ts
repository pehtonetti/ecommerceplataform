import amqp, { Channel, Connection } from 'amqplib';

let connection: any = null;
let channel: Channel | null = null;

export async function getMessageQueue() {
    if (!connection) {
        connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');

        connection.on('error', (err: any) => {
            console.error('RabbitMQ Connection Error:', err);
            connection = null;
            channel = null;
        });

        connection.on('close', () => {
            console.log('RabbitMQ Connection Closed');
            connection = null;
            channel = null;
        });
    }

    if (!channel) {
        channel = await connection.createChannel();
    }

    return channel;
}

/**
 * Send email via message queue
 */
export async function sendEmail(type: string, to: string, data: any) {
    try {
        const ch = await getMessageQueue();
        if (!ch) throw new Error('Failed to connect to message queue');
        const queue = 'email_queue';

        await ch.assertQueue(queue, { durable: true });

        const message = {
            type,
            to,
            data,
            timestamp: new Date().toISOString()
        };

        ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
            persistent: true
        });

        console.log(`Email queued: ${type} to ${to}`);
    } catch (error) {
        console.error('Error queuing email:', error);
        throw error;
    }
}

/**
 * Queue order confirmation email
 */
export async function queueOrderConfirmation(order: any) {
    await sendEmail('orderConfirmation', order.user.email, {
        orderNumber: order.id.slice(0, 8).toUpperCase(),
        customerName: order.user.name,
        total: order.total,
        items: order.items.map((item: any) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price * item.quantity
        }))
    });
}

/**
 * Queue shipping update email
 */
export async function queueShippingUpdate(order: any, trackingCode: string) {
    await sendEmail('shippingUpdate', order.user.email, {
        orderNumber: order.id.slice(0, 8).toUpperCase(),
        customerName: order.user.name,
        trackingCode,
        estimatedDelivery: new Date(Date.now() + order.shippingDays * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
    });
}

/**
 * Queue password reset email
 */
export async function queuePasswordReset(email: string, userName: string, resetToken: string) {
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    await sendEmail('passwordReset', email, {
        userName,
        resetLink
    });
}

/**
 * Queue welcome email
 */
export async function queueWelcomeEmail(email: string, userName: string, welcomePoints: number = 100) {
    await sendEmail('welcomeEmail', email, {
        userName,
        welcomePoints
    });
}

/**
 * Queue low stock alert (admin)
 */
export async function queueLowStockAlert(product: any, adminEmail: string) {
    await sendEmail('lowStockAlert', adminEmail, {
        productName: product.name,
        currentStock: product.stock
    });
}

/**
 * Send message to custom queue
 */
export async function sendToQueue(queueName: string, message: any) {
    try {
        const ch = await getMessageQueue();
        if (!ch) throw new Error('Failed to connect to message queue');

        await ch.assertQueue(queueName, { durable: true });

        ch.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
            persistent: true
        });

        console.log(`Message sent to queue: ${queueName}`);
    } catch (error) {
        console.error('Error sending to queue:', error);
        throw error;
    }
}

/**
 * Close connection gracefully
 */
export async function closeMessageQueue() {
    try {
        if (channel) {
            await channel.close();
            channel = null;
        }

        if (connection) {
            await connection.close();
            connection = null;
        }
    } catch (error) {
        console.error('Error closing message queue:', error);
    }
}

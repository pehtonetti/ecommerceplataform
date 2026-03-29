export type OrderStatus =
    | 'pending'
    | 'paid'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export const ORDER_STATUSES: Record<OrderStatus, { label: string; color: string }> = {
    pending: {
        label: 'Aguardando Pagamento',
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    paid: {
        label: 'Pago',
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    processing: {
        label: 'Em Processamento',
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    shipped: {
        label: 'Enviado',
        color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    delivered: {
        label: 'Entregue',
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },
    cancelled: {
        label: 'Cancelado',
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    refunded: {
        label: 'Reembolsado',
        color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    },
};

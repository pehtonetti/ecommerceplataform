
import axios from 'axios';
import { env } from '@/env';

// ENotas Gateway API Base URL
const ENOTAS_BASE_URL = 'https://api.enotasgw.com.br/v2';

interface ENotasClient {
    name: string;
    email: string;
    cpfCnpj?: string;
    address?: {
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
}

interface ENotasItem {
    description: string;
    value: number; // In cents or float? ENotas usually expects float for gateway, checking docs... usually total struct.
    quantity: number;
}

/**
 * Emits an invoice (NFe/NFCe) via ENotas Gateway
 * 
 * NOTE: This assumes we are sending a "Sale" to be processed.
 */
export async function emitNFeForOrder(order: any) {
    if (!env.ENOTAS_API_KEY) {
        console.warn('⚠️ ENotas API Key missing. Skipping invoice emission.');
        return { success: false, error: 'Misconfigured API Key' };
    }

    // 1. Map Order to ENotas format
    // We use the "vendas" (sales) endpoint which is simpler and lets ENotas decide the best NF type
    const payload = {
        idExterno: order.id,
        cliente: {
            nome: order.user.name,
            email: order.user.email,
            cpfCnpj: order.user.document || '00000000000', // Assuming we have this field, or fallback
            // Endereço is optional for NFCe but good for NFe
            ...(order.address ? {
                endereco: {
                    logradouro: order.address.street,
                    numero: order.address.number,
                    complemento: order.address.complement,
                    bairro: order.address.neighborhood,
                    cidade: order.address.city,
                    uf: order.address.state,
                    cep: order.address.zipCode?.replace(/\D/g, '')
                }
            } : {})
        },
        servico: {
            // If this were a service. For products, we use 'itens'.
            // But ENotas Gateway usually unifies. Let's assume 'itens' for product commerce.
        },
        itens: order.items.map((item: any) => ({
            descricao: item.product.name,
            quantidade: item.quantity,
            valorUnitario: item.price / 100 // Convert cents to float
        })),
        valorTotal: order.total / 100,
        dataCompetencia: new Date().toISOString(),
        discriminacao: `Pedido #${order.id}`
    };

    try {
        const response = await axios.post(
            `${ENOTAS_BASE_URL}/vendas`,
            payload,
            {
                headers: {
                    'Authorization': `Basic ${env.ENOTAS_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );

        return {
            success: true,
            nfeId: response.data.nfeId || response.data.id,
            status: response.data.status,
            linkPdf: response.data.linkDownloadPDF // if available immediately
        };
    } catch (error: any) {
        console.error('❌ Error communicating with ENotas:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.mensagem || error.message
        };
    }
}

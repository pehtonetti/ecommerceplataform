/**
 * Shipping & Logistics Utilities
 * Integração com ViaCEP e Melhor Envio (alternativa moderna aos Correios)
 */

export interface ViaCEPResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
}

export interface ShippingQuote {
    service: string;
    serviceName: string;
    price: number; // em centavos
    deliveryDays: number;
    company: string;
}

/**
 * Valida formato de CEP (XXXXX-XXX ou XXXXXXXX)
 */
export function validateCEPFormat(cep: string): boolean {
    const cleanCEP = cep.replace(/\D/g, '');
    return cleanCEP.length === 8;
}

/**
 * Formata CEP para padrão XXXXX-XXX
 */
export function formatCEP(cep: string): string {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return cep;
    return `${cleanCEP.slice(0, 5)}-${cleanCEP.slice(5)}`;
}

/**
 * Busca informações de endereço via ViaCEP
 */
export async function fetchAddressByCEP(cep: string): Promise<ViaCEPResponse | null> {
    const cleanCEP = cep.replace(/\D/g, '');

    if (!validateCEPFormat(cleanCEP)) {
        throw new Error('CEP inválido');
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`, {
            next: { revalidate: 86400 } // Cache por 24h
        });

        if (!response.ok) {
            throw new Error('Erro ao consultar CEP');
        }

        const data: ViaCEPResponse = await response.json();

        if (data.erro) {
            return null;
        }

        return data;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        throw new Error('Não foi possível consultar o CEP');
    }
}

/**
 * Calcula frete usando Melhor Envio API (Mock para desenvolvimento)
 * Em produção, substituir por integração real com Melhor Envio ou Correios
 */
export async function calculateShipping(params: {
    fromZipCode: string;
    toZipCode: string;
    weight: number; // gramas
    length: number; // cm
    width: number;  // cm
    height: number; // cm
}): Promise<ShippingQuote[]> {

    // MOCK: Simulação de cálculo de frete
    // Em produção, fazer requisição real para Melhor Envio ou API dos Correios

    const { fromZipCode, toZipCode, weight } = params;

    // Validar CEPs
    if (!validateCEPFormat(fromZipCode) || !validateCEPFormat(toZipCode)) {
        throw new Error('CEP inválido');
    }

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Calcular distância aproximada (mock baseado em diferença de CEP)
    const from = parseInt(fromZipCode.replace(/\D/g, ''));
    const to = parseInt(toZipCode.replace(/\D/g, ''));
    const distance = Math.abs(from - to) / 1000;

    // Fórmula simplificada de cálculo
    const basePrice = 1500; // R$ 15,00 base
    const weightFactor = Math.ceil(weight / 1000) * 500; // R$ 5,00 por kg
    const distanceFactor = Math.ceil(distance / 100) * 300; // R$ 3,00 por 100km

    const pacPrice = basePrice + weightFactor + distanceFactor;
    const sedexPrice = Math.ceil(pacPrice * 1.5); // SEDEX 50% mais caro
    const expressPrice = Math.ceil(pacPrice * 2); // Express 100% mais caro

    const baseDays = Math.ceil(distance / 200) + 3; // 3 dias base + distância

    return [
        {
            service: 'PAC',
            serviceName: 'PAC - Correios',
            price: pacPrice,
            deliveryDays: baseDays + 5,
            company: 'Correios'
        },
        {
            service: 'SEDEX',
            serviceName: 'SEDEX - Correios',
            price: sedexPrice,
            deliveryDays: baseDays + 2,
            company: 'Correios'
        },
        {
            service: 'EXPRESS',
            serviceName: 'Entrega Expressa',
            price: expressPrice,
            deliveryDays: baseDays,
            company: 'Loggi'
        }
    ];
}

/**
 * Calcula dimensões e peso total do carrinho
 */
export function calculateCartDimensions(items: Array<{
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    quantity: number;
}>) {
    let totalWeight = 0;
    let maxLength = 0;
    let maxWidth = 0;
    let totalHeight = 0;

    items.forEach(item => {
        totalWeight += (item.weight || 500) * item.quantity; // Default 500g
        maxLength = Math.max(maxLength, item.length || 20); // Default 20cm
        maxWidth = Math.max(maxWidth, item.width || 15);   // Default 15cm
        totalHeight += (item.height || 5) * item.quantity;  // Default 5cm
    });

    // Limites dos Correios
    const MAX_WEIGHT = 30000; // 30kg
    const MAX_LENGTH = 105;
    const MAX_WIDTH = 105;
    const MAX_HEIGHT = 105;

    return {
        weight: Math.min(totalWeight, MAX_WEIGHT),
        length: Math.min(maxLength, MAX_LENGTH),
        width: Math.min(maxWidth, MAX_WIDTH),
        height: Math.min(totalHeight, MAX_HEIGHT)
    };
}

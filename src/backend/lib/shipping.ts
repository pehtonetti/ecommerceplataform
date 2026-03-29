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
 * Calcula frete real com Mock/Fallback
 */
export async function calculateShipping(params: {
    fromZipCode: string;
    toZipCode: string;
    weight: number; // gramas
    length: number; // cm
    width: number;  // cm
    height: number; // cm
}): Promise<ShippingQuote[]> {
    const { fromZipCode, toZipCode, weight, length, width, height } = params;

    if (!validateCEPFormat(fromZipCode) || !validateCEPFormat(toZipCode)) {
        throw new Error('CEP inválido');
    }

    try {
        // Tentar API Real (Melhor Envio / Correios)
        // Se houver uma API Key em process.env, poderíamos chamar uma API real aqui.
        // Simulando a tentativa de API real:
        if (process.env.MELHORENVIO_TOKEN) {
             return await calculateMelhorEnvio(params);
        }

        throw new Error("No API configured, using fallback");
    } catch (error) {
        console.warn("⚠️ API de frete falhou ou não configurada, usando cálculo estimado (Fallback).");
        return calculateShippingFallback(params);
    }
}

/**
 * Cálculo Estimado (Fallback) baseado em distância e peso
 */
function calculateShippingFallback(params: {
    fromZipCode: string;
    toZipCode: string;
    weight: number;
    length: number;
    width: number;
    height: number;
}): ShippingQuote[] {
    const { fromZipCode, toZipCode, weight } = params;
    
    // Cálculo simplificado
    const from = parseInt(fromZipCode.replace(/\D/g, ''));
    const to = parseInt(toZipCode.replace(/\D/g, ''));
    const distanceDivisor = 100000;
    const distance = Math.max(1, Math.abs(from - to) / distanceDivisor);

    const basePrice = 1200; // R$ 12,00
    const weightFactor = (weight / 1000) * 400; // R$ 4,00 por kg
    const distanceFactor = distance * 200;

    const pacPrice = Math.round(basePrice + weightFactor + distanceFactor);
    const sedexPrice = Math.round(pacPrice * 1.6);
    const days = Math.min(15, Math.max(2, Math.round(distance / 2) + 2));

    return [
        {
            service: 'pac',
            serviceName: 'PAC (Estimado)',
            price: pacPrice,
            deliveryDays: days + 5,
            company: 'Correios'
        },
        {
            service: 'sedex',
            serviceName: 'SEDEX (Estimado)',
            price: sedexPrice,
            deliveryDays: days,
            company: 'Correios'
        }
    ];
}

/**
 * Integração Real com Melhor Envio (Cotação)
 */
async function calculateMelhorEnvio(params: {
    fromZipCode: string;
    toZipCode: string;
    weight: number; // gramas
    length: number;
    width: number;
    height: number;
}): Promise<ShippingQuote[]> {
    const isSandbox = process.env.NEXT_PUBLIC_MELHORENVIO_SANDBOX === 'true';
    const baseUrl = isSandbox 
        ? 'https://sandbox.melhorenvio.com.br' 
        : 'https://www.melhorenvio.com.br';

    const response = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.MELHORENVIO_TOKEN}`,
            'User-Agent': 'EcommercePlatform/1.0.0 (pedro@example.com)'
        },
        body: JSON.stringify({
            from: { postal_code: params.fromZipCode.replace(/\D/g, '') },
            to: { postal_code: params.toZipCode.replace(/\D/g, '') },
            package: {
                weight: params.weight / 1000, // Melhor Envio usa KG
                width: params.width,
                height: params.height,
                length: params.length
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro na API Melhor Envio:', errorData);
        throw new Error('Falha na comunicação com a transportadora');
    }

    const data = await response.json();

    // Filtrar apenas serviços sem erro e mapear para nosso formato
    return data
        .filter((service: any) => !service.error && service.price)
        .map((service: any) => ({
            service: service.id.toString(),
            serviceName: service.name,
            price: Math.round(parseFloat(service.price) * 100), // Converter para centavos
            deliveryDays: service.delivery_time || 0,
            company: service.company.name
        }));
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

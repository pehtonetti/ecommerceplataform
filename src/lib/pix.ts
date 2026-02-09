/**
 * Biblioteca para geração de PIX QR Code
 * Implementa o padrão BR Code (EMV) para pagamentos PIX
 */

import { v4 as uuidv4 } from 'uuid';

export interface PixPaymentData {
    pixKey: string;           // Chave PIX (CPF, CNPJ, email, telefone, ou chave aleatória)
    merchantName: string;     // Nome do recebedor
    merchantCity: string;     // Cidade do recebedor
    amount: number;           // Valor em centavos
    transactionId: string;    // ID único da transação
    description?: string;     // Descrição do pagamento
}

export interface PixQRCodeResult {
    qrCodeText: string;       // Texto do QR Code (PIX Copia e Cola)
    transactionId: string;    // ID da transação
    expiresAt: Date;          // Data de expiração
}

/**
 * Calcula o CRC16 CCITT para validação do payload PIX
 */
function calculateCRC16(payload: string): string {
    let crc = 0xFFFF;

    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;

        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
        }
    }

    crc = crc & 0xFFFF;
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Formata um campo do payload PIX no formato ID+LENGTH+VALUE
 */
function formatPixField(id: string, value: string): string {
    const length = value.length.toString().padStart(2, '0');
    return `${id}${length}${value}`;
}

/**
 * Gera o payload PIX (BR Code) conforme especificação EMV
 */
export function generatePixPayload(data: PixPaymentData): string {
    // Payload Indicator (fixo)
    let payload = formatPixField('00', '01');

    // Point of Initiation Method (12 = estático, 11 = dinâmico)
    payload += formatPixField('01', '12');

    // Merchant Account Information (chave PIX)
    const merchantAccountInfo =
        formatPixField('00', 'br.gov.bcb.pix') +
        formatPixField('01', data.pixKey);
    payload += formatPixField('26', merchantAccountInfo);

    // Merchant Category Code (0000 = não especificado)
    payload += formatPixField('52', '0000');

    // Transaction Currency (986 = BRL)
    payload += formatPixField('53', '986');

    // Transaction Amount (valor com 2 casas decimais)
    if (data.amount > 0) {
        const amountStr = (data.amount / 100).toFixed(2);
        payload += formatPixField('54', amountStr);
    }

    // Country Code
    payload += formatPixField('58', 'BR');

    // Merchant Name
    payload += formatPixField('59', data.merchantName.substring(0, 25));

    // Merchant City
    payload += formatPixField('60', data.merchantCity.substring(0, 15));

    // Additional Data Field Template
    if (data.transactionId || data.description) {
        let additionalData = '';

        if (data.transactionId) {
            additionalData += formatPixField('05', data.transactionId.substring(0, 25));
        }

        if (data.description) {
            additionalData += formatPixField('02', data.description.substring(0, 72));
        }

        payload += formatPixField('62', additionalData);
    }

    // CRC16 (sempre os últimos 4 caracteres)
    payload += '6304';
    const crc = calculateCRC16(payload);
    payload += crc;

    return payload;
}

/**
 * Cria um QR Code PIX para pagamento
 */
export async function createPixQRCode(data: PixPaymentData): Promise<PixQRCodeResult> {
    // Gera ID único se não fornecido
    const transactionId = data.transactionId || uuidv4().substring(0, 25);

    // Gera o payload PIX
    const qrCodeText = generatePixPayload({
        ...data,
        transactionId
    });

    // Define expiração (30 minutos)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    return {
        qrCodeText,
        transactionId,
        expiresAt
    };
}

/**
 * Valida se uma chave PIX está no formato correto
 */
export function validatePixKey(key: string): { valid: boolean; type?: string; error?: string } {
    if (!key || key.trim().length === 0) {
        return { valid: false, error: 'Chave PIX não pode estar vazia' };
    }

    const cleanKey = key.trim();

    // CPF (11 dígitos)
    if (/^\d{11}$/.test(cleanKey)) {
        return { valid: true, type: 'CPF' };
    }

    // CNPJ (14 dígitos)
    if (/^\d{14}$/.test(cleanKey)) {
        return { valid: true, type: 'CNPJ' };
    }

    // Email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanKey)) {
        return { valid: true, type: 'EMAIL' };
    }

    // Telefone (+5511999999999)
    if (/^\+55\d{10,11}$/.test(cleanKey)) {
        return { valid: true, type: 'PHONE' };
    }

    // Chave aleatória (UUID)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanKey)) {
        return { valid: true, type: 'RANDOM' };
    }

    return { valid: false, error: 'Formato de chave PIX inválido' };
}

/**
 * Formata valor em centavos para exibição em reais
 */
export function formatPixAmount(amountInCents: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amountInCents / 100);
}

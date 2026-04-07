import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const SALT_ROUNDS = 12; // Aumentado de 10 para 12

/**
 * Hash de senha usando bcrypt com salt reforçado
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifica se a senha corresponde ao hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Gera token criptograficamente seguro (CSPRNG) para recuperação de senha.
 * Usa crypto.randomBytes do Node.js — NÃO use Math.random() para tokens de segurança.
 */
export function generateSecureToken(bytes = 32): string {
    return randomBytes(bytes).toString('hex');
}

/**
 * @deprecated Use generateSecureToken() em vez disso.
 * Math.random() não é criptograficamente seguro.
 */
export function generateResetToken(): string {
    return generateSecureToken(32);
}

/**
 * Gera código de cupom seguro e único
 */
export function generateCouponCode(prefix = 'SIMPLIFY'): string {
    const token = randomBytes(4).toString('hex').toUpperCase();
    return `${prefix}-${token}`;
}

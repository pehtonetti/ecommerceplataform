import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash de senha usando bcrypt
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
 * Gera token aleatório para recuperação de senha
 */
export function generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

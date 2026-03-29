// Configurações do programa de fidelidade
export const LOYALTY_CONFIG = {
    pointsPerReal: 1, // 1 ponto por R$ 1,00 gasto
    reaisPerPoint: 0.01, // 1 ponto = R$ 0,01
    minPointsToRedeem: 100, // Mínimo de 100 pontos para resgatar
    maxPointsPerOrder: 5000, // Máximo de pontos que podem ser usados por pedido
};

/**
 * Calcula quantos pontos o usuário ganhará em uma compra
 */
export function calculatePointsEarned(totalAmount: number): number {
    return Math.floor(totalAmount / 100 * LOYALTY_CONFIG.pointsPerReal);
}

/**
 * Calcula o desconto em centavos baseado nos pontos
 */
export function calculatePointsDiscount(points: number): number {
    return Math.floor(points * LOYALTY_CONFIG.reaisPerPoint * 100);
}

/**
 * Exporta a configuração do programa de fidelidade
 */
export function getLoyaltyConfig() {
    return LOYALTY_CONFIG;
}

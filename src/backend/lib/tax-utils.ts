export function calculateTax(subtotal: number, state: string) {
    // Simulated Brazilian Tax Logic (ICMS varies by state)
    // SP: 18%, RJ: 20%, others average 17%
    let rate = 0.17;

    const stateRates: Record<string, number> = {
        'SP': 0.18,
        'RJ': 0.20,
        'MG': 0.18,
        'PR': 0.19,
        'RS': 0.18,
        'SC': 0.17,
    };

    if (state && stateRates[state.toUpperCase()]) {
        rate = stateRates[state.toUpperCase()];
    }

    return Math.floor(subtotal * rate);
}

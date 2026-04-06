/**
 * Rota raiz "/" — coberta pelo middleware.
 * O middleware em src/middleware.ts intercepta "/" e redireciona:
 * - localhost / domínio raiz: → /home (Landing Page Simplify)
 * - subdomínio de loja: → vitrine via (storefront)/page.tsx
 * 
 * Este arquivo existe apenas como fallback de compilação.
 * Na prática, o middleware redireciona antes de chegar aqui.
 */
import { redirect } from 'next/navigation';

export default function RootFallback() {
    redirect('/home');
}

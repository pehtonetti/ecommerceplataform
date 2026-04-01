'use client';

import { useEffect } from 'react';

/**
 * Mapeamento dos 3 grandes presets de estilo pedidos:
 * 1. Minimal (Apple / Nike) -> Clean, rounded, minimalista
 * 2. Marketplace (Amazon / Mercado Livre) -> Pragmático, foco em busca, cores vibrantes
 * 3. Boutique (Shopify Premium / Zara) -> Sofisticado, fontes serifadas, clean lines
 */
const THEME_PRESETS = {
  minimal: {
    fontFamily: 'Inter, sans-serif',
    borderRadius: '16px',
    backgroundColor: '#ffffff',
    textColor: '#171717',
    buttonStyle: 'rounded-full shadow-sm',
  },
  marketplace: {
    fontFamily: 'system-ui, sans-serif',
    borderRadius: '4px',
    backgroundColor: '#f3f4f6', // Light gray background common in marketplaces
    textColor: '#111827',
    buttonStyle: 'rounded-md shadow-md',
  },
  boutique: {
    fontFamily: 'Georgia, serif',
    borderRadius: '0px', // Sharp edges
    backgroundColor: '#fafafa', // Warm white
    textColor: '#262626',
    buttonStyle: 'rounded-none border border-current',
  }
};

export function StoreThemeProvider({
  primaryColor,
  themeType = 'minimal',
}: {
  primaryColor?: string | null;
  themeType?: string | null;
}) {
  useEffect(() => {
    const root = document.documentElement;
    
    // 1. Injeta a Cor Primária Customizada do Lojista (se houver)
    if (primaryColor) {
      // O Tailwind v4 ou variáveis root
      root.style.setProperty('--color-primary', primaryColor);
      root.style.setProperty('--color-primary-dark', adjustColorBrightness(primaryColor, -20));
      root.style.setProperty('--color-primary-light', adjustColorBrightness(primaryColor, 20));
    }

    // 2. Injeta as configs do Preset do Tema Base
    const preset = THEME_PRESETS[(themeType as keyof typeof THEME_PRESETS) || 'minimal'];
    if (preset) {
      root.style.setProperty('--theme-radius', preset.borderRadius);
      root.style.setProperty('--theme-bg', preset.backgroundColor);
      root.style.setProperty('--theme-text', preset.textColor);
      root.style.setProperty('--theme-font', preset.fontFamily);
    }
  }, [primaryColor, themeType]);

  return <></>; // Headless component, apenas injeta CSS
}

// Utilitário simples para escurecer/clarear a cor primária
function adjustColorBrightness(hex: string, percent: number) {
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  r = Math.min(255, Math.max(0, r + (r * percent) / 100));
  g = Math.min(255, Math.max(0, g + (g * percent) / 100));
  b = Math.min(255, Math.max(0, b + (b * percent) / 100));

  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g)
    .toString(16)
    .padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

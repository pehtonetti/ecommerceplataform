export type LayoutSectionType = 'hero' | 'products' | 'categories' | 'newsletter';

export interface LayoutSection {
    id: string;
    type: LayoutSectionType;
    title?: string;
    visible: boolean;
    order: number;
}

export const DEFAULT_LAYOUT: LayoutSection[] = [
    { id: 'hero-1', type: 'hero', title: 'Banner Principal', visible: true, order: 0 },
    { id: 'products-1', type: 'products', title: 'Destaques', visible: true, order: 1 },
    { id: 'categories-1', type: 'categories', title: 'Categorias', visible: true, order: 2 },
    { id: 'newsletter-1', type: 'newsletter', title: 'Newsletter', visible: false, order: 3 },
];

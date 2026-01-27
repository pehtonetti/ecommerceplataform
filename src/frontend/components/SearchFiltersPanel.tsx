'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchFilters } from '@/backend/actions/search-actions';
import { SlidersHorizontal, X } from 'lucide-react';

interface SearchFiltersPanelProps {
    categories: string[];
    currentFilters: SearchFilters;
}

export function SearchFiltersPanel({ categories, currentFilters }: SearchFiltersPanelProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showFilters, setShowFilters] = useState(true);

    const updateFilters = (newFilters: Partial<SearchFilters>) => {
        const params = new URLSearchParams(searchParams.toString());

        // Update params
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && value !== null) {
                params.set(key, value.toString());
            } else {
                params.delete(key);
            }
        });

        router.push(`/search?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push('/search');
    };

    return (
        <div className="glass rounded-xl border border-border p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Filtros
                </h2>
                <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:underline"
                >
                    Limpar
                </button>
            </div>

            <div className="space-y-6">
                {/* Category */}
                <div>
                    <label className="block text-sm font-medium mb-3">Categoria</label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                value="all"
                                checked={!currentFilters.category || currentFilters.category === 'all'}
                                onChange={() => updateFilters({ category: undefined })}
                                className="w-4 h-4 text-primary"
                            />
                            <span className="text-sm">Todas</span>
                        </label>
                        {categories.map((category) => (
                            <label key={category} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="category"
                                    value={category}
                                    checked={currentFilters.category === category}
                                    onChange={() => updateFilters({ category })}
                                    className="w-4 h-4 text-primary"
                                />
                                <span className="text-sm">{category}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div>
                    <label className="block text-sm font-medium mb-3">Faixa de Preço</label>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-muted-foreground">Mínimo (R$)</label>
                            <input
                                type="number"
                                min="0"
                                step="10"
                                value={currentFilters.minPrice || ''}
                                onChange={(e) => updateFilters({ minPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">Máximo (R$)</label>
                            <input
                                type="number"
                                min="0"
                                step="10"
                                value={currentFilters.maxPrice || ''}
                                onChange={(e) => updateFilters({ maxPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="10000"
                            />
                        </div>
                    </div>
                </div>

                {/* Stock */}
                <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={currentFilters.inStock || false}
                            onChange={(e) => updateFilters({ inStock: e.target.checked ? true : undefined })}
                            className="w-4 h-4 rounded text-primary"
                        />
                        <span className="text-sm">Apenas em estoque</span>
                    </label>
                </div>

                {/* Brands (Simulated IA/Advanced) */}
                <div>
                    <label className="block text-sm font-medium mb-3">Marcas Populares</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Apple', 'Samsung', 'Sony', 'Dell', 'Logitech', 'Asus'].map(brand => (
                            <button
                                key={brand}
                                onClick={() => updateFilters({ query: brand })}
                                className="text-xs p-2 border border-border rounded-lg hover:border-primary hover:text-primary transition-colors text-left"
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort */}
                <div>
                    <label className="block text-sm font-medium mb-3">Ordenar por</label>
                    <select
                        value={currentFilters.sortBy || 'newest'}
                        onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="newest">Mais recentes</option>
                        <option value="price-asc">Menor preço</option>
                        <option value="price-desc">Maior preço</option>
                        <option value="name-asc">Nome (A-Z)</option>
                        <option value="name-desc">Nome (Z-A)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

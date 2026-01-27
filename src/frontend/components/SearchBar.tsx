'use client';

import { useState, useEffect } from 'react';
import { searchProducts, getProductSuggestions, SearchFilters } from '@/backend/actions/search-actions';
import { Search, X, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface SearchBarProps {
    onSearch?: (filters: SearchFilters) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const debouncedQuery = useDebounce(query, 300);

    // Fetch suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedQuery.length >= 2) {
                setIsLoading(true);
                const result = await getProductSuggestions(debouncedQuery);
                setSuggestions(result.suggestions || []);
                setShowSuggestions(true);
                setIsLoading(false);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        fetchSuggestions();
    }, [debouncedQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuggestions(false);
        onSearch?.({ query });
    };

    const handleClear = () => {
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        onSearch?.({});
    };

    const handleSuggestionClick = (suggestion: any) => {
        window.location.href = `/product/${suggestion.id}`;
    };

    return (
        <div className="relative w-full max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar produtos, categorias..."
                        className="w-full pl-12 pr-12 py-3 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                    {isLoading && (
                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
                    )}
                </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full glass border border-border shadow-xl z-50 overflow-hidden">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-left"
                        >
                            <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                                {suggestion.imageUrl && (
                                    <img
                                        src={suggestion.imageUrl}
                                        alt={suggestion.name}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{suggestion.name}</p>
                                <p className="text-sm text-muted-foreground">{suggestion.category}</p>
                            </div>
                            <p className="font-semibold text-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                    .format(suggestion.price / 100)}
                            </p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

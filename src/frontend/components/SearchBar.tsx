'use client';

import { useState, useEffect, useRef } from 'react';
import { getProductSuggestions, SearchFilters } from '@/backend/actions/search-actions';
import { Search, X, Loader2, TrendingUp, History, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useDebounce } from '@/frontend/hooks-lib/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SearchBarProps {
    onSearch?: (filters: SearchFilters) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedQuery.length >= 2) {
                setIsLoading(true);
                const result = await getProductSuggestions(debouncedQuery);
                setSuggestions(result.suggestions || []);
                setShowSuggestions(true);
                setIsLoading(false);
                setSelectedIndex(-1);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        };
        fetchSuggestions();
    }, [debouncedQuery]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
        } else if (e.key === 'Enter') {
            if (selectedIndex > -1) {
                e.preventDefault();
                handleSuggestionClick(suggestions[selectedIndex]);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuggestions(false);
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            onSearch?.({ query });
        }
    };

    const handleSuggestionClick = (suggestion: any) => {
        setShowSuggestions(false);
        setQuery(suggestion.name);
        router.push(`/product/${suggestion.id}`);
    };

    return (
        <div className="relative w-full max-w-2xl z-50">
            <form onSubmit={handleSearch} className="group relative">
                <div className={`relative flex items-center bg-zinc-100 dark:bg-zinc-900 border-2 transition-all duration-300 rounded-[20px] ${showSuggestions ? 'border-primary ring-4 ring-primary/10 shadow-2xl scale-[1.02]' : 'border-transparent group-hover:border-zinc-300 dark:group-hover:border-zinc-800'}`}>
                    <Search className={`ml-5 w-5 h-5 transition-colors ${showSuggestions ? 'text-primary' : 'text-zinc-400'}`} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        autoComplete="off"
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                        placeholder="O que você está procurando hoje?"
                        className="w-full bg-transparent pl-4 pr-12 py-4 font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
                    />
                    
                    <div className="absolute right-4 flex items-center gap-2">
                        {isLoading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                        {query && !isLoading && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-zinc-500" />
                            </button>
                        )}
                    </div>
                </div>
            </form>

            <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-4 w-full bg-white dark:bg-zinc-950 border border-border/50 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden p-3 backdrop-blur-3xl"
                    >
                        <div className="px-5 py-3 border-b border-border/50 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sugestões de Produtos</span>
                            <div className="flex gap-1">
                                <div className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[8px] font-bold">ESC para fechar</div>
                            </div>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {suggestions.map((suggestion, idx) => (
                                <button
                                    key={suggestion.id}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                    className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all relative ${
                                        selectedIndex === idx 
                                        ? 'bg-zinc-100 dark:bg-zinc-900 border-l-4 border-primary pl-5' 
                                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                                    }`}
                                >
                                    <div className="relative w-14 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                                        {suggestion.imageUrl && (
                                            <Image 
                                                src={suggestion.imageUrl} 
                                                alt={suggestion.name} 
                                                fill 
                                                className="object-cover" 
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className="font-black text-sm text-zinc-900 dark:text-zinc-100 truncate">{suggestion.name}</p>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{suggestion.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-sm text-primary">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(suggestion.price / 100)}
                                        </p>
                                        {selectedIndex === idx && (
                                            <CornerDownLeft className="w-3 h-3 text-zinc-300 ml-auto mt-1" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-b-[24px] mt-2 flex items-center justify-between group cursor-pointer" onClick={handleSearch}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-primary/10 text-primary">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold">Ver todos os resultados para "{query}"</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

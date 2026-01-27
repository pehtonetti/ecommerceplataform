'use client';

import { useState } from 'react';
import { Search, MapPin, ChevronDown, ShoppingCart, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SearchBarWithLocationProps {
    user?: {
        id: string;
        name: string | null;
        email: string | null;
    } | null;
}

export default function SearchBarWithLocation({ user }: SearchBarWithLocationProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('Bauru, São Paulo, Brasil');
    const [showLocationMenu, setShowLocationMenu] = useState(false);
    const router = useRouter();

    const popularCities = [
        'São Paulo',
        'Rio de Janeiro',
        'Belo Horizonte',
        'Brasília',
        'Bauru, São Paulo, Brasil',
        'Curitiba',
        'Porto Alegre',
        'Salvador',
        'Fortaleza',
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="w-full bg-blue-600 border-b border-blue-700 py-4 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <h1 className="text-2xl font-bold text-white">
                                LOJA
                            </h1>
                        </Link>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="flex-1 flex items-center shadow-sm rounded-lg overflow-hidden">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar produtos, marcas e muito mais..."
                                className="w-full px-4 py-2.5 bg-white text-gray-700 focus:outline-none placeholder-gray-400"
                            />
                        </div>

                        {/* Search Button */}
                        <button
                            type="submit"
                            className="px-4 py-2.5 bg-white border-l border-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Right Actions: Location & Profile & Cart */}
                    <div className="flex items-center gap-3 text-white ml-2">
                        {/* Location Selector */}
                        <div className="relative hidden md:block">
                            <button
                                type="button"
                                onClick={() => setShowLocationMenu(!showLocationMenu)}
                                className="flex flex-col items-start hover:bg-blue-700/50 p-2 rounded transition-colors group"
                            >
                                <span className="text-xs text-blue-100 mb-0.5">Enviar para</span>
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4 text-white" />
                                    <span className="text-sm font-medium max-w-[150px] truncate">
                                        {location}
                                    </span>
                                </div>
                            </button>

                            {/* Location Dropdown */}
                            {showLocationMenu && (
                                <div className="absolute top-full right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 z-50">
                                    <div className="p-3 border-b border-gray-200">
                                        <p className="text-sm font-semibold text-gray-700">
                                            Escolha sua localização
                                        </p>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {popularCities.map((city) => (
                                            <button
                                                key={city}
                                                type="button"
                                                onClick={() => {
                                                    setLocation(city);
                                                    setShowLocationMenu(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${location === city ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="text-sm">{city}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Button */}
                        <Link
                            href={user ? "/account" : "/login"}
                            className="flex items-center gap-2 hover:bg-blue-700/50 p-2 rounded transition-colors"
                        >
                            <User className="w-6 h-6" />
                            <div className="hidden lg:flex flex-col items-start leading-tight">
                                <span className="text-xs text-blue-100">
                                    {user ? `Olá, ${user.name?.split(' ')[0] ?? 'Cliente'}` : 'Bem-vindo'}
                                </span>
                                <span className="text-sm font-medium">
                                    {user ? 'Minha Conta' : 'Entrar'}
                                </span>
                            </div>
                        </Link>

                        {/* Cart Button */}
                        <Link href="/cart" className="flex items-center gap-2 hover:bg-blue-700/50 p-2 rounded transition-colors">
                            <ShoppingCart className="w-6 h-6" />
                            <span className="hidden xl:inline text-sm font-medium">Carrinho</span>
                        </Link>
                    </div>
                </div>

                {/* Popular Searches */}
                <div className="mt-3 flex items-center gap-2 text-sm">
                    <span className="text-blue-100">Buscas populares:</span>
                    <div className="flex gap-2 flex-wrap">
                        {['iPhone', 'Notebook', 'Tênis', 'Geladeira', 'TV'].map((term) => (
                            <button
                                key={term}
                                onClick={() => {
                                    setSearchQuery(term);
                                    router.push(`/search?q=${encodeURIComponent(term)}`);
                                }}
                                className="px-3 py-1 bg-blue-700/50 hover:bg-blue-700 text-white rounded-full text-xs transition-colors border border-blue-500/30"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

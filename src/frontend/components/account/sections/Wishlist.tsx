'use client';

import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

export function Wishlist() {
    const wishlistItems = [
        { id: 1, name: 'iPhone 15 Pro Max', price: 989900, image: 'https://images.unsplash.com/photo-1695048180490-3258d5c0c669?w=400&q=80', inStock: true },
        { id: 2, name: 'AirPods Max', price: 659000, image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=400&q=80', inStock: true },
        { id: 3, name: 'PlayStation 5 Slim', price: 370000, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80', inStock: false },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                Lista de Desejos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map(item => (
                    <div key={item.id} className="glass p-4 border border-white/20 group hover:border-pink-500/50 transition-colors">
                        <div className="aspect-square bg-gray-100 dark:bg-white/5 rounded-lg mb-4 overflow-hidden relative">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <button className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-black/50 backdrop-blur rounded-full text-pink-500 hover:bg-pink-500 hover:text-white transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                        <p className="font-bold text-lg mt-1 text-gray-900 dark:text-white">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price / 100)}
                        </p>

                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                            <span className={`text-xs font-medium ${item.inStock ? 'text-green-600' : 'text-red-500'}`}>
                                {item.inStock ? 'Disponível' : 'Indisponível'}
                            </span>
                            <button
                                disabled={!item.inStock}
                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                            >
                                <ShoppingCart className="w-3 h-3" />
                                Adicionar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

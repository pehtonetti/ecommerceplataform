'use client';

import { Heart, ShoppingCart, Trash2, Loader2, Frown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getWishlist, toggleWishlist } from '@/backend/actions/wishlist-actions';
import { toast } from 'sonner';

export function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            const res = await getWishlist();
            if (res.items) {
                setWishlistItems(res.items);
            }
            setLoading(false);
        };
        fetchWishlist();
    }, []);

    const handleRemove = async (productId: string) => {
        const res = await toggleWishlist(productId);
        if (res.error) {
            toast.error(res.error);
            return;
        }
        
        // Remove locally immediately for snappy UI
        setWishlistItems(prev => prev.filter(item => item.productId !== productId));
        toast.success('Produto removido dos favoritos');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                Lista de Desejos
            </h2>

            {wishlistItems.length === 0 ? (
                <div className="glass p-12 flex flex-col items-center justify-center border border-white/20 rounded-2xl text-center">
                    <Heart className="w-16 h-16 text-gray-400 mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sua lista está vazia</h3>
                    <p className="text-sm text-gray-500 mt-2">Navegue pela loja e adicione produtos aos favoritos!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map(item => (
                        <div key={item.id} className="glass p-4 border border-white/20 group hover:border-pink-500/50 transition-colors">
                            <div className="aspect-square bg-gray-100 dark:bg-white/5 rounded-lg mb-4 overflow-hidden relative">
                                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <button 
                                    onClick={() => handleRemove(item.productId)}
                                    className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-black/50 backdrop-blur rounded-full text-pink-500 hover:bg-pink-500 hover:text-white transition-colors"
                                    title="Remover"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <h3 className="font-semibold text-gray-900 dark:text-white truncate" title={item.product.name}>{item.product.name}</h3>
                            <p className="font-bold text-lg mt-1 text-gray-900 dark:text-white">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price / 100)}
                            </p>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                                <span className={`text-xs font-medium ${item.product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {item.product.stock > 0 ? 'Disponível' : 'Indisponível'}
                                </span>
                                <button
                                    disabled={item.product.stock <= 0}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                                >
                                    <ShoppingCart className="w-3 h-3" />
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

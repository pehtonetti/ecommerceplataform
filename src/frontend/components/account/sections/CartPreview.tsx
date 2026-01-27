'use client';

import { ShoppingCart, Clock } from 'lucide-react';

export function CartPreview() {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Carrinho & Navegação
            </h2>

            <div className="glass p-6 border border-white/20">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-blue-500" />
                    Carrinho Atual
                </h3>
                <p className="text-sm text-gray-500 mb-4">Itens que você deixou no carrinho.</p>

                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-md"></div>
                        <div>
                            <p className="font-bold text-sm">1 item no carrinho</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Total: R$ 459,00</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:opacity-90">Ir para o carrinho</button>
                </div>
            </div>

            <div className="glass p-6 border border-white/20">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    Vistos Recentemente
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-square bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                            Produto {i}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

'use client';

import { CreditCard, Trash2, Plus, Smartphone, Wallet } from 'lucide-react';

interface PaymentsProps {
    user: any;
}

export function Payments({ user }: PaymentsProps) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Meus Métodos de Pagamento
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 text-sm font-bold">
                    <Plus className="w-4 h-4" />
                    Novo Cartão
                </button>
            </div>

            {/* Cartões Salvos */}
            <section>
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Cartões de Crédito/Débito</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Mock Card 1 */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 text-white p-6 shadow-xl transform transition-transform hover:scale-[1.02] cursor-pointer group">
                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <CreditCard className="w-12 h-12 text-white/10" />
                        </div>
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center text-xs font-bold">CHIP</div>
                            <span className="text-lg font-bold italic tracking-wider">VISA</span>
                        </div>
                        <div className="space-y-1 mb-6">
                            <p className="text-xs opacity-70 uppercase tracking-widest">Número do Cartão</p>
                            <p className="font-mono text-xl tracking-widest">•••• •••• •••• 4242</p>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs opacity-70 uppercase">Titular</p>
                                <p className="font-medium tracking-wide uppercase">{user.name || 'CLIENTE'}</p>
                            </div>
                            <div>
                                <p className="text-xs opacity-70 uppercase">Validade</p>
                                <p className="font-mono font-medium">12/28</p>
                            </div>
                        </div>

                        {/* Actions Overlay */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold shadow hover:scale-105 transition-transform">Editar</button>
                            <button className="p-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Mock Card 2 */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white p-6 shadow-xl transform transition-transform hover:scale-[1.02] cursor-pointer group">
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-8 h-8 rounded-full bg-white/20"></div> {/* Mastercard circles simulation */}
                            <span className="text-lg font-bold italic">Mastercard</span>
                        </div>
                        <div className="mt-auto space-y-4">
                            <p className="font-mono text-xl tracking-widest">•••• •••• •••• 8899</p>
                            <div className="flex justify-between text-sm opacity-80">
                                <span>{user.name || 'CLIENTE'}</span>
                                <span>05/26</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Outros Métodos */}
            <section className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Outros Métodos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass p-4 border border-white/20 flex items-center gap-4 hover:border-green-500/50 cursor-pointer transition-colors">
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-lg">
                            <div className="w-6 h-6 text-xl font-bold flex items-center justify-center">❖</div> {/* Pix Symbol Simulation */}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">Chave Pix Padrão</h4>
                            <p className="text-xs text-gray-500">CPF (***.***.***-**)</p>
                        </div>
                    </div>

                    <div className="glass p-4 border border-white/20 flex items-center gap-4 hover:border-black/50 cursor-pointer transition-colors">
                        <div className="p-3 bg-black text-white rounded-lg">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">Apple Pay</h4>
                            <p className="text-xs text-gray-500">Conectado</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

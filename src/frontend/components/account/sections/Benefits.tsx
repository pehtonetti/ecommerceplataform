'use client';

import { Ticket, Star, TrendingUp, Gift } from 'lucide-react';

interface BenefitsProps {
    user: any;
}

export function Benefits({ user }: BenefitsProps) {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Meus Benefícios
            </h2>

            {/* Programa de Fidelidade */}
            <div className="glass p-8 border border-white/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-yellow-400/10 blur-3xl rounded-full pointer-events-none"></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div>
                        <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider mb-2">LOJA TECH PRIME</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Nível Ouro</h3>
                        <p className="text-gray-500">Você está a 500 pontos do nível Platina!</p>

                        <div className="mt-6">
                            <p className="text-4xl font-black text-gray-900 dark:text-white flex items-end gap-2">
                                2.500
                                <span className="text-sm font-medium text-gray-400 pb-2">pontos</span>
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 space-y-4">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Progresso</span>
                            <span>75%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 w-3/4 rounded-full"></div>
                        </div>
                        <p className="text-xs text-center text-gray-400">Expira em 31/12/2025</p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Frete Grátis', 'Cashback 2%', 'Ofertas VIP', 'Suporte Prioritário'].map((benefit, i) => (
                        <div key={i} className="bg-white/50 dark:bg-black/20 p-3 rounded-lg text-center border border-gray-100 dark:border-white/5">
                            <Star className="w-4 h-4 text-yellow-500 mx-auto mb-2" />
                            <span className="text-xs font-bold block">{benefit}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cupons */}
            <div>
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-purple-500" />
                    Cupons Disponíveis
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { code: 'BEMVINDO10', desc: '10% OFF na primeira compra', exp: 'Validade: Indeterminado', color: 'blue' },
                        { code: 'FRETEOFF', desc: 'Frete grátis compras acima R$200', exp: 'Validade: 7 dias', color: 'green' },
                    ].map(coupon => (
                        <div key={coupon.code} className="glass border border-white/20 flex overflow-hidden group hover:-translate-y-1 transition-transform">
                            <div className={`w-3 bg-${coupon.color}-500`}></div>
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-bold text-xl tracking-wider font-mono text-gray-900 dark:text-white">{coupon.code}</h4>
                                    <p className="text-sm text-gray-500">{coupon.desc}</p>
                                </div>
                                <p className="text-xs text-gray-400 mt-4">{coupon.exp}</p>
                            </div>
                            <div className="border-l border-dashed border-gray-300 dark:border-white/20 w-16 flex items-center justify-center bg-gray-50/50 dark:bg-black/20">
                                <button className="rotate-[-90deg] whitespace-nowrap text-sm font-bold text-blue-600 hover:text-blue-700">COPIAR</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

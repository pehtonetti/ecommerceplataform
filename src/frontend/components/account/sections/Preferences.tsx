'use client';

import { Bell, Moon, Sun, Smartphone, Mail, Globe, CreditCard } from 'lucide-react';
import { useState } from 'react';

interface PreferencesProps {
    user: any;
}

export function Preferences({ user }: PreferencesProps) {
    const [toggleStates, setToggleStates] = useState({
        newsletter: true,
        promotions: true,
        orders: true,
        support: true,
        whatsapp: false,
        darkMode: false,
    });

    const handleToggle = (key: keyof typeof toggleStates) => {
        setToggleStates(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Preferências
            </h2>

            {/* Geral */}
            <div className="glass p-6 border border-white/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    Geral
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Idioma Preferido</label>
                        <select className="w-full mt-2 px-4 py-2 bg-transparent border border-gray-200 dark:border-white/20 rounded-lg outline-none">
                            <option value="pt-BR">Português (Brasil)</option>
                            <option value="en-US">English (US)</option>
                            <option value="es">Español</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Moeda</label>
                        <select className="w-full mt-2 px-4 py-2 bg-transparent border border-gray-200 dark:border-white/20 rounded-lg outline-none">
                            <option value="BRL">Real Brasileiro (R$)</option>
                            <option value="USD">US Dollar ($)</option>
                            <option value="EUR">Euro (€)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Notificações */}
            <div className="glass p-6 border border-white/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-orange-500" />
                    Notificações
                </h3>

                <div className="space-y-4">
                    {[
                        { key: 'newsletter', label: 'Newsletter', desc: 'Receba novidades e dicas semanais' },
                        { key: 'promotions', label: 'Promoções e Ofertas', desc: 'Seja avisado sobre descontos relâmpago' },
                        { key: 'orders', label: 'Atualizações de Pedidos', desc: 'Status de entrega e rastreamento' },
                        { key: 'support', label: 'Suporte', desc: 'Respostas de tickets e chat' },
                        { key: 'whatsapp', label: 'Contato via WhatsApp', desc: 'Permitir contato direto pelo WhatsApp' },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => handleToggle(item.key as any)}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${toggleStates[item.key as keyof typeof toggleStates] ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                            >
                                <span
                                    className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform duration-200 ease-in-out mt-1 ml-1 ${toggleStates[item.key as keyof typeof toggleStates] ? 'translate-x-5' : 'translate-x-0'}`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categorias */}
            <div className="glass p-6 border border-white/20">
                <h3 className="text-lg font-semibold mb-4">Interesses</h3>
                <p className="text-sm text-gray-500 mb-4">Selecione as categorias que você mais gosta para receber recomendações personalizadas.</p>

                <div className="flex flex-wrap gap-2">
                    {['Eletrônicos', 'Moda', 'Casa', 'Gamer', 'Livros', 'Esportes', 'Beleza'].map(tag => (
                        <button
                            key={tag}
                            className="px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm font-medium"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

'use client';

import { Share2 } from 'lucide-react';

export function Integrations() {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Integrações Externas
            </h2>

            <div className="glass p-6 border border-white/20">
                <p className="text-gray-500 mb-6">Contas conectadas para login rápido.</p>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-xl shadow-sm">G</div>
                            <div>
                                <h3 className="font-bold">Google</h3>
                                <p className="text-xs text-gray-500">Conectado como joao@gmail.com</p>
                            </div>
                        </div>
                        <button className="text-xs text-red-600 font-medium hover:underline">Desconectar</button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-xl opacity-60">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-xl shadow-sm">f</div>
                            <div>
                                <h3 className="font-bold">Facebook</h3>
                                <p className="text-xs text-gray-500">Não conectado</p>
                            </div>
                        </div>
                        <button className="text-xs text-blue-600 font-medium hover:underline">Conectar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

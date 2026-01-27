'use client';

import { MessageCircle, HelpCircle, FileText, Clock } from 'lucide-react';

export function Support() {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Suporte e Ajuda
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 text-center border border-white/20 hover:border-blue-500/50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Chat Online</h3>
                    <p className="text-sm text-gray-500 mt-2">Converse com nossos atendentes em tempo real.</p>
                </div>

                <div className="glass p-6 text-center border border-white/20 hover:border-purple-500/50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Abrir Ticket</h3>
                    <p className="text-sm text-gray-500 mt-2">Para problemas mais complexos ou devoluções.</p>
                </div>

                <div className="glass p-6 text-center border border-white/20 hover:border-orange-500/50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <HelpCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">FAQ</h3>
                    <p className="text-sm text-gray-500 mt-2">Perguntas frequentes e central de ajuda.</p>
                </div>
            </div>

            <div className="glass p-6 border border-white/20">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    Tickets Recentes
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-lg">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Resolvido</span>
                                <h4 className="font-medium text-sm">Troca de Produto - Pedido #1234</h4>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Atualizado há 2 dias</p>
                        </div>
                        <button className="text-sm text-blue-600 hover:underline">Ver detalhes</button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-lg">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Em Aberto</span>
                                <h4 className="font-medium text-sm">Dúvida sobre entrega</h4>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Criado hoje às 14:00</p>
                        </div>
                        <button className="text-sm text-blue-600 hover:underline">Ver detalhes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

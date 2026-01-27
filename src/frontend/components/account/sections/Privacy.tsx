'use client';

import { FileText, Download, Trash2, CheckCircle } from 'lucide-react';

export function Privacy() {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Privacidade e LGPD
            </h2>
            <p className="text-gray-500">Controle como seus dados são coletados e utilizados de acordo com a Lei Geral de Proteção de Dados.</p>

            <div className="glass p-6 border border-white/20 space-y-6">
                <h3 className="font-semibold border-b border-gray-100 dark:border-white/5 pb-2">Consentimentos</h3>
                {[
                    { label: 'Termos de Uso', date: 'Aceito em 12/12/2024', active: true },
                    { label: 'Política de Privacidade', date: 'Aceito em 12/12/2024', active: true },
                    { label: 'Compartilhamento com Parceiros', date: 'Não aceito', active: false },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium">{item.label}</p>
                            <p className={`text-xs ${item.active ? 'text-green-600' : 'text-gray-400'}`}>{item.date}</p>
                        </div>
                        {item.active ? <CheckCircle className="w-5 h-5 text-green-500" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 border border-white/20">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Download className="w-5 h-5 text-blue-500" />
                        Exportar Dados
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">Baixe uma cópia de todos os seus dados pessoais armazenados em nossa plataforma.</p>
                    <button className="w-full py-2 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        Solicitar Relatório (JSON)
                    </button>
                </div>

                <div className="glass p-6 border border-white/20">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Trash2 className="w-5 h-5 text-red-500" />
                        Excluir Conta
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">Solicite a exclusão permanente de sua conta e anonimização de dados.</p>
                    <button className="w-full py-2 border border-red-200 dark:border-red-900/30 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                        Iniciar Exclusão
                    </button>
                </div>
            </div>
        </div>
    );
}

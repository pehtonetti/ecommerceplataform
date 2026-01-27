'use client';

import { FileText, Download, Building } from 'lucide-react';

interface FiscalProps {
    user: any;
}

export function Fiscal({ user }: FiscalProps) {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dados Fiscais e Tributários
            </h2>
            <p className="text-gray-500">Gerencie seus dados para emissão de Nota Fiscal Eletrônica (NF-e).</p>

            <div className="glass p-8 border border-white/20">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Tipo de Pessoa</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 rounded-lg cursor-pointer hover:border-blue-500 transition-colors w-full">
                                <input type="radio" name="personType" defaultChecked className="text-blue-600 focus:ring-blue-500" />
                                <span className="font-medium">Pessoa Física (CPF)</span>
                            </label>
                            <label className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 rounded-lg cursor-pointer hover:border-blue-500 transition-colors w-full">
                                <input type="radio" name="personType" className="text-blue-600 focus:ring-blue-500" />
                                <span className="font-medium">Pessoa Jurídica (CNPJ)</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">CPF / CNPJ</label>
                        <input type="text" className="w-full mt-1 px-4 py-2 bg-transparent border border-gray-200 dark:border-white/20 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="000.000.000-00" />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inscrição Estadual</label>
                        <input type="text" className="w-full mt-1 px-4 py-2 bg-transparent border border-gray-200 dark:border-white/20 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Isento ou número" />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome Completo / Razão Social</label>
                        <input type="text" className="w-full mt-1 px-4 py-2 bg-transparent border border-gray-200 dark:border-white/20 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" defaultValue={user.name} />
                    </div>

                    <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-100 dark:border-white/5">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-500" />
                            Endereço de Faturamento
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-4 rounded-lg">
                            <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                            Usar o mesmo endereço de entrega padrão
                        </div>
                    </div>
                </form>

                <div className="mt-6 flex justify-end">
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                        Salvar Dados Fiscais
                    </button>
                </div>
            </div>

            <div className="glass p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-500" />
                        Notas Fiscais Recentes
                    </h3>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500 italic text-center py-4">Nenhuma nota fiscal emitida recentemente.</p>
                </div>
            </div>
        </div>
    );
}

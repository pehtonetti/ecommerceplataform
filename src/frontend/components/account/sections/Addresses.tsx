'use client';

import { MapPin, Plus, Home, Briefcase, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';

interface AddressesProps {
    user: any;
}

export function Addresses({ user }: AddressesProps) {
    // Mock data para visualização
    const addresses = [
        {
            id: '1',
            label: 'Casa',
            type: 'Residencial',
            street: 'Av. Paulista',
            number: '1000',
            complement: 'Apt 154',
            neighborhood: 'Bela Vista',
            city: 'São Paulo',
            state: 'SP',
            zip: '01310-100',
            isDefault: true,
        },
        {
            id: '2',
            label: 'Escritório',
            type: 'Comercial',
            street: 'Rua Funchal',
            number: '500',
            complement: 'Sala 204',
            neighborhood: 'Vila Olímpia',
            city: 'São Paulo',
            state: 'SP',
            zip: '04551-060',
            isDefault: false,
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Meus Endereços
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                    <Plus className="w-4 h-4" />
                    <span className="font-medium text-sm">Adicionar Novo</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                    <div key={address.id} className="glass p-6 border border-white/20 relative group hover:border-blue-500/50 transition-colors">
                        {address.isDefault && (
                            <div className="absolute top-4 right-4 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                Padrão
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                            <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center
                ${address.label === 'Casa' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/20'}
              `}>
                                {address.label === 'Casa' ? <Home className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{address.label}</h3>
                                <p className="text-xs text-gray-500">{address.type}</p>
                            </div>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300 mb-6">
                            <p className="font-medium">{address.street}, {address.number}</p>
                            <p>{address.complement}</p>
                            <p>{address.neighborhood}</p>
                            <p>{address.city} - {address.state}</p>
                            <p className="text-gray-400">{address.zip}</p>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors">
                                <Edit2 className="w-3 h-3" />
                                Editar
                            </button>
                            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Card Vazio para Adicionar */}
                <button className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/5 transition-all min-h-[250px] group">
                    <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 flex items-center justify-center mb-4 transition-colors">
                        <MapPin className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="font-medium">Cadastrar Outro Endereço</p>
                    <p className="text-sm opacity-60 text-center mt-2 max-w-[200px]">
                        Adicione endereços de entrega secundários ou de cobrança
                    </p>
                </button>
            </div>
        </div>
    );
}

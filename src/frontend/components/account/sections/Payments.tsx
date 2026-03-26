'use client';

import { useState } from 'react';
import { CreditCard, Trash2, Plus, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentsProps {
    user: any;
}

export function Payments({ user }: PaymentsProps) {
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [savedCards, setSavedCards] = useState<any[]>([]);

    // Identificar Bandeira
    const getCardFlag = (number: string) => {
        const cleanNumber = number.replace(/\D/g, '');
        if (cleanNumber.startsWith('4')) return 'VISA';
        if (cleanNumber.startsWith('5')) return 'MASTERCARD';
        if (cleanNumber.startsWith('34') || cleanNumber.startsWith('37')) return 'AMEX';
        if (cleanNumber.startsWith('6')) return 'DISCOVER';
        return 'CARTÃO';
    };

    const getFlagColor = (flag: string) => {
        switch (flag) {
            case 'VISA': return 'from-blue-700 to-blue-900';
            case 'MASTERCARD': return 'from-red-600 to-orange-500';
            case 'AMEX': return 'from-emerald-700 to-emerald-900';
            default: return 'from-neutral-700 to-neutral-900';
        }
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\D/g, '');
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    const validateCard = () => {
        const cleanNumber = cardNumber.replace(/\D/g, '');
        const cleanExpiry = expiry.replace(/\D/g, '');
        if (cleanNumber.length < 15) return 'Número do cartão inválido.';
        if (!cardName.trim()) return 'Nome impresso no cartão é obrigatório.';
        if (cleanExpiry.length !== 4) return 'Data de validade inválida.';
        if (cvv.length < 3) return 'CVV inválido.';
        
        // Basic expiry logic check
        const month = parseInt(cleanExpiry.substring(0, 2));
        if (month < 1 || month > 12) return 'Mês de validade inválido.';
        
        return null;
    };

    const handleSaveCard = (e: React.FormEvent) => {
        e.preventDefault();
        const error = validateCard();
        if (error) {
            toast.error(error);
            return;
        }

        const newCard = {
            id: Date.now().toString(),
            name: cardName,
            number: `•••• •••• •••• ${cardNumber.replace(/\D/g, '').slice(-4)}`,
            expiry,
            flag: getCardFlag(cardNumber)
        };

        setSavedCards([...savedCards, newCard]);
        toast.success('Cartão validado e salvo com sucesso!');
        
        // Reset form
        setCardNumber('');
        setCardName('');
        setExpiry('');
        setCvv('');
        setIsAddingCard(false);
    };

    const currentFlag = getCardFlag(cardNumber);
    const currentColor = getFlagColor(currentFlag);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Meus Cartões
                </h2>
                {!isAddingCard && (
                    <button 
                        onClick={() => setIsAddingCard(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 text-sm font-bold"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Cartão
                    </button>
                )}
            </div>

            <p className="text-sm text-gray-500 mb-6">Cadastre seus cartões de crédito para facilitar suas compras. Pagamentos via PIX ou Boleto são realizados exclusivamente na etapa de finalização do pedido (Checkout).</p>

            {isAddingCard ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-in fade-in slide-in-from-top-4">
                    {/* Visual Card Dynamic Preview */}
                    <div className="flex justify-center lg:sticky lg:top-24">
                        <div className={`w-full max-w-sm aspect-[1.586/1] rounded-2xl bg-gradient-to-br ${currentColor} text-white p-6 shadow-2xl transition-all duration-500 relative overflow-hidden`}>
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 p-4 opacity-30">
                                <CreditCard className="w-16 h-16" />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
                            
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="w-12 h-8 bg-white/20 rounded-md border border-white/30 flex items-center justify-center">
                                    <div className="w-8 h-4 border border-white/40 rounded-sm grid grid-cols-3 gap-0.5">
                                        <div className="border border-white/20 rounded-sm"></div>
                                        <div className="border border-white/20 rounded-sm"></div>
                                        <div className="border border-white/20 rounded-sm"></div>
                                    </div>
                                </div>
                                <span className="text-xl font-bold italic tracking-wider drop-shadow-md">{currentFlag}</span>
                            </div>
                            
                            <div className="space-y-1 mb-6 relative z-10">
                                <p className="font-mono text-xl md:text-2xl tracking-widest drop-shadow-md h-8">
                                    {cardNumber ? formatCardNumber(cardNumber) : '•••• •••• •••• ••••'}
                                </p>
                            </div>
                            
                            <div className="flex justify-between items-end relative z-10">
                                <div className="max-w-[60%]">
                                    <p className="text-[10px] opacity-70 uppercase tracking-wider mb-1">Titular do Cartão</p>
                                    <p className="font-medium tracking-widest uppercase truncate h-6 drop-shadow-md">
                                        {cardName || 'NOME IMPRESSO'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] opacity-70 uppercase tracking-wider mb-1">Validade</p>
                                    <p className="font-mono font-medium tracking-widest h-6 drop-shadow-md">
                                        {expiry || 'MM/AA'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Form */}
                    <div className="glass p-6 rounded-2xl border border-white/20">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-gray-400" />
                            Dados Seguros
                        </h3>
                        <form onSubmit={handleSaveCard} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Número do Cartão</label>
                                <input
                                    type="text"
                                    value={formatCardNumber(cardNumber)}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    maxLength={19}
                                    placeholder="0000 0000 0000 0000"
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 font-mono bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Nome Impresso</label>
                                <input
                                    type="text"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                    maxLength={40}
                                    placeholder="MARIA SILVA"
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 uppercase bg-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Validade</label>
                                    <input
                                        type="text"
                                        value={formatExpiry(expiry)}
                                        onChange={(e) => setExpiry(e.target.value)}
                                        maxLength={5}
                                        placeholder="MM/AA"
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 font-mono bg-white text-center"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">CVV</label>
                                    <input
                                        type="text"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                        maxLength={4}
                                        placeholder="123"
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 font-mono bg-white text-center"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-gray-100 mt-6">
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Criptografia 256-bit
                                </span>
                                <div className="flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsAddingCard(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 font-medium transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors"
                                    >
                                        Adicionar e Validar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
                    {savedCards.length === 0 ? (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-center glass rounded-2xl border border-white/20">
                            <CreditCard className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-bold text-gray-700">Nenhum cartão salvo</h3>
                            <p className="text-sm text-gray-500 max-w-sm mt-2">Você ainda não tem cartões cadastrados. Adicione um cartão para agilizar pagamentos futuros.</p>
                            <button 
                                onClick={() => setIsAddingCard(true)}
                                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                            >
                                Adicionar um Cartão
                            </button>
                        </div>
                    ) : (
                        savedCards.map(card => (
                            <div key={card.id} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getFlagColor(card.flag)} text-white p-6 shadow-xl transform transition-transform hover:scale-[1.02] cursor-pointer group`}>
                                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <CreditCard className="w-12 h-12 text-white/10" />
                                </div>
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center text-xs font-bold">CHIP</div>
                                    <span className="text-lg font-bold italic tracking-wider">{card.flag}</span>
                                </div>
                                <div className="space-y-1 mb-6">
                                    <p className="text-xs opacity-70 uppercase tracking-widest">Número do Cartão</p>
                                    <p className="font-mono text-xl tracking-widest">{card.number}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs opacity-70 uppercase">Titular</p>
                                        <p className="font-medium tracking-wide uppercase truncate max-w-[150px]">{card.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs opacity-70 uppercase">Validade</p>
                                        <p className="font-mono font-medium">{card.expiry}</p>
                                    </div>
                                </div>
        
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSavedCards(savedCards.filter(c => c.id !== card.id));
                                        }}
                                        className="p-3 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-colors"
                                        title="Remover Cartão"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

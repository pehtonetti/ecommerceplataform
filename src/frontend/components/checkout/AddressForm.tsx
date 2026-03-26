"use client";

import { useState } from "react";
import { getAddressByCEP, saveUserAddress } from "@/backend/actions/shipping-actions";
import { Button } from "../ui/Button";
import { formatCEP } from "@/lib/shipping";
import { toast } from "sonner";
import { Loader2, MapPin } from "lucide-react";

interface AddressFormProps {
    userId: string;
    onAddressSaved?: () => void;
}

export function AddressForm({ userId, onAddressSaved }: AddressFormProps) {
    const [loading, setLoading] = useState(false);
    const [searchingCEP, setSearchingCEP] = useState(false);

    const [formData, setFormData] = useState({
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        label: '',
        isDefault: false
    });

    const handleCEPSearch = async (cepValue?: string) => {
        const cepToSearch = (cepValue || formData.zipCode).replace(/\D/g, '');
        if (cepToSearch.length < 8) return;

        setSearchingCEP(true);
        try {
            const result = await getAddressByCEP(cepToSearch);
            if (result.data) {
                setFormData(prev => ({
                    ...prev,
                    street: result.data.street || prev.street,
                    neighborhood: result.data.neighborhood || prev.neighborhood,
                    city: result.data.city || prev.city,
                    state: result.data.state || prev.state,
                    zipCode: formatCEP(cepToSearch)
                }));
                toast.success('Endereço preenchido!');
            } else if (result.error) {
                // Se for trigger automático, não mostra erro chato, só se for clique manual 
                if (!cepValue) toast.error(result.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSearchingCEP(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.street || !formData.number || !formData.city) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }

        setLoading(true);
        const result = await saveUserAddress(userId, formData);
        setLoading(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success('Endereço salvo com sucesso!');
        onAddressSaved?.();

        // Reset form
        setFormData({
            zipCode: '',
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            label: '',
            isDefault: false
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* CEP */}
            <div className="flex gap-2">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">CEP *</label>
                    <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => {
                            const val = e.target.value;
                            setFormData({ ...formData, zipCode: val });
                            if (val.replace(/\D/g, '').length === 8) {
                                handleCEPSearch(val);
                            }
                        }}
                        onBlur={() => {
                            if (formData.zipCode.replace(/\D/g, '').length === 8) {
                                handleCEPSearch();
                            }
                        }}
                        placeholder="00000-000"
                        maxLength={9}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-zinc-500 text-white"
                        required
                    />
                </div>
                <div className="flex items-end">
                    <Button
                        type="button"
                        onClick={() => handleCEPSearch()}
                        disabled={searchingCEP}
                        variant="outline"
                        className="h-12 border-white/10 text-zinc-400 hover:bg-white/5"
                    >
                        {searchingCEP ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <MapPin className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Rua */}
            <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-1">Rua/Logradouro *</label>
                <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-zinc-500 text-white"
                    required
                />
            </div>

            {/* Número e Complemento */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-1">Número *</label>
                    <input
                        type="text"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-zinc-500 text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-1">Complemento</label>
                    <input
                        type="text"
                        value={formData.complement}
                        onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-zinc-500 text-white"
                    />
                </div>
            </div>

            {/* Bairro */}
            <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-1">Bairro *</label>
                <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-zinc-500 text-white"
                    required
                />
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-1">Cidade *</label>
                    <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-zinc-500 text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-1">UF *</label>
                    <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                        maxLength={2}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-zinc-500 text-white"
                        required
                    />
                </div>
            </div>

            {/* Label */}
            <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-1">Identificação</label>
                <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="Ex: Casa, Trabalho"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-zinc-500 text-white"
                />
            </div>

            {/* Padrão */}
            <div className="flex items-center gap-3 py-2 cursor-pointer group">
                <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-5 h-5 accent-indigo-600 rounded-lg cursor-pointer"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-zinc-300 cursor-pointer group-hover:text-white transition-colors">
                    Definir como endereço padrão
                </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/10 transition-all active:scale-[0.98]">
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Salvando...
                    </>
                ) : (
                    'Salvar Endereço'
                )}
            </Button>
        </form>
    );
}

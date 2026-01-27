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

    const handleCEPSearch = async () => {
        if (formData.zipCode.length < 8) {
            toast.error('Digite um CEP válido');
            return;
        }

        setSearchingCEP(true);
        const result = await getAddressByCEP(formData.zipCode);
        setSearchingCEP(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        if (result.data) {
            setFormData(prev => ({
                ...prev,
                ...result.data,
                zipCode: formatCEP(result.data.zipCode)
            }));
            toast.success('Endereço encontrado!');
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
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        placeholder="00000-000"
                        maxLength={9}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                    />
                </div>
                <div className="flex items-end">
                    <Button
                        type="button"
                        onClick={handleCEPSearch}
                        disabled={searchingCEP}
                        variant="outline"
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
                <label className="block text-sm font-medium mb-1">Rua/Logradouro *</label>
                <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                />
            </div>

            {/* Número e Complemento */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Número *</label>
                    <input
                        type="text"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Complemento</label>
                    <input
                        type="text"
                        value={formData.complement}
                        onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Bairro */}
            <div>
                <label className="block text-sm font-medium mb-1">Bairro *</label>
                <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                />
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Cidade *</label>
                    <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">UF *</label>
                    <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                        maxLength={2}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
            </div>

            {/* Label */}
            <div>
                <label className="block text-sm font-medium mb-1">Identificação (opcional)</label>
                <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="Ex: Casa, Trabalho"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Padrão */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="text-sm font-medium">
                    Definir como endereço padrão
                </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                    </>
                ) : (
                    'Salvar Endereço'
                )}
            </Button>
        </form>
    );
}

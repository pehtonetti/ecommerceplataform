"use client";

import { useState, useTransition } from "react";
import { createCoupon } from "@/backend/actions/coupon-merchant-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/frontend/components/ui/Button";
import { Plus, Loader2, X } from "lucide-react";

export function CreateCouponButton() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [discountType, setDiscountType] = useState('percentage');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fd.set('discountType', discountType);
        startTransition(async () => {
            const result = await createCoupon(fd);
            if (result.success) {
                toast.success('Cupom criado com sucesso!');
                setOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || 'Erro ao criar cupom');
            }
        });
    };

    return (
        <>
            <Button onClick={() => setOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20">
                <Plus className="mr-2 h-4 w-4" /> Novo Cupom
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-card rounded-2xl border shadow-2xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold">Novo Cupom</h2>
                            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Código *</label>
                                <input name="code" required placeholder="Ex: DESCONTO10" className="w-full bg-muted/50 border rounded-xl px-3 py-2.5 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Descrição</label>
                                <input name="description" placeholder="Desconto especial para novos clientes" className="w-full bg-muted/50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Tipo de desconto</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button type="button" onClick={() => setDiscountType('percentage')} className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${discountType === 'percentage' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-input bg-muted/50 text-muted-foreground'}`}>
                                        % Percentual
                                    </button>
                                    <button type="button" onClick={() => setDiscountType('fixed')} className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${discountType === 'fixed' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-input bg-muted/50 text-muted-foreground'}`}>
                                        R$ Fixo
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                                    Valor {discountType === 'percentage' ? '(%)' : '(R$)'} *
                                </label>
                                <input name="discountValue" type="number" required min="1" max={discountType === 'percentage' ? 100 : undefined} placeholder={discountType === 'percentage' ? 'Ex: 15' : 'Ex: 50'} className="w-full bg-muted/50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Compra mínima (R$)</label>
                                <input name="minPurchaseAmount" type="number" min="0" placeholder="0 = sem mínimo" className="w-full bg-muted/50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Máximo de usos</label>
                                <input name="maxUses" type="number" min="1" placeholder="Sem limite" className="w-full bg-muted/50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Válido até</label>
                                <input name="validUntil" type="date" className="w-full bg-muted/50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">Cancelar</Button>
                                <Button type="submit" disabled={isPending} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Cupom'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

import { getMerchantCoupons } from "@/backend/actions/coupon-merchant-actions";
import { Button } from "@/frontend/components/ui/Button";
import { Plus, Tag, Check, X, Calendar, Percent, DollarSign } from "lucide-react";
import { CreateCouponButton } from "./CreateCouponButton";
import { CouponActions } from "./CouponActions";

export default async function CouponsDashboardPage() {
    const result = await getMerchantCoupons();
    const coupons = result.success && 'coupons' in result ? result.coupons : [];
    const active = coupons.filter(c => c.active).length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cupons de Desconto</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Crie e gerencie cupons para atrair e fidelizar clientes.
                    </p>
                </div>
                <CreateCouponButton />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg">
                <div className="p-4 rounded-xl border bg-card shadow-sm">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{coupons.length}</p>
                </div>
                <div className="p-4 rounded-xl border bg-card shadow-sm">
                    <p className="text-xs text-muted-foreground text-emerald-600">Ativos</p>
                    <p className="text-2xl font-bold text-emerald-600">{active}</p>
                </div>
                <div className="p-4 rounded-xl border bg-card shadow-sm">
                    <p className="text-xs text-muted-foreground">Usos totais</p>
                    <p className="text-2xl font-bold">{coupons.reduce((acc, c) => acc + c.usesCount, 0)}</p>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                {coupons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Tag className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Nenhum cupom criado</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-6">
                            Cupons de desconto aumentam conversões e ajudam a fidelizar clientes.
                        </p>
                        <CreateCouponButton />
                    </div>
                ) : (
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="h-11 px-5 font-semibold text-muted-foreground">Código</th>
                                <th className="h-11 px-5 font-semibold text-muted-foreground">Desconto</th>
                                <th className="h-11 px-5 font-semibold text-muted-foreground">Usos</th>
                                <th className="h-11 px-5 font-semibold text-muted-foreground">Validade</th>
                                <th className="h-11 px-5 font-semibold text-muted-foreground">Status</th>
                                <th className="h-11 px-5 font-semibold text-muted-foreground text-right border-l">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {coupons.map((coupon) => {
                                const isExpired = coupon.validUntil && new Date(coupon.validUntil) < new Date();
                                return (
                                    <tr key={coupon.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <span className="font-mono font-bold text-sm bg-muted px-2.5 py-1 rounded-lg tracking-widest">
                                                {coupon.code}
                                            </span>
                                            {coupon.description && (
                                                <p className="text-xs text-muted-foreground mt-1">{coupon.description}</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1.5 font-semibold">
                                                {coupon.discountType === 'percentage'
                                                    ? <><Percent className="w-3.5 h-3.5 text-indigo-600" /> {coupon.discountValue}%</>
                                                    : <><DollarSign className="w-3.5 h-3.5 text-emerald-600" /> R$ {(coupon.discountValue / 100).toFixed(2)}</>
                                                }
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="font-medium">{coupon.usesCount}</span>
                                            {coupon.maxUses && (
                                                <span className="text-xs text-muted-foreground"> / {coupon.maxUses}</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-muted-foreground">
                                            {coupon.validUntil
                                                ? <span className={isExpired ? 'text-red-500 font-medium' : ''}>
                                                    {new Date(coupon.validUntil).toLocaleDateString('pt-BR')}
                                                    {isExpired && ' (expirado)'}
                                                </span>
                                                : <span className="text-emerald-600 text-xs font-medium">Sem expiração</span>
                                            }
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${coupon.active && !isExpired ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {coupon.active && !isExpired ? <><Check className="w-3 h-3" /> Ativo</> : <><X className="w-3 h-3" /> Inativo</>}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right border-l">
                                            <CouponActions couponId={coupon.id} active={coupon.active} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

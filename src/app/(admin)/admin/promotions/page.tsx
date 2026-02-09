import { FadeIn } from "@/frontend/components/ui/Motion";
import { Button } from "@/frontend/components/ui/Button";
import { TicketPercent, Power } from "lucide-react";
import { getCoupons, createCoupon, toggleCouponStatus } from "@/backend/actions/promotion-actions";
import { Input } from "@/frontend/components/ui/Input";

export default async function PromotionsPage() {
    const coupons = await getCoupons();

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Cupons e Promoções</h1>
                        <p className="text-muted-foreground">Crie campanhas de desconto para aumentar suas vendas.</p>
                    </div>
                </div>
            </FadeIn>

            {/* Create Coupon Form (Simple Inline) */}
            <FadeIn delay={0.1} className="glass p-6 rounded-xl border border-border">
                <h3 className="text-lg font-semibold mb-4">Novo Cupom</h3>
                <form action={createCoupon} className="flex gap-4 items-end flex-wrap">
                    <div className="grid gap-2 w-full md:w-auto">
                        <label className="text-sm font-medium">Código</label>
                        <Input name="code" placeholder="EX: VERAO2025" required className="uppercase" />
                    </div>
                    <div className="grid gap-2 w-full md:w-auto">
                        <label className="text-sm font-medium">Tipo</label>
                        <select name="discountType" className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="percentage">Porcentagem (%)</option>
                            <option value="fixed">Valor Fixo (R$)</option>
                        </select>
                    </div>
                    <div className="grid gap-2 w-full md:w-auto">
                        <label className="text-sm font-medium">Valor</label>
                        <Input name="discountValue" type="number" placeholder="10" required />
                    </div>
                    <Button type="submit">Criar Cupom</Button>
                </form>
            </FadeIn>

            {/* Coupon List */}
            <FadeIn delay={0.2} className="space-y-4">
                <h3 className="text-xl font-semibold">Cupons Ativos ({coupons.length})</h3>

                {coupons.length === 0 ? (
                    <div className="glass p-8 rounded-xl border border-border text-center py-20">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-muted rounded-full">
                                <TicketPercent className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">Nenhuma promoção ativa</h3>
                            <p className="text-muted-foreground">Seus cupons criados aparecerão aqui.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {coupons.map((coupon) => (
                            <div key={coupon.id} className={`glass p-6 rounded-xl border border-border flex justify-between items-start ${!coupon.active ? 'opacity-60 grayscale' : ''}`}>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-mono font-bold text-lg bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700">
                                            {coupon.code}
                                        </span>
                                        {!coupon.active && <span className="text-xs text-red-500 font-bold">INATIVO</span>}
                                    </div>
                                    <p className="text-muted-foreground">
                                        Desconto: <span className="font-semibold text-foreground">
                                            {coupon.discountType === 'percentage'
                                                ? `${coupon.discountValue}%`
                                                : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(coupon.discountValue / 100)
                                            }
                                        </span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Usos: {coupon.usesCount}
                                    </p>
                                </div>
                                <form action={toggleCouponStatus.bind(null, coupon.id, coupon.active)}>
                                    <Button variant="ghost" size="sm" type="submit" className={coupon.active ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "text-green-500 hover:text-green-600 hover:bg-green-50"}>
                                        <Power className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        ))}
                    </div>
                )}
            </FadeIn>
        </div>
    );
}

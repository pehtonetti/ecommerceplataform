"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Tag, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { validateCoupon } from "@/backend/actions/coupon-actions";

interface CouponInputProps {
    subtotal: number;
    onCouponApplied: (couponId: string | null, discount: number) => void;
}

export function CouponInput({ subtotal, onCouponApplied }: CouponInputProps) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, discount: number } | null>(null);

    const handleApply = async () => {
        if (!code) return;
        setLoading(true);
        try {
            const result = await validateCoupon(code, subtotal);
            if (result.valid && result.coupon) {
                const discount = calculateDiscount(result.coupon, subtotal);
                setAppliedCoupon({ code: result.coupon.code, discount });
                onCouponApplied(result.coupon.id, discount);
                toast.success("Cupom aplicado com sucesso!");
            } else {
                toast.error(result.message || "Cupom inválido");
            }
        } catch (error) {
            toast.error("Erro ao validar cupom");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setAppliedCoupon(null);
        setCode("");
        onCouponApplied(null, 0);
        toast.info("Cupom removido");
    };

    const calculateDiscount = (coupon: any, subtotal: number) => {
        if (coupon.discountType === 'percentage') {
            return Math.round(subtotal * (coupon.discountValue / 100));
        } else {
            return coupon.discountValue; // Fixed amount in cents
        }
    };

    if (appliedCoupon) {
        return (
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <div>
                        <p className="font-medium text-sm text-green-700 dark:text-green-300">Cupom: {appliedCoupon.code}</p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                            Desconto de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(appliedCoupon.discount / 100)}
                        </p>
                    </div>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 text-green-700 hover:text-green-900" onClick={handleRemove}>
                    <X className="w-4 h-4" />
                </Button>
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <Input
                placeholder="Código do cupom"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            <Button onClick={handleApply} disabled={loading || !code}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aplicar"}
            </Button>
        </div>
    );
}

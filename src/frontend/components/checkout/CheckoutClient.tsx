"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CreditCard, MapPin, Truck, ShieldCheck, CheckCircle2, ChevronRight, Tag, Ticket } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import { createAddress, checkoutOrder, validateCoupon } from "@/backend/actions/checkout-actions";

interface CheckoutClientProps {
    cart: any;
    user: any;
    addresses: any[];
}

export function CheckoutClient({ cart, user, addresses }: CheckoutClientProps) {
    const router = useRouter();
    const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || "");
    const [isCreatingAddress, setIsCreatingAddress] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    const [document, setDocument] = useState(user?.document || "");
    const [isProcessing, setIsProcessing] = useState(false);

    // Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

    // Mock Card Data
    const [cardData, setCardData] = useState({
        number: "",
        name: "",
        expiry: "",
        cvc: ""
    });

    const items = cart.items;
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);
    const shippingCost = 2500;

    let discountAmount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discountType === 'percentage') {
            discountAmount = Math.floor(subtotal * (appliedCoupon.discountValue / 100));
        } else {
            discountAmount = appliedCoupon.discountValue;
        }
    }

    const totalBeforePix = subtotal + shippingCost - discountAmount;
    const pixDiscount = paymentMethod === 'pix' ? Math.floor(totalBeforePix * 0.05) : 0;
    const finalTotal = totalBeforePix - pixDiscount;
    const taxes = Math.floor(subtotal * 0.18);
    const orderTotal = finalTotal + taxes;

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsValidatingCoupon(true);
        const res = await validateCoupon(couponCode);
        setIsValidatingCoupon(false);
        if (res.success) {
            setAppliedCoupon(res.coupon);
            toast.success("Cupom aplicado!");
        } else {
            toast.error(res.error || "Cupom inválido");
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) return toast.error("Selecione um endereço");
        if (!document || document.length < 11) return toast.error("Informe um documento válido");
        if (paymentMethod === 'credit_card' && (!cardData.number || !cardData.cvc)) return toast.error("Dados do cartão incompletos");

        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const res = await checkoutOrder({
            addressId: selectedAddressId,
            paymentMethod,
            subtotal,
            shippingCost,
            total: finalTotal,
            couponId: appliedCoupon?.id,
            discountAmount: discountAmount + pixDiscount,
            document
        });

        setIsProcessing(false);

        if (res?.success) {
            toast.success("Pedido realizado!");
            if (res.url) window.location.href = res.url;
            else router.replace(`/checkout/success/${res.orderId}`);
        } else {
            toast.error(res?.error || "Erro no checkout");
        }
    };

    return (
        <div className="container mx-auto px-4 pt-12 pb-20 max-w-7xl">
            <div className="flex items-center gap-2 mb-8 opacity-60 hover:opacity-100 transition-opacity cursor-pointer text-sm font-bold uppercase tracking-widest" onClick={() => router.back()}>
                <ChevronRight className="w-4 h-4 rotate-180" />
                Voltar para o carrinho
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Left: Express Sections */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* 1. Address Section - Express */}
                    <section className="bg-white dark:bg-zinc-950 rounded-3xl border border-border/50 p-8 shadow-xl shadow-black/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-500/10 p-3 rounded-2xl text-indigo-500">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight">Onde entregamos?</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.map(addr => (
                                <button
                                    key={addr.id}
                                    onClick={() => setSelectedAddressId(addr.id)}
                                    className={`text-left p-5 rounded-2xl border-2 transition-all relative ${
                                        selectedAddressId === addr.id 
                                        ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-500/5 ring-4 ring-indigo-500/10' 
                                        : 'border-border hover:border-indigo-300 dark:hover:border-zinc-800'
                                    }`}
                                >
                                    <p className="font-black text-sm uppercase tracking-tight mb-1">{addr.label || 'Endereço'}</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{addr.street}, {addr.number}</p>
                                    <p className="text-xs text-muted-foreground">{addr.city} - {addr.state}</p>
                                    {selectedAddressId === addr.id && <CheckCircle2 className="w-5 h-5 absolute top-5 right-5 text-indigo-600" />}
                                </button>
                            ))}
                            <button 
                                onClick={() => setIsCreatingAddress(true)}
                                className="p-5 rounded-2xl border-2 border-dashed border-border hover:border-indigo-500 hover:bg-indigo-50/10 transition-all flex flex-col items-center justify-center gap-2 group"
                            >
                                <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-indigo-500">Novo Endereço</span>
                            </button>
                        </div>
                    </section>

                    {/* 2. Payment Section - Express */}
                    <section className="bg-white dark:bg-zinc-950 rounded-3xl border border-border/50 p-8 shadow-xl shadow-black/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-all" />
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-500">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">Pagamento & Fiscal</h2>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {['credit_card', 'pix', 'boleto'].map(method => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method)}
                                    className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                                        paymentMethod === method 
                                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-500/5 ring-4 ring-emerald-500/10' 
                                        : 'border-border hover:border-emerald-300 dark:hover:border-zinc-800 opacity-60'
                                    }`}
                                >
                                    <div className={`p-2 rounded-xl ${paymentMethod === method ? 'bg-emerald-500 text-white' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500'}`}>
                                        {method === 'credit_card' ? <CreditCard className="w-5 h-5" /> : method === 'pix' ? <Zap className="w-5 h-5" /> : <Barcode className="w-5 h-5" />}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {method === 'credit_card' ? 'Cartão' : method === 'pix' ? 'Pix (5%)' : 'Boleto'}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Documento (CPF/CNPJ)</label>
                                <input
                                    type="text"
                                    value={document}
                                    onChange={(e) => setDocument(e.target.value.replace(/\D/g, '').slice(0, 14))}
                                    placeholder="000.000.000-00"
                                    className="w-full p-4 rounded-2xl border border-border/80 bg-zinc-50 dark:bg-zinc-900 focus:ring-4 focus:ring-emerald-500/10 ring-offset-0 outline-none transition-all font-mono"
                                />
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase font-bold tracking-tight">
                                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                    Conexão Segura para emissão de nota fiscal
                                </p>
                            </div>

                            {paymentMethod === 'credit_card' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Número do Cartão</label>
                                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-4 rounded-2xl border border-border/80 bg-zinc-50 dark:bg-zinc-900 font-mono outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Expiração</label>
                                        <input type="text" placeholder="MM/AA" className="w-full p-4 rounded-2xl border border-border/80 bg-zinc-50 dark:bg-zinc-900 font-mono outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">CVC</label>
                                        <input type="text" placeholder="123" className="w-full p-4 rounded-2xl border border-border/80 bg-zinc-50 dark:bg-zinc-900 font-mono outline-none" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right: Floating Summary - Express */}
                <div className="lg:col-span-4 lg:sticky lg:top-24">
                    <section className="bg-zinc-950 text-white rounded-[40px] p-10 shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Sparkles className="w-32 h-32 text-indigo-500" />
                        </div>

                        <h3 className="text-xl font-black tracking-tightest mb-8 flex items-center gap-2">
                            Resumo Express
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-4 max-h-[200px] overflow-y-auto custom-scrollbar pr-2 mb-6">
                                {items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 items-center border-b border-white/10 pb-4">
                                        <div className="relative w-14 h-14 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0">
                                            {item.product.imageUrl && <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover scale-110" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate opacity-80">{item.product.name}</p>
                                            <p className="text-[10px] font-black tracking-widest uppercase text-indigo-400">Qtd {item.quantity}</p>
                                        </div>
                                        <p className="text-xs font-black">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price / 100)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-white/10">
                                <div className="flex justify-between items-center text-xs opacity-60 font-bold uppercase tracking-widest">
                                    <span>Produtos</span>
                                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal / 100)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs opacity-60 font-bold uppercase tracking-widest">
                                    <span>Entrega</span>
                                    <span className="text-emerald-400 font-black">GRÁTIS</span>
                                </div>
                                <div className="flex justify-between items-center text-xs opacity-60 font-bold uppercase tracking-widest">
                                    <span>Taxas / Impostos</span>
                                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(taxes / 100)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-xs text-indigo-400 font-black uppercase tracking-widest">
                                        <span>Desconto</span>
                                        <span>- {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(discountAmount / 100)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6">
                                <div className="flex flex-col gap-1 mb-8">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Final</span>
                                    <span className="text-4xl font-black tracking-tightest text-white leading-none">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderTotal / 100)}
                                    </span>
                                </div>

                                <Button
                                    size="lg"
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                    className="w-full py-8 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-md shadow-xl shadow-indigo-600/20 group relative overflow-hidden"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                            PROCESSANDO...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                                            FINALIZAR AGORA
                                            <Zap className="w-5 h-5 fill-current" />
                                        </div>
                                    )}
                                </Button>

                                <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                                    <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" alt="Visa" className="h-3" />
                                    <img src="https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo-7.png" alt="Master" className="h-4" />
                                    <img src="https://logodownload.org/wp-content/uploads/2020/02/pix-logo-1.png" alt="Pix" className="h-4" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

// Sub-components as icons or helper components
import { Plus, Zap, Barcode, Sparkles } from "lucide-react";

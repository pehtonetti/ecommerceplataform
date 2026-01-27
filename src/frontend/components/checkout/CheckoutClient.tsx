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
    const [document, setDocument] = useState(user?.document || ""); // CPF/CNPJ State
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState(1); // 1: Endereço, 2: Pagamento, 3: Revisão

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
    const shippingCost = 2500; // Fixed mock shipping

    // Calculate Discount
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

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
    };

    const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const res = await createAddress(formData);
        if (res?.success) {
            toast.success("Endereço adicionado!");
            setIsCreatingAddress(false);
            router.refresh();
        } else {
            toast.error("Erro ao adicionar endereço");
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            toast.error("Selecione um endereço de entrega");
            return;
        }

        if (!document || document.length < 11) {
            toast.error("Informe um CPF/CNPJ válido para a Nota Fiscal");
            return;
        }

        if (paymentMethod === 'credit_card') {
            if (cardData.number.length < 13 || !cardData.cvc) {
                toast.error("Preencha os dados do cartão");
                return;
            }
        }

        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const res = await checkoutOrder({
            addressId: selectedAddressId,
            paymentMethod,
            subtotal,
            shippingCost,
            total: finalTotal,
            couponId: appliedCoupon?.id,
            discountAmount: discountAmount + pixDiscount,
            document // Pass document to server action
        });

        setIsProcessing(false);

        if (res?.success) {
            toast.success("Pedido realizado com sucesso!");

            // Redirect to Payment URL (Stripe) or Success Page
            if (res.url) {
                window.location.href = res.url;
            } else {
                router.replace(`/checkout/success/${res.orderId}`);
            }
        } else {
            toast.error(res?.error || "Erro ao finalizar pedido");
        }
    };

    return (
        <div className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
            {/* Steps Indicator */}
            <div className="max-w-2xl mx-auto mb-12">
                <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-zinc-800 -translate-y-1/2 z-0"></div>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((step - 1) / 2) * 100}%` }}
                        className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
                    ></motion.div>

                    {[
                        { s: 1, icon: MapPin, label: "Endereço" },
                        { s: 2, icon: CreditCard, label: "Pagamento" },
                        { s: 3, icon: CheckCircle2, label: "Revisão" }
                    ].map((item) => (
                        <div key={item.s} className="relative z-10 flex flex-col items-center gap-2">
                            <button
                                onClick={() => step > item.s && setStep(item.s)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step >= item.s ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                            </button>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= item.s ? 'text-primary' : 'text-gray-400'}`}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Flow */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 1. Address Section */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-primary/10 p-2 rounded-full text-primary">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold">Endereço de Entrega</h2>
                        </div>

                        {isCreatingAddress ? (
                            <form onSubmit={handleAddressSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        name="zipCode"
                                        placeholder="CEP"
                                        className="border p-2 rounded w-full bg-white dark:bg-zinc-800"
                                        required
                                        maxLength={9}
                                    />
                                    <input name="number" placeholder="Número" className="border p-2 rounded bg-white dark:bg-zinc-800" required />
                                </div>
                                <input name="street" placeholder="Rua / Logradouro" className="w-full border p-2 rounded bg-white dark:bg-zinc-800" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input name="neighborhood" placeholder="Bairro" className="border p-2 rounded bg-white dark:bg-zinc-800" required />
                                    <input name="city" placeholder="Cidade" className="border p-2 rounded bg-white dark:bg-zinc-800" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input name="state" placeholder="Estado (UF)" className="border p-2 rounded bg-white dark:bg-zinc-800" required />
                                    <input name="label" placeholder="Apelido (ex: Casa)" className="border p-2 rounded bg-white dark:bg-zinc-800" />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button type="button" variant="ghost" onClick={() => setIsCreatingAddress(false)}>Cancelar</Button>
                                    <Button type="submit">Salvar Endereço</Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-3">
                                {addresses.map(addr => (
                                    <label key={addr.id} className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="address"
                                            value={addr.id}
                                            checked={selectedAddressId === addr.id}
                                            onChange={() => setSelectedAddressId(addr.id)}
                                            className="mt-1"
                                        />
                                        <div>
                                            <p className="font-semibold text-black dark:text-white">{addr.label} - {addr.street}, {addr.number}</p>
                                            <p className="text-sm text-muted-foreground">{addr.neighborhood}, {addr.city} - {addr.state} ({addr.zipCode})</p>
                                        </div>
                                    </label>
                                ))}
                                <Button variant="outline" className="w-full mt-2" onClick={() => setIsCreatingAddress(true)}>
                                    + Adicionar Novo Endereço
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* 2. Payment Section */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-primary/10 p-2 rounded-full text-primary">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold">Pagamento</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {['credit_card', 'pix', 'boleto'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium border whitespace-nowrap transition-colors ${paymentMethod === method ? 'bg-primary text-white border-primary' : 'bg-transparent hover:bg-gray-50 dark:hover:bg-zinc-800 text-black dark:text-white border-border'}`}
                                    >
                                        {method === 'credit_card' && 'Cartão de Crédito'}
                                        {method === 'pix' && 'PIX (5% desc)'}
                                        {method === 'boleto' && 'Boleto Bancário'}
                                    </button>
                                ))}
                            </div>

                            {/* Billing Info: CPF/CNPJ */}
                            <div className="p-4 border border-border rounded-xl bg-gray-50 dark:bg-zinc-950/30 space-y-4">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Dados Fiscais (NFe)</h3>
                                <div className="space-y-1">
                                    <input
                                        type="text"
                                        placeholder="CPF/CNPJ do Titular"
                                        className="w-full border p-2 rounded bg-white dark:bg-zinc-800 text-black dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={document}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val.length <= 14) setDocument(val);
                                        }}
                                        maxLength={14}
                                    />
                                    <p className="text-[10px] text-muted-foreground">Necessário para emissão da Nota Fiscal Eletrônica.</p>
                                </div>
                            </div>

                            {paymentMethod === 'credit_card' && (
                                <div className="p-4 border border-border rounded-xl bg-gray-50 dark:bg-zinc-950/30 space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Número do Cartão"
                                        className="w-full border p-2 rounded bg-white dark:bg-zinc-800 text-black dark:text-white"
                                        value={cardData.number}
                                        onChange={e => setCardData({ ...cardData, number: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Nome no Cartão"
                                            className="border p-2 rounded bg-white dark:bg-zinc-800 text-black dark:text-white"
                                            value={cardData.name}
                                            onChange={e => setCardData({ ...cardData, name: e.target.value })}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                placeholder="MM/AA"
                                                className="border p-2 rounded bg-white dark:bg-zinc-800 text-black dark:text-white"
                                                value={cardData.expiry}
                                                onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="CVC"
                                                className="border p-2 rounded bg-white dark:bg-zinc-800 text-black dark:text-white"
                                                value={cardData.cvc}
                                                onChange={e => setCardData({ ...cardData, cvc: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'pix' && (
                                <div className="p-8 border border-border rounded-xl bg-green-50 dark:bg-green-950/10 text-center">
                                    <p className="font-medium text-green-700 dark:text-green-400">O QR Code Pix será gerado após o checkout.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. Review Items */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-primary/10 p-2 rounded-full text-primary">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold">Revisão dos Itens</h2>
                        </div>

                        <div className="space-y-4">
                            {cart.items.map((item: any) => (
                                <div key={item.id} className="flex gap-4 py-2 border-b border-border last:border-0 pb-4">
                                    <div className="relative w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
                                        {item.product.imageUrl && <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium line-clamp-1 text-black dark:text-white">{item.product.name}</h4>
                                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                                            <span>Qtd: {item.quantity}</span>
                                            <span className="font-semibold text-black dark:text-white">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price / 100)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border p-6 shadow-lg sticky top-24 space-y-6">
                        <h3 className="text-lg font-bold text-black dark:text-white">Resumo do Pedido</h3>

                        {/* Coupon Input */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                                <Tag className="w-4 h-4" />
                                <span>Possui cupom?</span>
                            </div>
                            {appliedCoupon ? (
                                <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Ticket className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-bold text-primary uppercase">{appliedCoupon.code}</span>
                                    </div>
                                    <button onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:underline">Remover</button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="CÓDIGO"
                                        className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-border rounded-lg px-3 py-2 text-sm focus:outline-primary uppercase"
                                        value={couponCode}
                                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                    />
                                    <Button size="sm" onClick={handleApplyCoupon} disabled={isValidatingCoupon}>
                                        Aplicar
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 py-4 border-t border-b border-border">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="text-black dark:text-white">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal / 100)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Frete</span>
                                <span className="text-black dark:text-white">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shippingCost / 100)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Impostos estimados</span>
                                <span className="text-black dark:text-white">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((subtotal * 0.18) / 100)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-sm text-primary font-medium">
                                    <span>Desconto ({appliedCoupon.code})</span>
                                    <span>- {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(discountAmount / 100)}</span>
                                </div>
                            )}
                            {pixDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-600 font-medium">
                                    <span>Desconto PIX (5%)</span>
                                    <span>- {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pixDiscount / 100)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between text-xl font-bold py-2">
                            <span className="text-black dark:text-white">Total</span>
                            <span className="text-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((finalTotal + (subtotal * 0.18)) / 100)}
                            </span>
                        </div>

                        <Button
                            size="lg"
                            className="w-full text-lg font-bold"
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Processando..." : (
                                <div className="flex items-center gap-2">
                                    <span>Finalizar Compra</span>
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

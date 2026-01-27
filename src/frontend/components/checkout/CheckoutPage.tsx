"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserAddresses, calculateCartShipping } from "@/backend/actions/shipping-actions";
import { createOrder } from "@/backend/actions/order-actions";
import { getCart } from "@/backend/actions/cart-actions";
import { AddressForm } from "./AddressForm";
import { Button } from "../ui/Button";
import { FadeIn } from "../ui/Motion";
import { toast } from "sonner";
import { Loader2, MapPin, Truck, CreditCard, ChevronRight } from "lucide-react";
import { CouponInput } from "./CouponInput";

interface CheckoutPageProps {
    userId: string;
}

export function CheckoutPage({ userId }: CheckoutPageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [cart, setCart] = useState<any>(null);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [shippingQuotes, setShippingQuotes] = useState<any[]>([]);

    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [selectedShipping, setSelectedShipping] = useState<string>('');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [couponId, setCouponId] = useState<string | null>(null);
    const [discount, setDiscount] = useState(0);

    // Carregar dados iniciais
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);

        // Carregar carrinho
        const cartResult = await getCart(userId);
        if (cartResult.cart) {
            setCart(cartResult.cart);
        }

        // Carregar endereços
        const addressResult = await getUserAddresses(userId);
        if (addressResult.addresses) {
            setAddresses(addressResult.addresses);
            // Selecionar endereço padrão
            const defaultAddr = addressResult.addresses.find((a: any) => a.isDefault);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
                await loadShipping(defaultAddr.zipCode);
            }
        }

        setLoading(false);
    };

    const loadShipping = async (zipCode: string) => {
        const result = await calculateCartShipping(userId, zipCode);
        if (result.quotes) {
            setShippingQuotes(result.quotes);
            // Selecionar primeira opção por padrão
            if (result.quotes.length > 0) {
                setSelectedShipping(result.quotes[0].service);
            }
        }
    };

    const handleAddressChange = async (addressId: string) => {
        setSelectedAddressId(addressId);
        const address = addresses.find(a => a.id === addressId);
        if (address) {
            await loadShipping(address.zipCode);
        }
    };

    const handleCheckout = async () => {
        if (!selectedAddressId) {
            toast.error('Selecione um endereço de entrega');
            return;
        }

        if (!selectedShipping) {
            toast.error('Selecione um método de envio');
            return;
        }

        setProcessing(true);

        const result = await createOrder({
            userId,
            addressId: selectedAddressId,
            shippingMethod: selectedShipping,
            couponId: couponId || undefined // Pass couponId
        });

        setProcessing(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success('Pedido criado com sucesso!');
        router.push(`/order-success?orderId=${result.orderId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">Seu carrinho está vazio</p>
                <Button onClick={() => router.push('/')}>Continuar Comprando</Button>
            </div>
        );
    }

    const subtotal = cart.items.reduce((sum: number, item: any) =>
        sum + (item.product.price * item.quantity), 0
    );

    const selectedQuote = shippingQuotes.find(q => q.service === selectedShipping);
    const shippingCost = selectedQuote?.price || 0;
    const total = subtotal + shippingCost;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-6">
                {/* 1. Endereço */}
                <FadeIn className="glass rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-primary" />
                            </div>
                            <h2 className="text-lg font-semibold">Endereço de Entrega</h2>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAddressForm(!showAddressForm)}
                        >
                            {showAddressForm ? 'Cancelar' : '+ Novo Endereço'}
                        </Button>
                    </div>

                    {showAddressForm ? (
                        <AddressForm
                            userId={userId}
                            onAddressSaved={() => {
                                setShowAddressForm(false);
                                loadData();
                            }}
                        />
                    ) : (
                        <div className="space-y-3">
                            {addresses.map((address) => (
                                <label
                                    key={address.id}
                                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${selectedAddressId === address.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="address"
                                        value={address.id}
                                        checked={selectedAddressId === address.id}
                                        onChange={() => handleAddressChange(address.id)}
                                        className="sr-only"
                                    />
                                    <div className="flex items-start justify-between">
                                        <div>
                                            {address.label && (
                                                <span className="text-xs font-medium text-primary">{address.label}</span>
                                            )}
                                            <p className="font-medium">{address.street}, {address.number}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {address.neighborhood} - {address.city}/{address.state}
                                            </p>
                                            <p className="text-sm text-muted-foreground">CEP: {address.zipCode}</p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </FadeIn>

                {/* 2. Frete */}
                {shippingQuotes.length > 0 && (
                    <FadeIn delay={0.1} className="glass rounded-xl border border-border p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                <Truck className="w-4 h-4 text-blue-500" />
                            </div>
                            <h2 className="text-lg font-semibold">Método de Envio</h2>
                        </div>

                        <div className="space-y-3">
                            {shippingQuotes.map((quote) => (
                                <label
                                    key={quote.service}
                                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${selectedShipping === quote.service
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="shipping"
                                        value={quote.service}
                                        checked={selectedShipping === quote.service}
                                        onChange={() => setSelectedShipping(quote.service)}
                                        className="sr-only"
                                    />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{quote.serviceName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Entrega em até {quote.deliveryDays} dias úteis
                                            </p>
                                        </div>
                                        <p className="font-bold">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                                .format(quote.price / 100)}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </FadeIn>
                )}
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
                <FadeIn delay={0.2} className="glass rounded-xl border border-border p-6 sticky top-24">
                    <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>

                    <div className="space-y-3 mb-6">
                        {cart.items.map((item: any) => (
                            <div key={item.id} className="flex gap-3">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.product.imageUrl && (
                                        <img
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                                    <p className="text-sm font-semibold">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                            .format((item.product.price * item.quantity) / 100)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">Cupom de Desconto</h3>
                        <CouponInput subtotal={subtotal} onCouponApplied={(id, amount) => {
                            setCouponId(id || null);
                            setDiscount(amount);
                        }} />
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal / 100)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Frete</span>
                            <span>{shippingCost > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shippingCost / 100) : '-'}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                <span>Desconto</span>
                                <span>- {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(discount / 100)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                            <span>Total</span>
                            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((total - discount) / 100)}</span>
                        </div>
                    </div>

                    <Button
                        className="w-full mt-6"
                        size="lg"
                        onClick={handleCheckout}
                        disabled={processing || !selectedAddressId || !selectedShipping}
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Finalizar Pedido
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                        Ao finalizar, você será redirecionado para o pagamento
                    </p>
                </FadeIn>
            </div>
        </div>
    );
}

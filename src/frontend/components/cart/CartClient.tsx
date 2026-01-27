"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Smartphone, Monitor, ShoppingBag, Plus, Minus } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import { removeFromCart, updateCartItemQuantity } from "@/backend/actions/cart-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CartClient({ cart, user }: { cart: any, user: any }) {
    const [couponCode, setCouponCode] = useState("");
    const [shippingZip, setShippingZip] = useState("");
    const [shippingCost, setShippingCost] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const items = cart?.items || [];
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);
    const total = subtotal + (shippingCost || 0);

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setIsLoading(true);
        await updateCartItemQuantity(itemId, newQuantity);
        setIsLoading(false);
        router.refresh();
    };

    const handleRemoveItem = async (itemId: string) => {
        setIsLoading(true);
        await removeFromCart(itemId);
        setIsLoading(false);
        toast.success("Item removido com sucesso");
        router.refresh();
    };

    const calculateShipping = async () => {
        if (shippingZip.length < 8) {
            toast.error("CEP inválido");
            return;
        }
        // Mock calculation
        setIsLoading(true);
        setTimeout(() => {
            setShippingCost(2500); // R$ 25,00
            setIsLoading(false);
            toast.success("Frete calculado!");
        }, 1000);
    };

    const applyCoupon = () => {
        if (!couponCode) {
            toast.error("Digite um cupom");
            return;
        }
        // Mock coupon logic
        toast.info("Funcionalidade de cupom em desenvolvimento");
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-border">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Seu carrinho está vazio</h2>
                <p className="text-muted-foreground mb-6">Adicione produtos para começar suas compras.</p>
                <Link href="/">
                    <Button>Voltar para a Loja</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
                {items.map((item: any) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-border shadow-sm">
                        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.product.imageUrl ? (
                                <Image
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    fill
                                    className="object-contain p-2"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Smartphone className="w-8 h-8" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-semibold line-clamp-2">{item.product.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">Categoria: {item.product.category}</p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 rounded-lg p-1">
                                    <button
                                        disabled={isLoading}
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                    <button
                                        disabled={isLoading}
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((item.product.price * item.quantity) / 100)}
                                    </p>
                                    {item.quantity > 1 && (
                                        <p className="text-xs text-muted-foreground">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price / 100)} un.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 h-fit"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border p-6 shadow-sm sticky top-24">
                    <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>

                    {/* Shipping Calculator */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Calcular Frete</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="00000-000"
                                value={shippingZip}
                                onChange={(e) => setShippingZip(e.target.value)}
                                className="flex-1 bg-transparent border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                            <Button variant="outline" size="sm" onClick={calculateShipping} disabled={isLoading}>
                                Calcular
                            </Button>
                        </div>
                    </div>

                    {/* Coupon Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Cupom de Desconto</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Código"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="flex-1 bg-transparent border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                            <Button variant="outline" size="sm" onClick={applyCoupon} disabled={isLoading}>
                                Aplicar
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3 py-4 border-t border-border">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal / 100)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Frete</span>
                            <span>
                                {shippingCost ?
                                    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shippingCost / 100)
                                    : 'A calcular'}
                            </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border mt-2">
                            <span>Total</span>
                            <span className="text-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total / 100)}
                            </span>
                        </div>
                    </div>

                    <Link href="/checkout" className="block mt-6">
                        <Button className="w-full text-lg h-12">
                            Finalizar Compra
                        </Button>
                    </Link>

                    <Link href="/" className="block mt-4 text-center text-sm text-primary hover:underline">
                        Continuar Comprando
                    </Link>
                </div>
            </div>
        </div>
    );
}

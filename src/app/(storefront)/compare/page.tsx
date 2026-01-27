"use client";

import { useCompare } from "@/frontend/contexts/CompareContext";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { X, ShoppingCart, Check, Minus } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import Link from "next/link";
import { addToCart } from "@/backend/actions/cart-actions";
import { toast } from "sonner";

export default function ComparePage() {
    const { compareList, removeFromCompare, clearCompare } = useCompare();

    if (compareList.length === 0) {
        return (
            <div className="container mx-auto px-4 pt-40 pb-20 text-center">
                <h1 className="text-4xl font-black mb-4">Compare Produtos</h1>
                <p className="text-muted-foreground mb-8">Sua lista de comparação está vazia.</p>
                <Link href="/search">
                    <Button>Voltar para a Loja</Button>
                </Link>
            </div>
        );
    }

    const handleAddToCart = async (productId: string) => {
        const res = await addToCart(productId, 1);
        if (res.success) toast.success("Adicionado ao carrinho!");
        else toast.error(res.error || "Erro ao adicionar");
    };

    return (
        <div className="container mx-auto px-4 pt-32 pb-20">
            <FadeIn>
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black">Comparação Técnica</h1>
                        <p className="text-muted-foreground">Compare especificações e preços para fazer a melhor escolha.</p>
                    </div>
                    <Button variant="outline" onClick={clearCompare}>Limpar Tudo</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="p-6 text-left border-b border-border min-w-[200px] bg-gray-50 dark:bg-zinc-950 rounded-tl-3xl">Produto</th>
                                {compareList.map(product => (
                                    <th key={product.id} className="p-6 border-b border-border min-w-[250px] relative group">
                                        <button
                                            onClick={() => removeFromCompare(product.id)}
                                            className="absolute top-2 right-2 p-1 hover:bg-red-50 text-red-500 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="flex flex-col items-center gap-4">
                                            <img src={product.imageUrl} alt={product.name} className="h-32 object-contain" />
                                            <h3 className="font-bold text-center text-sm line-clamp-2">{product.name}</h3>
                                            <p className="text-xl font-black text-primary">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 100)}
                                            </p>
                                            <Button size="sm" className="w-full gap-2" onClick={() => handleAddToCart(product.id)}>
                                                <ShoppingCart className="w-4 h-4" /> Comprar
                                            </Button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <tr>
                                <td className="p-6 font-bold bg-gray-50 dark:bg-zinc-950">Categoria</td>
                                {compareList.map(p => <td key={p.id} className="p-6 text-center text-sm">{p.category}</td>)}
                            </tr>
                            <tr>
                                <td className="p-6 font-bold bg-gray-50 dark:bg-zinc-950">Estoque</td>
                                {compareList.map(p => (
                                    <td key={p.id} className="p-6 text-center text-sm">
                                        {p.stock > 0 ? (
                                            <span className="text-green-600 flex items-center justify-center gap-1 font-bold">
                                                <Check className="w-4 h-4" /> Em Estoque
                                            </span>
                                        ) : (
                                            <span className="text-red-500 flex items-center justify-center gap-1 font-bold">
                                                <Minus className="w-4 h-4" /> Esgotado
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-6 font-bold bg-gray-50 dark:bg-zinc-950">Descrição</td>
                                {compareList.map(p => <td key={p.id} className="p-6 text-sm text-muted-foreground line-clamp-3 overflow-hidden">{p.description}</td>)}
                            </tr>
                            {/* Features mocked for advanced look */}
                            <tr>
                                <td className="p-6 font-bold bg-gray-50 dark:bg-zinc-950">Garantia</td>
                                {compareList.map(p => <td key={p.id} className="p-6 text-center text-sm">12 Meses</td>)}
                            </tr>
                            <tr>
                                <td className="p-6 font-bold bg-gray-50 dark:bg-zinc-950 rounded-bl-3xl">Suporte IA</td>
                                {compareList.map(p => <td key={p.id} className="p-6 text-center text-sm"><Check className="w-4 h-4 mx-auto text-primary" /></td>)}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </FadeIn>
        </div>
    );
}

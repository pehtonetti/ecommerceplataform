import { FadeIn } from "@/frontend/components/ui/Motion";
import { Button } from "@/frontend/components/ui/Button";
import { Warehouse, Download, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { RestockButton } from "./RestockButton";

import { ExportInventoryButton } from "./ExportInventoryButton";

export default async function InventoryPage() {
    // 1. Fetch real inventory stats
    const totalProducts = await prisma.product.count();
    const allProducts = await prisma.product.findMany({
        orderBy: { name: 'asc' }
    });

    const lowStockProducts = allProducts.filter(p => p.stock <= 5);

    // Calculate total value in stock (price * stock)
    const totalValue = allProducts.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestão de Estoque</h1>
                        <p className="text-muted-foreground">Monitore níveis de estoque e valorização.</p>
                    </div>
                    <ExportInventoryButton products={allProducts} />
                </div>
            </FadeIn>

            <FadeIn delay={0.1} className="grid gap-4 md:grid-cols-3">
                <div className="glass p-6 rounded-xl border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground">Valor Total em Estoque</h3>
                    <p className="text-2xl font-bold mt-2">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue / 100)}
                    </p>
                </div>
                <div className="glass p-6 rounded-xl border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground">Itens com Estoque Baixo</h3>
                    <p className={`text-2xl font-bold mt-2 ${lowStockProducts.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {lowStockProducts.length}
                    </p>
                </div>
                <div className="glass p-6 rounded-xl border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground">Total de SKUs</h3>
                    <p className="text-2xl font-bold mt-2">{totalProducts}</p>
                </div>
            </FadeIn>

            <FadeIn delay={0.2} className="space-y-6">
                <h2 className="text-xl font-bold">Alertas de Reposição</h2>

                {lowStockProducts.length > 0 ? (
                    <div className="rounded-md border border-border overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 font-medium">
                                <tr>
                                    <th className="p-4">Produto</th>
                                    <th className="p-4">Preço</th>
                                    <th className="p-4">Estoque Atual</th>
                                    <th className="p-4 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {lowStockProducts.map(product => (
                                    <tr key={product.id} className="bg-white dark:bg-zinc-900/50 hover:bg-muted/10">
                                        <td className="p-4 font-medium flex items-center gap-3">
                                            {product.imageUrl && (
                                                <img src={product.imageUrl} alt="" className="w-8 h-8 rounded object-cover bg-gray-100" />
                                            )}
                                            {product.name}
                                        </td>
                                        <td className="p-4">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 100)}
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-700 data-dark:bg-red-900 data-dark:text-red-300 text-xs font-bold">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                {product.stock} un.
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <RestockButton product={product} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="glass p-8 rounded-xl border border-border text-center py-20">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full">
                                <Warehouse className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-medium">Estoque Saudável</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                Nenhum produto com estoque crítico no momento.
                            </p>
                        </div>
                    </div>
                )}
            </FadeIn>
        </div>
    );
}

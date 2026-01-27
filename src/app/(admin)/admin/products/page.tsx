import { db } from "@/backend/infrastructure/db";
import { Button } from "@/frontend/components/ui/Button";
import { Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DeleteProductButton } from "./DeleteButton";

export default async function ProductsPage() {
    const products = await db.getProducts();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
                    <p className="text-muted-foreground">Gerencie o catálogo da sua loja.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Produto
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border border-border">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Imagem</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Nome</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Preço</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Estoque</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {(products || []).map(product => (
                                <tr key={product.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle">
                                        {product.imageUrl && (
                                            <div className="relative h-10 w-10">
                                                <Image src={product.imageUrl} alt={product.name} fill className="rounded-md object-cover" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 align-middle font-medium">{product.name}</td>
                                    <td className="p-4 align-middle">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: product.currency }).format(product.price / 100)}
                                    </td>
                                    <td className="p-4 align-middle">{product.stock}</td>
                                    <td className="p-4 align-middle text-right flex justify-end gap-2">
                                        <Link href={`/admin/products/${product.id}`}>
                                            <Button variant="ghost" size="sm">Editar</Button>
                                        </Link>
                                        <DeleteProductButton id={product.id} />
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                        Nenhum produto encontrado. Adicione um novo!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

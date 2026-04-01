import { getMerchantProducts } from "@/backend/actions/product-actions";
import { Button } from "@/frontend/components/ui/Button";
import { Plus, Search, Filter, MoreHorizontal, Package, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DeleteProductButton } from "@/app/(admin)/admin/products/DeleteButton"; // Reusable for now

export default async function MerchantProductsPage() {
    const products = await getMerchantProducts();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Seus Produtos</h1>
                    <p className="text-muted-foreground text-sm mt-1">Gerencie seu catálogo de produtos e estoque em tempo real.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/products/new">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Produto
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats or Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border bg-card shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Package className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total de Produtos</p>
                        <p className="text-2xl font-bold">{products.length}</p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 py-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                        placeholder="Buscar produtos..." 
                        className="w-full bg-transparent border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                </Button>
            </div>

            <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="h-12 px-6 align-middle font-semibold text-muted-foreground">Produto</th>
                                <th className="h-12 px-6 align-middle font-semibold text-muted-foreground">Categoria</th>
                                <th className="h-12 px-6 align-middle font-semibold text-muted-foreground">Preço</th>
                                <th className="h-12 px-6 align-middle font-semibold text-muted-foreground">Estoque</th>
                                <th className="h-12 px-6 align-middle font-semibold text-muted-foreground">Status</th>
                                <th className="h-12 px-6 align-middle font-semibold text-muted-foreground text-right border-l">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-12 w-12 rounded-lg overflow-hidden border bg-white flex-shrink-0">
                                                {product.imageUrl ? (
                                                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-muted-foreground/50" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground group-hover:text-indigo-600 transition-colors">{product.name}</span>
                                                <span className="text-xs text-muted-foreground font-mono">{product.id.slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                                            {product.category || 'Sem Categoria'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 align-middle font-medium">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: product.currency }).format(product.price / 100)}
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            <span className="font-medium">{product.stock}</span>
                                            <span className="text-xs text-muted-foreground">und</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${product.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {product.active ? 'Ativo' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 align-middle text-right border-l">
                                        <div className="flex justify-end items-center gap-2">
                                            <Link href={`/dashboard/products/${product.id}`}>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-indigo-50 hover:text-indigo-600">
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <DeleteProductButton id={product.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                                <Package className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <h3 className="font-semibold text-lg">Sem produtos ainda</h3>
                                            <p className="text-sm text-muted-foreground max-w-xs">
                                                Comece a vender agora mesmo adicionando seu primeiro produto ao catálogo.
                                            </p>
                                            <Link href="/dashboard/products/new" className="mt-4">
                                                <Button size="sm">Adicionar Primeiro Produto</Button>
                                            </Link>
                                        </div>
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

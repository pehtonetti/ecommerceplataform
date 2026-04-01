import { getCategories } from "@/backend/actions/category-actions";
import { Button } from "@/frontend/components/ui/Button";
import { Plus, FolderPlus, MoreVertical, Pencil, Trash2, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function MerchantCategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
                    <p className="text-muted-foreground text-sm mt-1">Organize seus produtos em categorias para facilitar a navegação dos clientes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/categories/new">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 px-6">
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Categoria
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div 
                        key={category.id} 
                        className="group relative flex flex-col bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        {/* Action Buttons (Hover) */}
                        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <Link href={`/dashboard/categories/${category.id}`}>
                                <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 backdrop-blur shadow-sm rounded-lg hover:bg-indigo-600 hover:text-white transition-colors">
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </div>

                        <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                            {category.imageUrl ? (
                                <Image 
                                    src={category.imageUrl} 
                                    alt={category.name} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                                    <LayoutGrid className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg text-foreground group-hover:text-indigo-600 transition-colors">
                                {category.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-4 flex-1">
                                {category.description || 'Sem descrição definida para esta categoria.'}
                            </p>
                            
                            <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                    {category.slug}
                                </span>
                                <Link href={`/dashboard/products?category=${category.slug}`}>
                                    <span className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                                        Ver Produtos
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-border/60 rounded-3xl bg-muted/20">
                        <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
                            <FolderPlus className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">Sua vitrine está vazia</h3>
                        <p className="text-muted-foreground max-w-sm mt-2 mb-8">
                            Categorias ajudam seus clientes a encontrar o que procuram. Comece criando sua primeira categoria.
                        </p>
                        <Link href="/dashboard/categories/new">
                            <Button className="bg-indigo-600 text-white rounded-full px-8 py-6 h-auto font-bold text-lg hover:shadow-xl transition-all shadow-indigo-600/30">
                                Criar Minha Primeira Categoria
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

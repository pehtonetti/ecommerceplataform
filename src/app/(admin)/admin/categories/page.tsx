import { FadeIn } from "@/frontend/components/ui/Motion";
import { ListTree } from "lucide-react";
import { getCategories } from "@/backend/actions/category-actions";
import { CreateCategoryButton } from "./CreateCategoryButton";
import { CategoryActionsClient } from "./CategoryActionsClient";

export default async function CategoriesPage() {
    const result = await getCategories();
    const categories = result.success && result.categories ? result.categories : [];

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
                        <p className="text-muted-foreground">Gerencie as categorias e subcategorias da loja.</p>
                    </div>
                    <CreateCategoryButton />
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                {categories.length === 0 ? (
                    <div className="glass p-8 rounded-xl border border-border text-center py-20">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-muted rounded-full">
                                <ListTree className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">Nenhuma categoria encontrada</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                Comece criando categorias para organizar seus produtos.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {categories.map((cat: any) => (
                            <div key={cat.id} className="glass p-6 rounded-xl border border-border hover:border-primary transition-colors">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">{cat.name}</h3>
                                        {cat.description && <p className="text-sm text-muted-foreground">{cat.description}</p>}
                                        <p className="text-xs text-muted-foreground mt-4 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded inline-block">
                                            /{cat.slug}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-4">
                                        <ListTree className="w-5 h-5 text-muted-foreground" />
                                        <CategoryActionsClient category={cat} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </FadeIn>
        </div>
    );
}

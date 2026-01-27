import { searchProducts, SearchFilters } from "@/backend/actions/search-actions";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { ProductCard } from "@/frontend/components/ui/ProductCard";
import { SearchFiltersPanel } from "@/frontend/components/SearchFiltersPanel";
import { Search } from "lucide-react";

interface PageProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
        minPrice?: string;
        maxPrice?: string;
        inStock?: string;
        sortBy?: string;
    }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const filters: SearchFilters = {
        query: params.q,
        category: params.category,
        minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
        inStock: params.inStock === 'true',
        sortBy: params.sortBy as any || 'newest'
    };

    const result = await searchProducts(filters);
    const products = result.products || [];
    const categories = result.categories || [];

    return (
        <div className="font-sans flex flex-col">
            <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
                <FadeIn>
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-2">
                                {params.q ? `Resultados para "${params.q}"` : 'Buscar Produtos'}
                            </h1>
                            <p className="text-muted-foreground">
                                {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Filters Sidebar */}
                            <div className="lg:col-span-1">
                                <SearchFiltersPanel
                                    categories={categories}
                                    currentFilters={filters}
                                />
                            </div>

                            {/* Products Grid */}
                            <div className="lg:col-span-3">
                                {products.length === 0 ? (
                                    <div className="text-center py-20 glass rounded-xl border border-border">
                                        <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-4">
                                            Nenhum produto encontrado
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Tente ajustar os filtros ou fazer uma nova busca
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {products.map((product: any) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </main>
        </div>
    );
}

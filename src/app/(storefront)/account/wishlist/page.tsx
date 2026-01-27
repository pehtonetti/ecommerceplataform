import { getWishlist } from "@/backend/actions/wishlist-actions";
import { Header } from "@/frontend/components/Header";
import { Footer } from "@/frontend/components/Footer";
import { ProductCard } from "@/frontend/components/ui/ProductCard";
import { FadeIn } from "@/frontend/components/ui/Motion";
import Link from "next/link";
import { Heart } from "lucide-react";

export default async function WishlistPage() {
    const { items, error } = await getWishlist();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
                <FadeIn>
                    <div className="flex items-center gap-3 mb-8">
                        <Heart className="w-8 h-8 text-red-500 fill-current" />
                        <h1 className="text-3xl font-bold">Meus Favoritos</h1>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {(!items || items.length === 0) ? (
                        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
                            <Heart className="w-16 h-16 text-gray-300 dark:text-zinc-700 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold mb-2">Sua lista está vazia</h2>
                            <p className="text-muted-foreground mb-6">
                                Você ainda não salvou nenhum produto.
                            </p>
                            <Link href="/">
                                <span className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity">
                                    Começar a Explorar
                                </span>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {items.map((item: any) => (
                                <ProductCard
                                    key={item.id}
                                    product={item.product}
                                // Make sure ProductCard handles logic to showing "liked" state if we pass it, 
                                // or checking it internally.
                                // Ideally, ProductCard should receive `initialIsLiked` if we can.
                                // For now, in Wishlist page, they are ALL liked.
                                />
                            ))}
                        </div>
                    )}
                </FadeIn>
            </main>

            <Footer />
        </div>
    );
}

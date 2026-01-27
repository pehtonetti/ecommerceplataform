import { Skeleton } from "@/frontend/components/ui/Skeleton";
import { Header } from "@/frontend/components/Header";
import { Footer } from "@/frontend/components/Footer";

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans flex flex-col">
            <Header /> {/* Header usually has its own client logic, might be static here or skeleton */}

            <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
                {/* Hero Skeleton */}
                <div className="w-full h-[400px] mb-8">
                    <Skeleton className="w-full h-full rounded-2xl" />
                </div>

                {/* Categories Scroll */}
                <div className="flex gap-4 mb-12 overflow-hidden">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} className="w-24 h-24 rounded-full flex-shrink-0" />
                    ))}
                </div>

                {/* Product Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-[300px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}

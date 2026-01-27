"use client";

import { Star, User, ThumbsUp } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { useState } from "react";

// Mock reviews data (could be fetched from API later)
const MOCK_REVIEWS = [
    { id: 1, user: "Mariana Costa", rating: 5, date: "15/12/2024", title: "Excelente produto!", comment: "Chegou super rápido e a qualidade é surpreendente. Recomendo muito!", verified: true },
    { id: 2, user: "Carlos Ribeiro", rating: 4, date: "10/12/2024", title: "Muito bom", comment: "O produto é ótimo, mas a entrega atrasou um dia. Tirando isso, tudo certo.", verified: true },
    { id: 3, user: "Ana Souza", rating: 5, date: "05/12/2024", title: "Perfeito", comment: "Exatamente como na foto. Comprarei novamente.", verified: false },
];

export function ProductReviews({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState(MOCK_REVIEWS);

    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

    return (
        <section className="py-12 border-t border-border mt-12 bg-gray-50 dark:bg-zinc-900/30 -mx-4 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <h2 className="text-2xl font-bold">Avaliações dos Clientes</h2>

                    <div className="flex items-center gap-4">
                        <span className="text-5xl font-bold text-gray-900 dark:text-white">{averageRating.toFixed(1)}</span>
                        <div className="space-y-1">
                            <div className="flex text-yellow-500">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={`w-5 h-5 ${s <= Math.round(averageRating) ? "fill-current" : "text-gray-300 dark:text-gray-700"}`} />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground">{reviews.length} avaliações</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = reviews.filter(r => r.rating === rating).length;
                            const percentage = (count / reviews.length) * 100;
                            return (
                                <div key={rating} className="flex items-center gap-3 text-sm">
                                    <span className="w-3">{rating}</span>
                                    <Star className="w-4 h-4 text-gray-400" />
                                    <div className="flex-1 h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <span className="w-8 text-right text-muted-foreground">{percentage.toFixed(0)}%</span>
                                </div>
                            )
                        })}
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 text-sm">
                        <p className="font-medium text-blue-900 dark:text-blue-300 mb-1">Quer avaliar este produto?</p>
                        <p className="text-blue-700 dark:text-blue-400 mb-3">Você poderá avaliar após receber o pedido em sua casa.</p>
                        <Button variant="outline" size="sm" className="w-full bg-white dark:bg-zinc-950">Ver meus pedidos</Button>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-8 space-y-6">
                    {reviews.map((review: any) => (
                        <FadeIn key={review.id} className="border-b border-border pb-6 last:border-0">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{review.user}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{review.date}</span>
                                            {review.verified && <span className="text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Compra Verificada</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex text-yellow-500">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-current" : "text-gray-300 dark:text-gray-700"}`} />
                                    ))}
                                </div>
                            </div>
                            <h3 className="font-semibold mb-1">{review.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                                {review.comment}
                            </p>

                            {/* Video Review Display */}
                            {review.videoUrl && (
                                <div className="mb-4 rounded-xl overflow-hidden border border-border w-full max-w-sm aspect-video bg-black">
                                    <video
                                        src={review.videoUrl}
                                        controls
                                        className="w-full h-full object-cover"
                                        poster="/images/video-placeholder.png"
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground h-auto p-0 hover:bg-transparent">
                                    <ThumbsUp className="w-3 h-3 mr-1.5" /> Útil ({Math.floor(Math.random() * 10)})
                                </Button>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}

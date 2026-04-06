import { getMerchantReviews } from "@/backend/actions/review-merchant-actions";
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import Image from "next/image";
import { ReviewActions } from "./ReviewActions";

export default async function ReviewsDashboardPage() {
    const result = await getMerchantReviews();
    const reviews = result.success && 'reviews' in result ? result.reviews : [];

    const approved = reviews.filter(r => r.approved).length;
    const pending = reviews.filter(r => !r.approved).length;
    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '—';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Avaliações</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Modere as avaliações dos seus clientes e mantenha a credibilidade da loja.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border bg-card shadow-sm">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{reviews.length}</p>
                </div>
                <div className="p-4 rounded-xl border bg-card shadow-sm">
                    <p className="text-xs text-muted-foreground">Nota Média</p>
                    <p className="text-2xl font-bold text-amber-500 flex items-center gap-1"><Star className="w-5 h-5 fill-amber-400 text-amber-400" />{avgRating}</p>
                </div>
                <div className="p-4 rounded-xl border bg-card shadow-sm">
                    <p className="text-xs text-emerald-600">Aprovadas</p>
                    <p className="text-2xl font-bold text-emerald-600">{approved}</p>
                </div>
                <div className="p-4 rounded-xl border bg-card shadow-sm">
                    <p className="text-xs text-amber-600">Pendentes</p>
                    <p className="text-2xl font-bold text-amber-600">{pending}</p>
                </div>
            </div>

            {/* Reviews List */}
            <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                {reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Nenhuma avaliação recebida</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            As avaliações dos clientes aparecerão aqui. Incentive seus compradores a avaliar os produtos!
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {reviews.map((review) => (
                            <div key={review.id} className={`p-5 flex gap-4 hover:bg-muted/20 transition-colors ${!review.approved ? 'bg-amber-50/50' : ''}`}>
                                {/* Avatar */}
                                <div className="shrink-0">
                                    {review.user.avatarUrl ? (
                                        <Image src={review.user.avatarUrl} alt={review.user.name} width={40} height={40} className="rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                            {review.user.name[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-semibold text-sm">{review.user.name}</span>
                                                {!review.approved && (
                                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">Aguardando aprovação</span>
                                                )}
                                                {review.verified && (
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">Compra verificada</span>
                                                )}
                                            </div>
                                            {/* Stars */}
                                            <div className="flex gap-0.5 mb-2">
                                                {Array(5).fill(0).map((_, i) => (
                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                                                ))}
                                                <span className="text-xs text-muted-foreground ml-1">{review.rating}/5</span>
                                            </div>
                                        </div>
                                        <ReviewActions reviewId={review.id} approved={review.approved} />
                                    </div>

                                    {review.title && <p className="font-semibold text-sm mb-1">{review.title}</p>}
                                    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>

                                    {/* Product info */}
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                                        <div className="relative w-8 h-8 rounded-md overflow-hidden bg-muted shrink-0">
                                            {review.product.imageUrl && (
                                                <Image src={review.product.imageUrl} alt={review.product.name} fill className="object-cover" />
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{review.product.name}</span>
                                        <span className="text-xs text-muted-foreground ml-auto">
                                            {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

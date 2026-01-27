'use client';

import { StarRating } from './StarRating';
import { ShieldCheck, Trash2 } from 'lucide-react';
import { deleteReview } from '@/backend/actions/review-actions';
import { toast } from 'sonner';
import { useState } from 'react';

interface Review {
    id: string;
    rating: number;
    title?: string | null;
    comment: string;
    verified: boolean;
    createdAt: Date;
    user: {
        name: string;
    };
    userId: string;
}

interface ReviewListProps {
    reviews: Review[];
    currentUserId?: string;
    onReviewDeleted?: () => void;
}

export function ReviewList({ reviews, currentUserId, onReviewDeleted }: ReviewListProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (reviewId: string) => {
        if (!currentUserId) return;

        if (!confirm('Tem certeza que deseja deletar esta avaliação?')) return;

        setDeletingId(reviewId);
        const result = await deleteReview(reviewId, currentUserId);
        setDeletingId(null);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Avaliação deletada');
            onReviewDeleted?.();
        }
    };

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900 rounded-xl">
                <p className="text-muted-foreground">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="glass rounded-xl border border-border p-6"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <StarRating rating={review.rating} size="sm" />
                                {review.verified && (
                                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>Compra Verificada</span>
                                    </div>
                                )}
                            </div>
                            <p className="font-medium text-sm">{review.user.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>

                        {/* Delete Button */}
                        {currentUserId === review.userId && (
                            <button
                                onClick={() => handleDelete(review.id)}
                                disabled={deletingId === review.id}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Title */}
                    {review.title && (
                        <h4 className="font-semibold mb-2">{review.title}</h4>
                    )}

                    {/* Comment */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                    </p>
                </div>
            ))}
        </div>
    );
}

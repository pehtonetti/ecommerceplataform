'use client';

import { useState } from 'react';
import { submitReview } from '@/backend/actions/review-actions';
import { StarRating } from './StarRating';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ReviewFormProps {
    productId: string;
    userId?: string;
    onSuccess?: () => void;
}

export function ReviewForm({ productId, userId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!userId) {
        return (
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
                <p className="text-blue-900 dark:text-blue-100">
                    Faça login para avaliar este produto
                </p>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await submitReview({
            productId,
            rating,
            title: title || undefined,
            comment
        });

        setIsSubmitting(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Avaliação enviada com sucesso!');
            setRating(5);
            setTitle('');
            setComment('');
            onSuccess?.();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-4">Avaliar Produto</h3>

            {/* Rating */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Sua Avaliação *</label>
                <StarRating
                    rating={rating}
                    interactive
                    onRatingChange={setRating}
                    size="lg"
                />
            </div>

            {/* Title */}
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Título (opcional)
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Resumo da sua experiência"
                    maxLength={100}
                />
            </div>

            {/* Comment */}
            <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium mb-2">
                    Comentário *
                </label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    minLength={10}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Conte-nos sobre sua experiência com o produto (mínimo 10 caracteres)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                    {comment.length} caracteres
                </p>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting || comment.length < 10}
                className="w-full bg-primary text-primary-foreground hover:opacity-90 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                    </>
                ) : (
                    'Enviar Avaliação'
                )}
            </button>
        </form>
    );
}

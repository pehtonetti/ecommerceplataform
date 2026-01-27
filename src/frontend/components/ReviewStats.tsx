'use client';

import { StarRating } from './StarRating';

interface ReviewStatsProps {
    stats: {
        totalReviews: number;
        averageRating: number;
        ratingDistribution: {
            [key: number]: number;
        };
    };
}

export function ReviewStats({ stats }: ReviewStatsProps) {
    const { totalReviews, averageRating, ratingDistribution } = stats;

    if (totalReviews === 0) {
        return null;
    }

    return (
        <div className="glass rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-4">Avaliações dos Clientes</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Average Rating */}
                <div className="text-center md:text-left">
                    <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                    <StarRating rating={averageRating} size="lg" />
                    <p className="text-sm text-muted-foreground mt-2">
                        Baseado em {totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'}
                    </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                        const count = ratingDistribution[stars] || 0;
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                        return (
                            <div key={stars} className="flex items-center gap-2">
                                <span className="text-sm w-8">{stars}★</span>
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-muted-foreground w-8 text-right">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

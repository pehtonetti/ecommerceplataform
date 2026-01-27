"use client";

import { useEffect, useState } from "react";
import { getAiRecommendations } from "@/backend/actions/ai-actions";
import ProductSection from "../ProductSection";
import { Sparkles } from "lucide-react";

export function AiProductRecommendations() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // AI Recommender call
        getAiRecommendations().then(data => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    if (loading || products.length === 0) return null;

    return (
        <div className="mt-16 pt-16 border-t border-border">
            <ProductSection
                title="Recomendado pela nossa Inteligência Artificial"
                subtitle="Com base no seu perfil e itens que você demonstrou interesse."
                products={products}
                icon={<Sparkles className="w-6 h-6 text-purple-600 fill-purple-200" />}
            />
        </div>
    );
}

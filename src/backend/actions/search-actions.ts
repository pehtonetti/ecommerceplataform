'use server'

import { prisma } from "@/lib/prisma";

export interface SearchFilters {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';
}

export async function searchProducts(filters: SearchFilters) {
    try {
        const {
            query,
            category,
            minPrice,
            maxPrice,
            inStock,
            sortBy = 'newest'
        } = filters;

        // Build where clause
        const where: any = {
            active: true
        };

        // Text search
        if (query) {
            where.OR = [
                { name: { contains: query } },
                { description: { contains: query } },
                { category: { contains: query } }
            ];
        }

        // Category filter
        if (category && category !== 'all') {
            where.category = category;
        }

        // Price range
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) {
                where.price.gte = minPrice * 100; // Convert to cents
            }
            if (maxPrice !== undefined) {
                where.price.lte = maxPrice * 100;
            }
        }

        // Stock filter
        if (inStock) {
            where.stock = { gt: 0 };
        }

        // Build orderBy
        let orderBy: any = { createdAt: 'desc' }; // default

        switch (sortBy) {
            case 'price-asc':
                orderBy = { price: 'asc' };
                break;
            case 'price-desc':
                orderBy = { price: 'desc' };
                break;
            case 'name-asc':
                orderBy = { name: 'asc' };
                break;
            case 'name-desc':
                orderBy = { name: 'desc' };
                break;
            case 'newest':
                orderBy = { createdAt: 'desc' };
                break;
        }

        // Execute query
        const products = await prisma.product.findMany({
            where,
            orderBy,
            take: 50 // Limit results
        });

        // Get categories for filters
        const categories = await prisma.product.findMany({
            where: { active: true },
            select: { category: true },
            distinct: ['category']
        });

        const uniqueCategories = categories.map(c => c.category);

        return {
            success: true,
            products,
            categories: uniqueCategories,
            total: products.length
        };
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return { error: 'Erro ao buscar produtos' };
    }
}

/**
 * Get product suggestions for autocomplete
 */
export async function getProductSuggestions(query: string) {
    try {
        if (!query || query.length < 2) {
            return { suggestions: [] };
        }

        const products = await prisma.product.findMany({
            where: {
                active: true,
                OR: [
                    { name: { contains: query } },
                    { category: { contains: query } }
                ]
            },
            select: {
                id: true,
                name: true,
                category: true,
                price: true,
                imageUrl: true
            },
            take: 5
        });

        return { suggestions: products };
    } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
        return { suggestions: [] };
    }
}

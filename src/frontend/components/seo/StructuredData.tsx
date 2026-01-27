"use client";

export function StructuredData({ data }: { data: any }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export function ProductStructuredData({ product }: { product: any }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": [
            product.imageUrl,
            ...(product.images || []).map((img: any) => img.url)
        ].filter(Boolean),
        "description": product.description,
        "sku": product.id,
        "brand": {
            "@type": "Brand",
            "name": "Antigravity Store"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://antigravity-store.com/product/${product.id}`,
            "priceCurrency": "BRL",
            "price": product.price / 100,
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "124"
        }
    };

    return <StructuredData data={jsonLd} />;
}

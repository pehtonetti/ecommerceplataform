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
    const reviews = product.reviews || [];
    const ratingValue = reviews.length > 0
        ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "5.0";
    const reviewCount = reviews.length > 0 ? reviews.length : "1";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": [
            product.imageUrl,
            ...(product.images || []).map((img: any) => img.url)
        ].filter(Boolean),
        "description": product.description.replace(/<[^>]*>/g, '').slice(0, 200),
        "sku": product.id,
        "mpn": product.id,
        "brand": {
            "@type": "Brand",
            "name": "Simplify"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://simplifytech.eu/product/${product.id}`,
            "priceCurrency": "BRL",
            "price": product.price / 100,
            "priceValidUntil": new Date(new Date().getFullYear() + 1, 0, 1).toISOString().split('T')[0],
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
                "@type": "Organization",
                "name": "Simplify Tech"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": ratingValue,
            "reviewCount": reviewCount
        }
    };

    return <StructuredData data={jsonLd} />;
}

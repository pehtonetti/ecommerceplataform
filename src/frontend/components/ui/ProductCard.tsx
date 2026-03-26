"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, ShoppingCart, Star, Heart, ZoomIn, ArrowRightLeft } from "lucide-react";
import { toggleWishlist } from "@/backend/actions/wishlist-actions";
import { toast } from "sonner";
import { QuickViewModal } from "./QuickViewModal";
import { useCompare } from "@/frontend/contexts/CompareContext";
import { useCart } from "@/frontend/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  images?: string[];
  videoUrl?: string | null;
  category: string;
}

interface ProductCardProps {
  product: Product;
  userId?: string;
}

export function ProductCard({ product, userId }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addToCompare } = useCompare();
  const { addToCart } = useCart();
  const router = useRouter();

  // Combine main imageUrl with extra images, filtered for uniqueness and valid strings
  const galleryImages = [
    product.imageUrl,
    ...(product.images || [])
  ].filter((url): url is string => !!url && url.trim() !== '');

  // Deduplicate
  const uniqueImages = Array.from(new Set(galleryImages));
  const displayImages = uniqueImages.slice(0, 3); // Limit to 3 images as requested

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Start cycling images if we have more than 1
    if (displayImages.length > 1) {
      const interval = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % displayImages.length);
      }, 1500); // Change image every 1.5s
      (window as any)[`card_interval_${product.id}`] = interval;
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setActiveImageIndex(0);
    const interval = (window as any)[`card_interval_${product.id}`];
    if (interval) clearInterval(interval);
  };

  const currentImage = displayImages[activeImageIndex] || product.imageUrl;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    await addToCart(product.id, 1);
    setIsAdding(false);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block glass overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-xl relative bg-card rounded-xl border border-border"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-square overflow-hidden bg-muted/20 flex items-center justify-center p-6">
        {/* Heart Button */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
            const res = await toggleWishlist(product.id);
            if (res.error) toast.error(res.error);
            else toast.success(res.action === 'added' ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
          }}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full backdrop-blur-md transition-all transform hover:scale-110 ${isWishlisted ? 'bg-background text-red-500 shadow-lg scale-110 border-none' : 'bg-black/5 dark:bg-white/10 text-foreground hover:bg-background hover:text-red-500 border border-border'}`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsQuickViewOpen(true);
          }}
          className={`absolute top-16 right-4 z-20 p-2 rounded-full backdrop-blur-md transition-all transform hover:scale-110 bg-black/5 dark:bg-white/10 text-foreground hover:bg-background hover:text-primary border border-border opacity-0 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Compare Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCompare(product);
          }}
          className={`absolute top-28 right-4 z-20 p-2 rounded-full backdrop-blur-md transition-all transform hover:scale-110 bg-black/5 dark:bg-white/10 text-foreground hover:bg-background hover:text-primary border border-border opacity-0 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
        {/* Image Display */}
        <div className="w-full h-full relative">
          {(product.videoUrl && (!displayImages.length || (isHovered && activeImageIndex === displayImages.length))) ? (
            <video
              src={product.videoUrl}
              className="w-full h-full object-cover rounded-md"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : displayImages.length > 0 ? (
            <Image
              src={displayImages[activeImageIndex]}
              alt={product.name}
              fill
              quality={80}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              className={`w-full h-full object-contain transition-all duration-500 ease-in-out ${isHovered ? 'scale-110' : 'scale-100'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e: any) => {
                // Set fallback to a placeholder if image fails
                const target = e.target as HTMLImageElement;
                target.src = '/images/logo.png';
              }}
            />
          ) : product.videoUrl ? (
            <video
              src={product.videoUrl}
              className="w-full h-full object-cover rounded-md"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted text-muted-foreground flex-col gap-2">
              <ZoomIn className="w-8 h-8 opacity-20" />
              <span className="text-xs font-medium">Sem imagem</span>
            </div>
          )}

          {/* Gallery Indicators */}
          {isHovered && displayImages.length > 1 && (
            <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1 z-20">
              {displayImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeImageIndex ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Hover Add to Cart Overlay */}
        <div
          onClick={handleAddToCart}
          className={`absolute bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t border-border transition-transform duration-300 flex items-center justify-center gap-2 cursor-pointer z-30 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}
        >
          <ShoppingCart className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {isAdding ? 'Adicionando...' : 'Adicionar ao carrinho'}
          </span>
        </div>
      </div>

      <div className="p-4 bg-card border-t border-border relative z-40">
        <p className="text-xl font-bold text-primary mb-1">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
            .format(product.price / 100)}
        </p>

        <h3 className="font-medium text-sm text-muted-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300" title={product.name}>
          {product.name}
        </h3>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </Link>
  );
}

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
  layoutConfig?: any;
}

export function ProductCard({ product, userId, layoutConfig }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const theme = layoutConfig?.theme || {
    borderRadius: 'rounded-xl',
    productCardStyle: 'shadowed',
    showAddToCartOnCard: true
  };

  const { addToCompare } = useCompare();
  const { addToCart } = useCart();
  const router = useRouter();

  const galleryImages = [
    product.imageUrl,
    ...(product.images || [])
  ].filter((url): url is string => !!url && url.trim() !== '');

  const displayImages = Array.from(new Set(galleryImages)).slice(0, 3);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (displayImages.length > 1) {
      const interval = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % displayImages.length);
      }, 1500);
      (window as any)[`card_interval_${product.id}`] = interval;
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setActiveImageIndex(0);
    const interval = (window as any)[`card_interval_${product.id}`];
    if (interval) clearInterval(interval);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product.id, 1);
    setIsAdding(false);
  };

  // Classes dinâmicas baseadas no CMS
  const cardStyles = {
    minimal: "border-transparent bg-transparent",
    bordered: "border-zinc-200 dark:border-zinc-800 bg-card shadow-none",
    shadowed: "border-zinc-100 dark:border-zinc-800 bg-card shadow-lg hover:shadow-2xl",
    glass: "backdrop-blur-md bg-white/60 dark:bg-black/60 border-white/20 shadow-xl"
  }[theme.productCardStyle as 'minimal' | 'bordered' | 'shadowed' | 'glass'] || "bg-card shadow-lg";

  return (
    <Link
      href={`/product/${product.id}`}
      className={`group block overflow-hidden transition-all duration-500 relative border ${theme.borderRadius} ${cardStyles}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-square overflow-hidden flex items-center justify-center p-4">
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
          className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all transform hover:scale-110 ${isWishlisted ? 'bg-white text-red-500 shadow-md translate-y-0' : 'bg-black/5 text-zinc-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsQuickViewOpen(true); }}
          className="absolute top-12 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur-md text-zinc-600 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all hover:text-indigo-600 shadow-sm"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        {/* Image Display */}
        <div className="w-full h-full relative">
          <Image
            src={displayImages[activeImageIndex] || product.imageUrl}
            alt={product.name}
            fill
            className={`object-contain transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            sizes="(max-width: 768px) 100vw, 240px"
          />
          
          {isHovered && displayImages.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {displayImages.map((_, idx) => (
                <div key={idx} className={`h-1 rounded-full transition-all ${idx === activeImageIndex ? 'w-4 bg-indigo-500' : 'w-1 bg-zinc-300'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Add to Cart Overlay (CMS Configurable) */}
        {theme.showAddToCartOnCard && (
          <div
            onClick={handleAddToCart}
            className={`absolute bottom-0 left-0 right-0 p-3 bg-indigo-600 text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer z-30 translate-y-full group-hover:translate-y-0`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isAdding ? 'Copiando...' : 'Comprar'}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm space-y-1">
        <p className="text-lg font-black text-zinc-900 dark:text-white">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 100)}
        </p>
        <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
      </div>

      <QuickViewModal product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
    </Link>
  );
}

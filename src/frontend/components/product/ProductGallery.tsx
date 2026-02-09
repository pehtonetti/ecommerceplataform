"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PlayCircle } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    video?: string | null;
    productName: string;
}

export function ProductGallery({ images, video, productName }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [failedImages, setFailedImages] = useState<number[]>([]);

    const hasVideo = !!video;

    // Auto-switch if selected image fails
    const handleImageError = (index: number) => {
        console.log(`Image at index ${index} failed to load.`);
        setFailedImages(prev => {
            if (prev.includes(index)) return prev;
            return [...prev, index];
        });
    };

    // Effect to switch away from broken image immediately
    if (failedImages.includes(selectedIndex)) {
        // Find next valid index
        let nextIndex = selectedIndex + 1;

        // If next is also broken, keep searching
        while (nextIndex < images.length && failedImages.includes(nextIndex)) {
            nextIndex++;
        }

        // Check bounds
        if (nextIndex < images.length) {
            setSelectedIndex(nextIndex);
        } else if (hasVideo) {
            // If all images fail, go to video
            if (selectedIndex !== images.length) {
                setSelectedIndex(images.length);
            }
        }
        // If no video and all images failed, we stay (will show placeholder) 
        // or we could reset to 0 to show placeholder on first slot
    }

    const isVideoSelected = hasVideo && selectedIndex === images.length;
    // Main image source - fallback handled by the effect, but we render placeholder if current is truly broken and no alternatives
    const currentMainImage = images[selectedIndex];

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails List */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:h-[500px] scrollbar-hide py-1">
                {images.map((img, idx) => {
                    if (failedImages.includes(idx)) return null; // Hide broken thumbnails

                    return (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={cn(
                                "relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                                selectedIndex === idx
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300 dark:hover:border-zinc-700"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`${productName} thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                                onError={() => handleImageError(idx)}
                                unoptimized
                            />
                        </button>
                    )
                })}

                {hasVideo && (
                    <button
                        onClick={() => setSelectedIndex(images.length)}
                        className={cn(
                            "relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all bg-gray-100 dark:bg-zinc-800 flex items-center justify-center",
                            selectedIndex === images.length
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300 dark:hover:border-zinc-700"
                        )}
                    >
                        <PlayCircle className="w-8 h-8 text-gray-500" />
                        <span className="sr-only">Ver Vídeo</span>
                    </button>
                )}
            </div>

            {/* Main Display */}
            <div className="flex-1 relative aspect-square md:aspect-auto md:h-[500px] glass overflow-hidden border border-border rounded-xl bg-white dark:bg-zinc-900">
                {isVideoSelected && video ? (
                    video.includes("youtube") || video.includes("youtu.be") ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src={video}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <video
                            src={video}
                            controls
                            autoPlay
                            loop
                            className="w-full h-full object-contain"
                        />
                    )
                ) : (
                    <Image
                        src={currentMainImage || '/images/placeholder.png'}
                        alt={productName}
                        fill
                        className="object-contain p-4 transition-opacity duration-300"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized
                        onError={() => {
                            if (selectedIndex < images.length) {
                                handleImageError(selectedIndex);
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
}

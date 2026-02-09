'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Banner {
    id: string;
    image?: string;
    gradient?: string;
    overlayImage?: string;
    title: string;
    subtitle?: string;
    link: string;
    textColor?: string;
}

const defaultBanners: Banner[] = [
    {
        id: '1',
        image: '/images/banner-final-1.png',
        title: '',
        subtitle: '',
        link: '/search?category=notebooks',
    },
    {
        id: '2',
        image: '/images/banner-final-2.png',
        title: '',
        subtitle: '',
        link: '/search?q=placa de video',
    },
    {
        id: '3',
        image: '/images/banner-final-3.png',
        title: '',
        subtitle: '',
        link: '/search?q=setup',
    },
];

export default function PromoBannerCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [banners] = useState<Banner[]>(defaultBanners);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 8000); // Increased duration for readability

        return () => clearInterval(timer);
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    return (
        <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] overflow-hidden group">
            {/* Banners */}
            <div
                className="flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                suppressHydrationWarning
            >
                {banners.map((banner) => (
                    <Link
                        key={banner.id}
                        href={banner.link}
                        className={`min-w-full h-full relative block cursor-pointer ${banner.gradient ? banner.gradient : ''}`}
                    >
                        {/* Background Image (if defined) */}
                        {banner.image && (
                            <div className="absolute inset-0 bg-black/10" suppressHydrationWarning>
                                {/* 1. Blurred Background layer to fill space */}
                                <div className="absolute inset-0 overflow-hidden" suppressHydrationWarning>
                                    <Image
                                        src={banner.image}
                                        alt=""
                                        fill
                                        className="object-cover blur-2xl opacity-60 scale-110"
                                        aria-hidden="true"
                                    />
                                </div>

                                {/* 2. Main Sharp Image (Centered and Contained) */}
                                <div className="absolute inset-0 z-10">
                                    <Image
                                        src={banner.image}
                                        alt={banner.title || 'Banner'}
                                        fill
                                        quality={100}
                                        priority={banner.id === '1'}
                                        className="object-contain object-center drop-shadow-2xl"
                                        sizes="100vw"
                                    />
                                </div>

                                {/* Overlay Gradient only if we have text to show */}
                                {banner.title && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-20" />
                                )}
                            </div>
                        )}

                        {/* Floating Product Image (if defined - for gradient slides) */}
                        {banner.overlayImage && (
                            <div className="absolute right-0 md:right-20 bottom-0 top-10 w-1/2 md:w-2/5 animate-in slide-in-from-right duration-1000 fade-in flex items-center justify-center">
                                <div className="relative w-full h-full transform translate-y-10 md:translate-y-0 hover:scale-105 transition-transform duration-500">
                                    <Image
                                        src={banner.overlayImage}
                                        alt="Product"
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        priority={banner.id === '1'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Content (Title/Button) - Only render if title exists */}
                        {banner.title && (
                            <div className="relative z-10 w-full h-full flex items-center pointer-events-none">
                                <div className="container mx-auto px-6 md:px-12">
                                    <div className="max-w-xl text-white animate-in slide-in-from-bottom duration-700 fade-in">
                                        <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight whitespace-pre-line drop-shadow-lg">
                                            {banner.title}
                                        </h2>
                                        {banner.subtitle && (
                                            <p className="text-lg md:text-xl text-gray-100 mb-8 font-light drop-shadow-md">
                                                {banner.subtitle}
                                            </p>
                                        )}
                                        <span
                                            className="inline-block px-8 py-3 bg-white text-black hover:bg-gray-100 rounded-full font-semibold transition-all transform shadow-lg pointer-events-auto"
                                        >
                                            Ver Ofertas
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Link>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={(e) => { e.preventDefault(); prevSlide(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-30"
                aria-label="Anterior"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={(e) => { e.preventDefault(); nextSlide(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-30"
                aria-label="Próximo"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => { e.preventDefault(); setCurrentSlide(index); }}
                        className={`transition-all duration-300 rounded-full ${index === currentSlide
                            ? 'w-8 h-2 bg-white shadow-lg'
                            : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Ir para slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Smooth Transition Gradient to Page Body */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-20" />
        </div>
    );
}

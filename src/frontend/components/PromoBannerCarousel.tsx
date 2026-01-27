'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Banner {
    id: string;
    image: string;
    title: string;
    subtitle?: string;
    link: string;
}

const defaultBanners: Banner[] = [
    {
        id: '1',
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001&auto=format&fit=crop', // Electronics Setup
        title: 'Até 50% OFF em Eletrônicos',
        subtitle: 'As melhores marcas com descontos imperdíveis',
        link: '/search?category=eletronicos',
    },
    {
        id: '2',
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop', // Setup Dark
        title: 'Frete Grátis acima de R$ 99',
        subtitle: 'Para todo o Brasil em produtos selecionados',
        link: '/search',
    },
    {
        id: '3',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop', // Gaming
        title: 'Novidades da Semana',
        subtitle: 'Confira os lançamentos mais recentes',
        link: '/search?sort=newest',
    },
];

export default function PromoBannerCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [banners] = useState<Banner[]>(defaultBanners);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 6000);

        return () => clearInterval(timer);
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    return (
        <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden group">
            {/* Banners */}
            <div
                className="flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className="min-w-full h-full relative"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <Image
                                src={banner.image}
                                alt={banner.title}
                                fill
                                className="object-cover"
                                priority={banner.id === '1'}
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 w-full h-full flex items-center">
                            <div className="container mx-auto px-6 md:px-12">
                                <div className="max-w-xl text-white animate-in slide-in-from-bottom duration-700 fade-in">
                                    <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                                        {banner.title}
                                    </h2>
                                    {banner.subtitle && (
                                        <p className="text-lg md:text-xl text-gray-200 mb-8 font-light">
                                            {banner.subtitle}
                                        </p>
                                    )}
                                    <Link
                                        href={banner.link}
                                        className="inline-block px-8 py-3 bg-white text-black hover:bg-gray-100 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                                    >
                                        Ver Ofertas
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                aria-label="Anterior"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                aria-label="Próximo"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-300 rounded-full ${index === currentSlide
                            ? 'w-8 h-2 bg-white'
                            : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Ir para slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

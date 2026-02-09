'use client';

import { Smartphone, Watch, Headphones, Monitor, Camera, Gamepad } from 'lucide-react';
import Link from 'next/link';

const categories = [
    {
        icon: <Smartphone className="w-8 h-8" />,
        name: 'Smartphones',
        count: '120+ modelos',
        color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        href: '/search?category=smartphones'
    },
    {
        icon: <Headphones className="w-8 h-8" />,
        name: 'Áudio',
        count: 'Fones e caixas',
        color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
        href: '/search?category=audio'
    },
    {
        icon: <Watch className="w-8 h-8" />,
        name: 'Smartwatches',
        count: 'Acessórios',
        color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
        href: '/search?category=smartwatches'
    },
    {
        icon: <Monitor className="w-8 h-8" />,
        name: 'Informática',
        count: 'PC e Periféricos',
        color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
        href: '/search?category=informatica'
    },
];

export default function FeaturedCategories() {
    return (
        <section className="relative z-10 -mt-8 mx-4">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-800 shadow-xl rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Navegue por Categorias</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat, index) => (
                        <Link
                            href={cat.href}
                            key={index}
                            className={`group relative overflow-hidden p-4 rounded-xl hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center gap-2 border border-transparent hover:border-border bg-gray-50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800`}
                        >
                            <div className={`p-3 rounded-full mb-1 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${cat.color.split(' ')[0]} bg-opacity-20`}>
                                <div className={cat.color.split(' ')[1]}>
                                    {cat.icon}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">{cat.name}</h3>
                                <p className="text-xs text-muted-foreground font-medium">{cat.count}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

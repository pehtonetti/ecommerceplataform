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
        <section className="mb-0">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 px-1">Navegue por Categorias</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat, index) => (
                    <Link
                        href={cat.href}
                        key={index}
                        className={`group ${cat.color} p-6 rounded-2xl hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center gap-3 border border-transparent hover:border-current bg-card`}
                    >
                        <div className="p-3 bg-white/50 dark:bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                            {cat.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{cat.name}</h3>
                            <p className="text-sm opacity-70 font-medium">{cat.count}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

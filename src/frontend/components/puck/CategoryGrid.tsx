'use client';

export default function CategoryGrid() {
    return (
        <section className="mb-8 container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Categorias em Destaque</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Eletrônicos', 'Moda', 'Casa', 'Esportes'].map((category) => (
                    <a
                        key={category}
                        href={`/search?category=${category.toLowerCase()}`}
                        className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow text-center block"
                    >
                        <h3 className="font-semibold text-lg text-gray-800">{category}</h3>
                        <p className="text-sm text-gray-600 mt-1">Ver produtos</p>
                    </a>
                ))}
            </div>
        </section>
    );
}


import { FadeIn } from '@/frontend/components/ui/Motion';
import Link from 'next/link';

export default function BlogPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <FadeIn>
                <h1 className="text-3xl font-bold mb-8">Blog Loja Tech</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-xl">
                        <div className="h-48 bg-gray-200 dark:bg-zinc-800 rounded-lg mb-4"></div>
                        <h3 className="text-xl font-bold mb-2">Novidades em Tecnologia em 2025</h3>
                        <p className="text-muted-foreground mb-4">Confira o que esperar dos lançamentos deste ano.</p>
                        <Link href="#" className="text-primary hover:underline">Ler mais</Link>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}

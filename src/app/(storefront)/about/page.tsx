import { Header } from "@/frontend/components/Header";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans pb-20">
            <Header />
            <div className="container mx-auto pt-32 px-4">
                <h1 className="text-3xl font-bold mb-4">Sobre a Store</h1>
                <p className="text-muted-foreground">
                    Esta é uma página demonstrativa. Aqui contaremos a história da nossa marca.
                </p>
            </div>
        </div>
    );
}

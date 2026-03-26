import { getCurrentUser } from '@/lib/auth';
import { Header } from '@/frontend/components/Header';
import { Footer } from '@/frontend/components/Footer';

export default async function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen bg-transparent flex flex-col font-sans">
            <Header user={user} />
            <main className="flex-1 pt-[88px] md:pt-[104px]">
                {children}
            </main>
            <Footer />
        </div>
    );
}

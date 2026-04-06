import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { MerchantSidebar } from '@/components/merchant/sidebar';
import { getStoreContext } from '@/backend/lib/store-context';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    if (!user) redirect('/login');
    if (user.role !== 'merchant' && user.role !== 'admin') redirect('/');

    let storeName = 'Minha Loja';
    let storeSlug = '';
    try {
        const storeContext = await getStoreContext();
        if (storeContext) {
            storeName = storeContext.name;
            storeSlug = storeContext.slug;
        }
    } catch (error) {
        console.error('Erro ao obter contexto da loja:', error);
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-black overflow-hidden font-sans">
            <MerchantSidebar storeName={storeName} storeSlug={storeSlug} />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-zinc-950">
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}


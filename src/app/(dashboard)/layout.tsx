import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { MerchantSidebar } from '@/components/merchant/sidebar';
import { getStoreContext } from '@/backend/lib/store-context';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    // 1. Must be logged in
    if (!user) {
        redirect('/login');
    }

    // 2. Only Merchants (Lojista Simplify) and Admins can access
    if (user.role !== 'merchant' && user.role !== 'admin') {
        redirect('/');
    }

    // 3. Obtains the Store Context for the logged merchant
    // Since this is the /dashboard path, the merchant is accessing their own store data.
    // getStoreContext() securely retrieves the active store through middleware headers.
    let storeName = 'Minha Loja Simplify';
    try {
        const storeContext = await getStoreContext();
        if (storeContext) {
            storeName = storeContext.name;
        }
    } catch (error) {
        console.error('Lojista sem loja associada ou erro de contexto', error);
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-black overflow-hidden m-0 font-sans">
            {/* Sidebar Exclusiva para Lojistas Simplify */}
            <MerchantSidebar storeName={storeName} />
            
            {/* Main Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-zinc-950">
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}

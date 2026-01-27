import { Header } from "@/frontend/components/Header";
import { Footer } from "@/frontend/components/Footer";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { getUserAddresses } from "@/backend/actions/address-actions";
import { AddressManager } from "@/frontend/components/account/AddressManager";
import { MapPin } from "lucide-react";

export default async function AddressesPage() {
    const { addresses } = await getUserAddresses();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
                <FadeIn>
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <MapPin className="w-8 h-8 text-primary" />
                            <h1 className="text-3xl font-bold">Meus Endereços</h1>
                        </div>

                        <div className="glass rounded-2xl border border-border p-6 md:p-8">
                            <AddressManager initialAddresses={addresses || []} />
                        </div>
                    </div>
                </FadeIn>
            </main>
            <Footer />
        </div>
    );
}

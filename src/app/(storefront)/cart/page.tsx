import { getCart } from "@/backend/actions/cart-actions";
import { getCurrentUser } from "@/lib/auth";
import { CartClient } from "@/frontend/components/cart/CartClient";
import { redirect } from "next/navigation";


export default async function CartPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login?redirect=/cart');
    }

    const { cart } = await getCart(user.id);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans flex flex-col">
            <main className="flex-1 container mx-auto px-4 pt-8 pb-20">
                <h1 className="text-3xl font-bold mb-8">Meu Carrinho</h1>
                <CartClient cart={cart} user={user} />
            </main>
        </div>
    );
}

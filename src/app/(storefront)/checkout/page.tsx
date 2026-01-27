import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/backend/actions/cart-actions";
import { getUserAddresses } from "@/backend/actions/checkout-actions";
import { redirect } from "next/navigation";
import { CheckoutClient } from "@/frontend/components/checkout/CheckoutClient";

export default async function CheckoutPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login?redirect=/checkout');
    }

    const { cart } = await getCart(user.id);
    if (!cart || cart.items.length === 0) {
        redirect('/cart');
    }

    const addresses = await getUserAddresses();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans pb-20">
            <main className="container mx-auto px-4 pt-8">
                <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>
                <CheckoutClient cart={cart} user={user} addresses={addresses} />
            </main>
        </div>
    );
}

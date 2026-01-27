import { getCurrentUser } from "@/lib/auth";
import { getUserOrders } from "@/backend/actions/order-actions";
import { redirect } from "next/navigation";
import { AccountDashboard } from "@/frontend/components/account/AccountDashboard";

export default async function AccountPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login?redirect=/account');
    }

    const result = await getUserOrders(user.id);
    const orders = result.orders || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans flex flex-col">
            <div className="flex-1 container mx-auto px-4 pt-8 pb-20">
                <AccountDashboard user={user} orders={orders} />
            </div>
        </div>
    );
}

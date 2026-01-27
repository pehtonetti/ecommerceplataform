import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoyaltyHub from "./LoyaltyHub";

export default async function LoyaltyPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login?redirect=/account/loyalty');
    }

    return <LoyaltyHub user={user} />;
}

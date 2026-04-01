import { getStoreContext } from "@/backend/lib/store-context";
import { PlanSettingsClient } from "./PlanSettingsClient";

export default async function PlanSettingsPage() {
    const store = await getStoreContext();

    return <PlanSettingsClient store={store} />;
}

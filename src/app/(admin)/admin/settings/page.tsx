import { getStoreConfig } from "@/backend/actions/store-config-actions";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
    const response = await getStoreConfig();
    const config = response.success ? response.config : null;

    return <SettingsForm initialData={config} />;
}

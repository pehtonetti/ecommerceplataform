import { getLayoutConfig } from "@/backend/actions/layout-actions";
import EditorPageClient from "./client-page";

export default async function EditorPage() {
    const result = await getLayoutConfig();
    const data = result.success ? result.layout : null;

    // Simplify initial data for the new custom CMS
    // We expect { content: [], root: {} } as a baseline
    let initialData = { content: [], root: {} };

    if (data && typeof data === 'object' && !Array.isArray(data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        initialData = data as any;
    }

    return <EditorPageClient initialData={initialData} />;
}

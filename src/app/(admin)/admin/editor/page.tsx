import { getLayoutConfig } from "@/backend/actions/layout-actions";
import EditorPageClient from "./client-page";

export default async function EditorPage() {
    const data = await getLayoutConfig();

    // getLayoutConfig currently returns 'LayoutSection[]' (Old Format)
    // We need to handle migration or reset. 
    // If it's an array, it's old format. If it's an object { content: ... }, it's Puck.

    let initialData = { content: [], root: {} };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (data && !Array.isArray(data) && (data as any).content) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        initialData = data as any;
    }

    return <EditorPageClient initialData={initialData} />;
}

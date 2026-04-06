import { getPostById } from "@/backend/actions/blog-actions";
import { BlogEditor } from "../../BlogEditor";
import { notFound } from "next/navigation";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await getPostById(id);

    if (!result.success || !('post' in result)) {
        notFound();
    }

    return <BlogEditor post={result.post as any} />;
}

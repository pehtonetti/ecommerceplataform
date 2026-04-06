import { getPostBySlug } from "@/backend/actions/blog-actions";
import { FadeIn } from "@/frontend/components/ui/Motion";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const result = await getPostBySlug(slug);
    if (!result.success || !('post' in result)) return { title: 'Post não encontrado' };
    return {
        title: result.post.title,
        description: result.post.content.slice(0, 160),
        openGraph: {
            title: result.post.title,
            description: result.post.content.slice(0, 160),
            images: result.post.imageUrl ? [result.post.imageUrl] : [],
        },
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const result = await getPostBySlug(slug);

    if (!result.success || !('post' in result)) {
        notFound();
    }

    const post = result.post;
    const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    // Simple markdown to HTML
    const renderContent = (text: string) => {
        return text
            .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-black mt-8 mb-4">$1</h1>')
            .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3 border-b pb-2">$1</h2>')
            .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-5 mb-2">$1</h3>')
            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
            .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
            .replace(/^- (.+)$/gm, '<li class="ml-6 list-disc mb-1">$1</li>')
            .replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal mb-1">$1</li>')
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-indigo-600 underline hover:text-indigo-800">$1</a>')
            .replace(/\n\n/g, '</p><p class="mb-5 leading-relaxed text-foreground/80">')
            .replace(/\n/g, '<br/>');
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <FadeIn>
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Blog
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                        {post.author && (
                            <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4" /> por {post.author}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" /> ~{readTime} min de leitura
                        </span>
                    </div>
                    <h1 className="text-4xl font-black leading-tight tracking-tight mb-4">{post.title}</h1>
                </div>

                {/* Cover */}
                {post.imageUrl && (
                    <div className="relative h-80 w-full rounded-3xl overflow-hidden mb-10 border">
                        <Image src={post.imageUrl} alt={post.title} fill className="object-cover" priority />
                    </div>
                )}

                {/* Content */}
                <div
                    className="text-base leading-relaxed space-y-0"
                    dangerouslySetInnerHTML={{
                        __html: `<p class="mb-5 leading-relaxed text-foreground/80">${renderContent(post.content)}</p>`
                    }}
                />

                {/* Footer  */}
                <div className="mt-12 pt-8 border-t">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Ver todos os posts
                    </Link>
                </div>
            </FadeIn>
        </div>
    );
}

import { getPublishedPosts } from "@/backend/actions/blog-actions";
import { FadeIn } from "@/frontend/components/ui/Motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog",
    description: "Acompanhe as novidades, dicas e conteúdo exclusivo da nossa loja.",
};

export default async function BlogPage() {
    const result = await getPublishedPosts();
    const posts = result.success && 'posts' in result ? result.posts : [];

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <FadeIn>
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-4">
                        <BookOpen className="w-3.5 h-3.5" /> Blog
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-3">
                        Conteúdo & Novidades
                    </h1>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Fique por dentro das últimas novidades, tutoriais e dicas exclusivas da nossa loja.
                    </p>
                </div>
            </FadeIn>

            {posts.length === 0 ? (
                <FadeIn delay={0.1}>
                    <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Nenhum post publicado ainda</h2>
                        <p className="text-muted-foreground">Em breve teremos novidades aqui!</p>
                    </div>
                </FadeIn>
            ) : (
                <>
                    {/* Featured post */}
                    {posts[0] && (
                        <FadeIn delay={0.1}>
                            <Link href={`/blog/${posts[0].slug}`} className="group block mb-10">
                                <div className="grid md:grid-cols-2 gap-6 p-6 rounded-3xl border bg-card hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
                                    <div className="relative h-64 rounded-2xl overflow-hidden bg-muted">
                                        {posts[0].imageUrl ? (
                                            <Image src={posts[0].imageUrl} alt={posts[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-6xl">📝</div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold">Em destaque</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center py-4">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(posts[0].createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                            </span>
                                            {posts[0].author && (
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" /> {posts[0].author}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-2xl font-black mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                                            {posts[0].title}
                                        </h2>
                                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                                            {posts[0].content.replace(/[#*_>]/g, '').slice(0, 200)}...
                                        </p>
                                        <div className="flex items-center gap-1.5 text-indigo-600 text-sm font-semibold group-hover:gap-3 transition-all">
                                            Ler artigo <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </FadeIn>
                    )}

                    {/* Grid of other posts */}
                    {posts.length > 1 && (
                        <FadeIn delay={0.2}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {posts.slice(1).map((post) => (
                                    <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                                        <div className="rounded-2xl border bg-card hover:border-indigo-200 hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col">
                                            <div className="relative h-44 bg-muted overflow-hidden">
                                                {post.imageUrl ? (
                                                    <Image src={post.imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-5xl">📝</div>
                                                )}
                                            </div>
                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                                <h3 className="font-bold text-base mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                                                    {post.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
                                                    {post.content.replace(/[#*_>]/g, '').slice(0, 120)}...
                                                </p>
                                                <div className="flex items-center gap-1 text-indigo-600 text-xs font-semibold mt-3 group-hover:gap-2 transition-all">
                                                    Ler mais <ArrowRight className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </FadeIn>
                    )}
                </>
            )}
        </div>
    );
}

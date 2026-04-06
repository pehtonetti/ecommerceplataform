import { getPosts } from "@/backend/actions/blog-actions";
import { Button } from "@/frontend/components/ui/Button";
import { Plus, FileText, Eye, EyeOff, Pencil, Trash2, ExternalLink, Calendar, User } from "lucide-react";
import Link from "next/link";
import { BlogPostActions } from "./BlogPostActions";

export default async function BlogDashboardPage() {
    const result = await getPosts();
    const posts = result.success && 'posts' in result ? result.posts : [];

    const published = posts.filter(p => p.published).length;
    const drafts = posts.filter(p => !p.published).length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blog da Loja</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Crie conteúdo para atrair clientes e melhorar seu SEO no Google.
                    </p>
                </div>
                <Link href="/dashboard/blog/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Post
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border bg-card shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total</p>
                        <p className="text-2xl font-bold">{posts.length}</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl border bg-card shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Eye className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Publicados</p>
                        <p className="text-2xl font-bold">{published}</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl border bg-card shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                        <EyeOff className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Rascunhos</p>
                        <p className="text-2xl font-bold">{drafts}</p>
                    </div>
                </div>
            </div>

            {/* Posts List */}
            <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Nenhum post ainda</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-6">
                            Criar conteúdo regular é uma das melhores formas de atrair clientes 
                            organicamente pelo Google. Comece agora!
                        </p>
                        <Link href="/dashboard/blog/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Criar primeiro post
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {posts.map((post) => (
                            <div key={post.id} className="flex items-start justify-between gap-4 p-5 hover:bg-muted/30 transition-colors group">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${post.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {post.published ? <><Eye className="w-3 h-3" /> Publicado</> : <><EyeOff className="w-3 h-3" /> Rascunho</>}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-base text-foreground group-hover:text-indigo-600 transition-colors truncate">
                                        {post.title}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                        {post.author && (
                                            <span className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {post.author}
                                            </span>
                                        )}
                                        <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">/{post.slug}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                        {post.content.replace(/[#*_>]/g, '').slice(0, 120)}...
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {post.published && (
                                        <Link href={`/blog/${post.slug}`} target="_blank">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-indigo-50 hover:text-indigo-600">
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                    )}
                                    <Link href={`/dashboard/blog/${post.id}`}>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-indigo-50 hover:text-indigo-600">
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                    </Link>
                                    <BlogPostActions postId={post.id} published={post.published} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

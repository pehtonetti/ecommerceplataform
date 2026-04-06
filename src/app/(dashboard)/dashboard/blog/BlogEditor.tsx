"use client";

import { useState, useTransition } from "react";
import { createPost, updatePost } from "@/backend/actions/blog-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/frontend/components/ui/Button";
import { ArrowLeft, Eye, Save, Loader2, Image, Bold, Italic, List, Heading2, Link2 } from "lucide-react";
import Link from "next/link";

interface Post {
    id: string;
    title: string;
    content: string;
    imageUrl: string | null;
    author: string | null;
    published: boolean;
    slug: string;
}

export function BlogEditor({ post }: { post?: Post }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [title, setTitle] = useState(post?.title || '');
    const [content, setContent] = useState(post?.content || '');
    const [imageUrl, setImageUrl] = useState(post?.imageUrl || '');
    const [author, setAuthor] = useState(post?.author || '');
    const [published, setPublished] = useState(post?.published || false);
    const [preview, setPreview] = useState(false);

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    // Simple markdown toolbar helpers
    const insertMarkdown = (before: string, after = '') => {
        const textarea = document.getElementById('blog-content') as HTMLTextAreaElement;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = content.slice(start, end);
        const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
        setContent(newContent);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    const handleSave = (shouldPublish?: boolean) => {
        if (!title.trim()) { toast.error('Título é obrigatório'); return; }
        if (!content.trim()) { toast.error('Conteúdo é obrigatório'); return; }

        startTransition(async () => {
            const fd = new FormData();
            fd.append('title', title);
            fd.append('content', content);
            fd.append('imageUrl', imageUrl);
            fd.append('author', author);
            fd.append('published', shouldPublish !== undefined ? String(shouldPublish) : String(published));

            const result = post ? await updatePost(post.id, fd) : await createPost(fd);

            if (result.success) {
                toast.success(post ? 'Post atualizado!' : 'Post criado!');
                router.push('/dashboard/blog');
            } else {
                toast.error(result.error || 'Erro ao salvar post');
            }
        });
    };

    // Simple markdown preview renderer
    const renderPreview = (text: string) => {
        return text
            .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-black mt-6 mb-3">$1</h1>')
            .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-5 mb-2">$1</h2>')
            .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-4 mb-2">$1</h3>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
            .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-indigo-600 underline">$1</a>')
            .replace(/\n\n/g, '</p><p class="mb-4">')
            .replace(/\n/g, '<br/>');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/blog">
                        <Button variant="ghost" size="sm" className="h-8">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">{post ? 'Editar Post' : 'Novo Post'}</h1>
                        <p className="text-xs text-muted-foreground">{wordCount} palavras · ~{readTime} min de leitura</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreview(!preview)}
                        className="hidden sm:flex"
                    >
                        <Eye className="h-4 w-4 mr-1.5" />
                        {preview ? 'Editor' : 'Preview'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSave(false)}
                        disabled={isPending}
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
                        Salvar rascunho
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleSave(true)}
                        disabled={isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Publicar
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
                {/* Main Editor */}
                <div className="space-y-4">
                    {/* Title */}
                    <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <input
                            id="post-title"
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Título do post..."
                            className="w-full text-3xl font-black bg-transparent border-none outline-none placeholder:text-muted-foreground/40 text-foreground"
                        />
                    </div>

                    {/* Cover Image */}
                    {imageUrl && !preview && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt="Capa" className="w-full h-48 object-cover rounded-2xl border" />
                    )}

                    {/* Toolbar */}
                    {!preview && (
                        <div className="flex items-center gap-1 p-3 rounded-xl border bg-card shadow-sm flex-wrap">
                            <button type="button" onClick={() => insertMarkdown('## ')} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Título H2">
                                <Heading2 className="w-4 h-4" />
                            </button>
                            <button type="button" onClick={() => insertMarkdown('**', '**')} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground font-bold text-sm" title="Negrito">
                                <Bold className="w-4 h-4" />
                            </button>
                            <button type="button" onClick={() => insertMarkdown('*', '*')} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground italic text-sm" title="Itálico">
                                <Italic className="w-4 h-4" />
                            </button>
                            <button type="button" onClick={() => insertMarkdown('\n- ')} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Lista não-ordenada">
                                <List className="w-4 h-4" />
                            </button>
                            <button type="button" onClick={() => insertMarkdown('[', '](url)')} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Link">
                                <Link2 className="w-4 h-4" />
                            </button>
                            <div className="ml-auto text-xs text-muted-foreground font-mono">Markdown suportado</div>
                        </div>
                    )}

                    {/* Content */}
                    <div className={`rounded-2xl border bg-card shadow-sm overflow-hidden ${preview ? 'p-6' : ''}`}>
                        {preview ? (
                            <div
                                className="prose prose-sm max-w-none text-foreground"
                                dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${renderPreview(content)}</p>` }}
                            />
                        ) : (
                            <textarea
                                id="blog-content"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Escreva seu conteúdo aqui... (Markdown suportado)

## Introdução
Comece com uma introdução cativante sobre o assunto...

## Desenvolvimento
Explique o tema com detalhes e exemplos práticos...

## Conclusão
Finalize com um resumo e chamada para ação."
                                className="w-full min-h-[500px] p-6 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground/40 font-mono leading-relaxed"
                            />
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Status */}
                    <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <h3 className="font-semibold text-sm mb-3">Publicação</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {published ? 'Publicado' : 'Rascunho'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Palavras</span>
                                <span className="text-sm font-semibold">{wordCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Leitura</span>
                                <span className="text-sm font-semibold">~{readTime} min</span>
                            </div>
                        </div>
                    </div>

                    {/* Author */}
                    <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <h3 className="font-semibold text-sm mb-3">Autor</h3>
                        <input
                            type="text"
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            placeholder="Nome do autor"
                            className="w-full bg-muted/50 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    {/* Cover Image */}
                    <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Image className="w-4 h-4" /> Imagem de Capa
                        </h3>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                            placeholder="https://exemplo.com/imagem.jpg"
                            className="w-full bg-muted/50 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        {imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imageUrl} alt="preview" className="mt-3 w-full h-32 object-cover rounded-lg border" />
                        )}
                    </div>

                    {/* SEO tip */}
                    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5">
                        <h3 className="font-semibold text-sm text-indigo-700 mb-2">💡 Dica de SEO</h3>
                        <p className="text-xs text-indigo-600/80 leading-relaxed">
                            Posts com mais de 800 palavras e imagem de capa tendem a ranquear melhor no Google. 
                            Use o título e subtítulos (##) para estruturar o conteúdo.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

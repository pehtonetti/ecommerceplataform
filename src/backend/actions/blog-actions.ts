'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getStoreId } from "@/backend/lib/store-context";

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export async function getPosts() {
    try {
        const storeId = await getStoreId();
        const posts = await prisma.post.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, posts };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Get Posts Error', e);
        return { success: false, error: 'Erro ao buscar posts', posts: [] };
    }
}

export async function getPublishedPosts() {
    try {
        const storeId = await getStoreId();
        const posts = await prisma.post.findMany({
            where: { storeId, published: true },
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, posts };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Get Published Posts Error', e);
        return { success: false, error: 'Erro ao buscar posts publicados', posts: [] };
    }
}

export async function getPostBySlug(slug: string) {
    try {
        const storeId = await getStoreId();
        const post = await prisma.post.findFirst({
            where: { storeId, slug, published: true },
        });
        if (!post) return { success: false, error: 'Post não encontrado' };
        return { success: true, post };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Get Post By Slug Error', e);
        return { success: false, error: 'Erro ao buscar post' };
    }
}

export async function getPostById(id: string) {
    try {
        const storeId = await getStoreId();
        const post = await prisma.post.findFirst({
            where: { storeId, id },
        });
        if (!post) return { success: false, error: 'Post não encontrado' };
        return { success: true, post };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Get Post By ID Error', e);
        return { success: false, error: 'Erro ao buscar post' };
    }
}

export async function createPost(formData: FormData) {
    try {
        const storeId = await getStoreId();
        const title = formData.get('title')?.toString();
        const content = formData.get('content')?.toString();
        const imageUrl = formData.get('imageUrl')?.toString() || null;
        const author = formData.get('author')?.toString() || null;
        const published = formData.get('published') === 'true';

        if (!title) return { success: false, error: 'Título é obrigatório' };
        if (!content) return { success: false, error: 'Conteúdo é obrigatório' };

        const baseSlug = generateSlug(title);
        // Ensure unique slug per store
        const existing = await prisma.post.findFirst({ where: { storeId, slug: baseSlug } });
        const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

        const post = await prisma.post.create({
            data: { storeId, title, content, imageUrl, author, slug, published },
        });

        revalidatePath('/dashboard/blog');
        revalidatePath('/blog');
        return { success: true, post };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Create Post Error', e);
        return { success: false, error: 'Erro ao criar post' };
    }
}

export async function updatePost(id: string, formData: FormData) {
    try {
        const storeId = await getStoreId();
        const title = formData.get('title')?.toString();
        const content = formData.get('content')?.toString();
        const imageUrl = formData.get('imageUrl')?.toString() || null;
        const author = formData.get('author')?.toString() || null;
        const published = formData.get('published') === 'true';

        if (!title) return { success: false, error: 'Título é obrigatório' };
        if (!content) return { success: false, error: 'Conteúdo é obrigatório' };

        const post = await prisma.post.findFirst({ where: { id, storeId } });
        if (!post) return { success: false, error: 'Post não encontrado' };

        const slug = generateSlug(title);

        const updated = await prisma.post.update({
            where: { id },
            data: { title, content, imageUrl, author, slug, published },
        });

        revalidatePath('/dashboard/blog');
        revalidatePath(`/dashboard/blog/${id}`);
        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);
        return { success: true, post: updated };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Update Post Error', e);
        return { success: false, error: 'Erro ao atualizar post' };
    }
}

export async function togglePostPublished(id: string, published: boolean) {
    try {
        const storeId = await getStoreId();
        const post = await prisma.post.findFirst({ where: { id, storeId } });
        if (!post) return { success: false, error: 'Post não encontrado' };

        await prisma.post.update({ where: { id }, data: { published } });

        revalidatePath('/dashboard/blog');
        revalidatePath('/blog');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Toggle Post Error', e);
        return { success: false, error: 'Erro ao atualizar status do post' };
    }
}

export async function deletePost(id: string) {
    try {
        const storeId = await getStoreId();
        const post = await prisma.post.findFirst({ where: { id, storeId } });
        if (!post) return { success: false, error: 'Post não encontrado' };

        await prisma.post.delete({ where: { id } });

        revalidatePath('/dashboard/blog');
        revalidatePath('/blog');
        return { success: true };
    } catch (e: any) {
        if (e?.digest?.startsWith('NEXT_REDIRECT')) throw e;
        console.error('Delete Post Error', e);
        return { success: false, error: 'Erro ao deletar post' };
    }
}


import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from './lib/prisma';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Caminhos que exigem autenticação básica (cliente)
    const clientPaths = ['/account', '/orders', '/checkout/success'];
    // Caminhos que exigem nível administrativo (admin ou editor)
    const adminPaths = ['/admin', '/api/admin'];

    const isClientPath = clientPaths.some(path => pathname.startsWith(path));
    const isAdminPath = adminPaths.some(path => pathname.startsWith(path));

    // Se não for rota protegida, deixa passar
    if (!isClientPath && !isAdminPath) {
        return NextResponse.next();
    }

    // Verifica se o cookie de sessão existe
    // Com a nova regra, este cookie é de sessão (expira ao fechar o navegador)
    const sessionToken = request.cookies.get('ecommerce_session');

    if (!sessionToken) {
        // Bloqueio Total: Sem token, redireciona para login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Validação de Hierarquia (Admin/Editor)
    if (isAdminPath) {
        try {
            // Verificação em tempo real no banco de dados
            const user = await prisma.user.findUnique({
                where: { id: sessionToken.value },
                select: { role: true }
            });

            if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
                console.error(`Tentativa de invasão detectada: Usuário ${sessionToken.value} tentou acessar ${pathname}`);

                // Se for uma chamada de API, retorna 403 em vez de redirecionar
                if (pathname.startsWith('/api/')) {
                    return new NextResponse(
                        JSON.stringify({ error: 'Não autorizado. Nível de acesso insuficiente.' }),
                        { status: 403, headers: { 'Content-Type': 'application/json' } }
                    );
                }

                // Para rotas de página, redireciona para home
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (error) {
            console.error('Erro crítico no middleware de segurança:', error);
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Para caminhos de cliente, apenas a existência do token (autenticação) é suficiente por enquanto
    // pois o RootLayout e outras camadas já filtram os dados por ID.

    return NextResponse.next();
}

// Configuração de Matcher para cobrir todo o projeto sensível
export const config = {
    matcher: [
        '/admin/:path*',
        '/account/:path*',
        '/orders/:path*',
        '/checkout/success/:path*',
        '/api/admin/:path*'
    ],
};

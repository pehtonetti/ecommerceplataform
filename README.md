# Simplify Platform - E-commerce CMS Multi-tenant

A Simplify é uma plataforma de e-commerce White-Label de alto desempenho, projetada para permitir que lojistas criem suas vitrines digitais em segundos. Com uma arquitetura multi-tenant moderna, o sistema isola dados por subdomínios, oferecendo um CMS robusto e segurança de nível bancário.

---

## Visão Geral

A Simplify atua como uma infraestrutura completa para criação de lojas:
- Landing Page: Fluxo de onboarding em 2 passos para novos lojistas.
- CMS para Lojistas: Painel completo para gerenciar produtos, pedidos, banners, blog, cupons e avaliações.
- Storefront Dinâmico: Vitrines ultra-rápidas otimizadas para conversão e SEO.
- Segurança Nativa: Proteção contra ataques comuns, sistema de sessões baseado em tokens no banco e auditoria de ações.

---

## Stack Tecnológica

- Framework: Next.js 15 (App Router)
- Linguagem: TypeScript
- ORM: Prisma
- Banco de Dados: MySQL
- Estilização: Tailwind CSS 4
- Componentes: Lucide Icons, Radix UI, Sonner (Toasts)
- Segurança: CSP Headers, Rate Limiting, Criptografia Bcrypt (12 rounds)
- Infraestrutura: Docker & Docker Compose

---

## Arquitetura Multi-tenant

O sistema utiliza Hostname Routing para distinguir entre a plataforma principal e as lojas individuais:

1. Platform Root (simplify.com.br ou localhost:3000):
   - Exibe a Landing Page de vendas e o formulário de criação de novas lojas.
   - Acesso ao /dashboard do lojista (após login).
   - Acesso ao /admin global (estatísticas da plataforma).

2. Store Subdomains (nomedaloja.simplify.com.br):
   - Renderiza a vitrine específica do lojista baseado no slug extraído do host.
   - Temas, cores, produtos e banners totalmente isolados.

---

## Segurança e Performance

O sistema passou por auditoria recente para garantir a integridade dos dados:
- Session Tokens: Utilização de tokens aleatórios de 256-bit armazenados no banco de dados para gerenciar sessões.
- Rate Limiting: Proteção contra força bruta em rotas de autenticação e endpoints de API.
- Security Headers: Configuração de Content Security Policy (CSP), HSTS e X-Frame-Options.
- PWA: Suporte a Progressive Web App para experiência mobile aprimorada.

---

## Estrutura do Projeto

```plaintext
src/
├── app/
│   ├── (admin)/        # Painel global da plataforma
│   ├── (dashboard)/    # CMS do Lojista parceiro
│   ├── (storefront)/   # Vitrine de vendas (Client-side)
│   ├── api/            # Endpoints e Webhooks (Stripe, eNotas)
│   └── home/           # Landing page da plataforma (Simplify)
├── backend/
│   ├── actions/        # Server Actions (Lógica de Negócio)
│   └── lib/            # Helpers de servidor (Auth, Crypto, Prisma)
├── frontend/
│   ├── components/     # Componentes UI reutilizáveis
│   └── styles/         # Tokens e utilitários de design
└── lib/                # Utilidades compartilhadas
```

---

## Instalação e Execução

### 1. Dependências
```bash
npm install
```

### 2. Variáveis de Ambiente
Copie o template e configure seu banco de dados e chaves de API:
```bash
cp env.template .env
```

### 3. Banco de Dados
Execute as migrações para preparar o banco:
```bash
npx prisma migrate dev
```

### 4. Desenvolvimento
```bash
npm run dev
```

---

## Comandos Disponíveis

- npm run db:seed: Popula o banco com dados iniciais.
- npm run db:seed-store: Cria uma loja de teste completa.
- npm run test: Executa a suíte de testes com Vitest.
- npm run lint: Verifica padrões de codificação.

---

## Autor

Pedro Tonetti — Especialista Fullstack
Email: pedrotonetti@gmail.com
LinkedIn: linkedin.com/in/pehtonetti

---
Simplify: O próximo nível do e-commerce brasileiro.

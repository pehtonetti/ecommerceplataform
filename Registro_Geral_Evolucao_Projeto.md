# 📚 Registro Geral — Plataforma Simplify E-commerce SaaS

> **Última atualização:** 06/04/2026 | **Stack:** Next.js 15 · TypeScript · Prisma · MySQL · Tailwind CSS  
> **Repositório:** `pehtonetti/ecommerceplataform`

Este é o documento único e centralizado de histórico técnico, decisões arquiteturais, estado atual e próximos passos da plataforma **Simplify** — um SaaS de e-commerce multi-tenant.

---

## 🗂️ Índice

1. [Visão Geral do Projeto](#visao-geral)
2. [Arquitetura](#arquitetura)
3. [Banco de Dados (Prisma Schema)](#banco-de-dados)
4. [Fases de Desenvolvimento](#fases)
5. [Histórico Técnico Cronológico](#historico)
6. [Estado Atual — Módulos e Features](#estado-atual)
7. [Backlog & Próximos Passos](#backlog)

---

## 🎯 Visão Geral do Projeto {#visao-geral}

A Simplify é uma plataforma SaaS multi-tenant de e-commerce, onde cada lojista obtém:
- Uma URL única: `{slug}.simplify.com.br`
- Um dashboard completo para gerenciar produtos, pedidos, clientes, blog, banners e muito mais
- Uma vitrine pública personalizável com tema, cores e logo próprios
- Ferramentas de marketing integradas (cupons, WhatsApp, GA4, Meta Pixel)
- IA para geração de descrições e imagens (Gemini)
- API pública para integrações externas

O usuário acessa `simplify.com.br`, se registra, cria sua loja e imediatamente é redirecionado ao dashboard. A loja já está no ar em `slug.simplify.com.br`.

---

## 🏗️ Arquitetura {#arquitetura}

```
src/
├── app/
│   ├── page.tsx                  → Root page: Landing Simplify ou storefront (detecta domínio)
│   ├── home/page.tsx            → Landing Page premium da Simplify (cadastro + criação de loja)
│   ├── (auth)/                  → Login e Registro de clientes
│   │   ├── login/
│   │   └── register/
│   ├── (admin)/admin/           → Painel super-admin (20 seções)
│   │   ├── page.tsx             → Dashboard do admin
│   │   ├── categories/          → Gerenciamento de categorias
│   │   ├── products/            → Todos os produtos de todas as lojas
│   │   ├── orders/              → Todos os pedidos
│   │   ├── customers/           → Todos os usuários
│   │   ├── banners/             → Banners (admin)
│   │   ├── analytics/           → Analytics agregado
│   │   ├── inventory/           → Controle de lotes/estoque
│   │   ├── editor/              → Editor visual Puck drag-and-drop
│   │   ├── fiscal/              → Configuração fiscal (NF-e)
│   │   ├── marketing/           → Campanhas e banners de marketing
│   │   ├── payments/            → Gateways de pagamento
│   │   ├── promotions/          → Promoções diversas
│   │   ├── reports/             → Relatórios de desempenho
│   │   ├── settings/            → Configurações globais da plataforma
│   │   ├── shipping/            → Transportadoras
│   │   ├── staff/               → Gerenciamento de equipe/editores
│   │   ├── stores/              → Gerenciamento de todas as lojas
│   │   ├── support/             → Central de suporte (tickets)
│   │   └── layout/              → Gerenciamento de layout da vitrine
│   ├── (dashboard)/dashboard/   → Dashboard do lojista (merchant)
│   │   ├── page.tsx             → Home + SetupWizard + KPIs
│   │   ├── products/            → CRUD de produtos da loja
│   │   ├── orders/              → Pedidos da loja
│   │   ├── customers/           → Clientes da loja
│   │   ├── categories/          → Categorias da loja
│   │   ├── analytics/           → Analytics da loja (gráficos 6 meses)
│   │   ├── apps/                → App Store (WhatsApp, GA4, Meta Pixel)
│   │   ├── blog/                → CMS Blog completo ✅ NOVO
│   │   │   ├── page.tsx         → Listagem de posts
│   │   │   ├── new/page.tsx     → Criar novo post
│   │   │   ├── [id]/page.tsx    → Editar post existente
│   │   │   ├── BlogEditor.tsx   → Editor rico com toolbar Markdown
│   │   │   └── BlogPostActions.tsx → Ações (publicar/despublicar/deletar)
│   │   ├── banners/             → CMS Banners ✅ NOVO
│   │   │   ├── page.tsx         → Grid de banners com preview
│   │   │   ├── CreateBannerButton.tsx → Modal de criação
│   │   │   └── BannerActions.tsx → Ativar/desativar/deletar
│   │   ├── coupons/             → CMS Cupons ✅ NOVO
│   │   │   ├── page.tsx         → Tabela de cupons com stats
│   │   │   ├── CreateCouponButton.tsx → Modal de criação
│   │   │   └── CouponActions.tsx → Ativar/desativar/deletar
│   │   ├── reviews/             → Moderação de avaliações ✅ NOVO
│   │   │   ├── page.tsx         → Lista de avaliações com moderação
│   │   │   └── ReviewActions.tsx → Aprovar/ocultar/deletar
│   │   └── settings/            → Configurações da loja
│   │       ├── api/             → Gerenciamento de API Keys
│   │       ├── appearance/      → Theme Engine (cores, logo, tema)
│   │       └── plan/            → Planos e assinaturas
│   ├── (storefront)/            → Vitrine pública da loja
│   │   ├── page.tsx             → Página inicial da loja (produtos em destaque)
│   │   ├── product/[id]/        → Página de produto individual
│   │   ├── cart/                → Carrinho de compras
│   │   ├── checkout/            → Checkout Express (one-page)
│   │   ├── blog/                → Blog público ✅ ATUALIZADO (dados reais)
│   │   │   ├── page.tsx         → Listagem com post em destaque
│   │   │   └── [slug]/page.tsx  → Post individual com SEO dinâmico
│   │   ├── search/              → Busca de produtos
│   │   ├── account/             → Área do cliente
│   │   ├── orders/              → Pedidos do cliente
│   │   ├── wishlist/            → Lista de desejos
│   │   ├── compare/             → Comparação de produtos
│   │   ├── faq/                 → FAQ
│   │   ├── about/               → Sobre a loja
│   │   ├── contact/             → Formulário de contato
│   │   └── offers/              → Página de ofertas
│   └── api/
│       ├── v1/products/         → API pública com autenticação via API Key
│       ├── webhooks/            → Webhook handler (Stripe)
│       ├── banners/             → Endpoint de banners
│       ├── products/            → Endpoint de produtos
│       ├── pix/                 → Integração PIX
│       ├── config/              → Config pública da loja
│       ├── health/              → Health check
│       └── admin/               → Endpoints internos admin
├── backend/
│   ├── actions/                 → 34 Server Actions (padrão discriminated union)
│   │   ├── auth-actions.ts      → login(), logout()
│   │   ├── register-actions.ts  → register() (cliente)
│   │   ├── onboarding-actions.ts → registerAndCreateStore() ✅ NOVO
│   │   ├── blog-actions.ts      → CRUD completo de Posts ✅ NOVO
│   │   ├── banner-actions.ts    → CRUD + toggle de Banners ✅ ATUALIZADO
│   │   ├── coupon-merchant-actions.ts → CRUD de Cupons ✅ NOVO
│   │   ├── review-merchant-actions.ts → Moderação de Reviews ✅ NOVO
│   │   ├── product-actions.ts   → Produtos (lojista)
│   │   ├── order-actions.ts     → Pedidos (18KB — mais complexo)
│   │   ├── analytics-actions.ts → Analytics real (6 meses de dados)
│   │   ├── dashboard-actions.ts → KPIs do dashboard
│   │   ├── store-config-actions.ts → Configurações da loja
│   │   ├── checkout-actions.ts  → Checkout Express
│   │   ├── payment-actions.ts   → Gateways de pagamento
│   │   ├── shipping-actions.ts  → Cálculo de frete
│   │   ├── ai-actions.ts        → Gemini AI (descrições + SEO)
│   │   ├── cart-actions.ts      → Carrinho
│   │   ├── category-actions.ts  → Categorias
│   │   ├── coupon-actions.ts    → Cupons (storefront)
│   │   ├── inventory-actions.ts → Lotes de estoque
│   │   ├── loyalty-actions.ts   → Programa de fidelidade
│   │   ├── marketing-actions.ts → Campanhas
│   │   ├── merchant-actions.ts  → Configurações merchant
│   │   ├── promotion-actions.ts → Promoções
│   │   ├── review-actions.ts    → Avaliações (storefront)
│   │   ├── search-actions.ts    → Busca full-text
│   │   ├── support-actions.ts   → Tickets de suporte
│   │   ├── user-actions.ts      → Perfil do usuário
│   │   ├── wishlist-actions.ts  → Lista de desejos
│   │   ├── api-actions.ts       → Gerenciamento de API Keys
│   │   ├── fiscal-actions.ts    → Notas fiscais
│   │   ├── import-products.ts   → Importação em lote de produtos
│   │   ├── layout-actions.ts    → Layout visual (Puck)
│   │   ├── address-actions.ts   → Endereços
│   │   └── contact-actions.ts   → Formulário de contato
│   ├── lib/
│   │   └── store-context.ts     → Resolução de loja por hostname/slug/domínio
│   ├── modules/
│   │   ├── auth/                → Módulo de autenticação
│   │   └── products/            → Módulo de produtos
│   └── infrastructure/          → Infra core
├── frontend/
│   ├── components/              → Componentes UI reutilizáveis
│   │   ├── ui/                  → Button, Motion, Input, etc.
│   │   ├── Header.tsx           → Header da vitrine
│   │   ├── Footer.tsx           → Footer da vitrine
│   │   ├── StoreThemeProvider.tsx → CSS vars do tema da loja
│   │   ├── WhatsAppButton.tsx   → Botão flutuante WhatsApp
│   │   ├── CookieConsent.tsx    → Banner LGPD
│   │   └── ai/AiPersuader.tsx   → IA persuasiva no carrinho
│   ├── contexts/                → React contexts (Cart, Compare)
│   └── puck.config.tsx         → Configuração do editor visual Puck
├── lib/
│   ├── prisma.ts                → Cliente Prisma
│   ├── auth.ts                  → getCurrentUser() helper
│   ├── stripe.ts                → Cliente Stripe
│   ├── crypto.ts                → hashPassword/verifyPassword (bcrypt)
│   ├── email.ts                 → Envio de e-mails transacionais
│   └── pix.ts                   → Validação de chaves PIX
├── components/merchant/
│   └── SetupWizard.tsx          → Checklist interativo de onboarding
└── middleware.ts                 → Proteção de rotas + resolução de slug por subdomínio
```

---

## 💾 Banco de Dados (Prisma Schema) {#banco-de-dados}

**Provider:** MySQL | **ORM:** Prisma  

| Model | Descrição |
|---|---|
| `User` | Usuários (customer / merchant / admin / editor) |
| `Store` | Lojas (multi-tenant) — core do sistema |
| `Product` | Produtos com variantes (cores, capacidades), imagens, peso |
| `ProductImage` | Galeria de imagens por produto |
| `ProductView` | Views de produto para analytics |
| `Category` | Categorias por loja |
| `Order` | Pedidos com PIX, frete, cupom, fidelidade |
| `OrderItem` | Itens do pedido |
| `Cart` | Carrinhos (usuário logado ou sessão) |
| `CartItem` | Itens do carrinho |
| `Banner` | Banners da vitrine |
| `Coupon` | Cupons de desconto (percentual ou fixo) |
| `Review` | Avaliações de produtos com moderação |
| `Address` | Endereços dos usuários |
| `ApiKey` | Chaves de API por loja |
| `Subscription` | Assinaturas de planos (Free/Starter/Pro) |
| `Post` | Blog Engine — posts por loja |
| `EmailTemplate` | Templates de e-mail por loja |
| `Carrier` | Transportadoras por loja |
| `SupportTicket` | Tickets de suporte por loja |
| `BehavioralLog` | Log de comportamento de usuários |
| `LoyaltyTransaction` | Transações do programa de fidelidade |
| `WishlistItem` | Lista de desejos |
| `Invoice` | Notas fiscais vinculadas a pedidos |
| `FiscalConfig` | Configuração fiscal global |
| `InventoryBatch` | Lotes de estoque por produto |
| `StoreConfig` | ⚠️ Legado — superseded pelo model Store |

---

## 📋 Fases de Desenvolvimento {#fases}

### FASE 1 — Multi-Tenancy (Banco & Actions) ✅
- Model `Store` + `storeId` nos principais models
- `store-context.ts` e Middleware para resolução de domínio/slug
- Filtro por storeId em 100% das Actions críticas

### FASE 2 — Dashboard do Lojista ✅
- Layout `/dashboard` Premium com Branding Simplify
- Páginas CRUD isoladas por Store (produtos, pedidos, clientes)

### FASE 3 — Theme Engine ✅
- Motor de cores dinâmico (`PrimaryColor`) via Cookies/Custom Properties
- Upload de Logotipo e customização de cabeçalho

### FASE 4 — App Store & Integrações ✅
- Central de Integrações (Dashboard Apps)
- Injeção inteligente de scripts (GA4, Meta Pixel) no `StorefrontLayout`
- Botão Flutuante de WhatsApp nas vitrines

### FASE 5 — API Pública ✅
- UI de gerenciamento de API Keys no Dashboard
- Endpoint `/api/v1/products` funcional com isolamento multi-tenant
- Autenticação via Bearer Token + registro de `lastUsed`

### FASE 6 — Billing & Subscription ✅
- Página de planos (Free, Starter, Pro) com comparativo de recursos
- Schema `Plan` e `Subscription` integrados ao multi-tenant
- Estrutura Stripe Checkout pronta

### FASE 7 — Experiência do Lojista (Agilidade & IA) ✅
- AI Product Assistant: Gemini IA gerando descrições e SEO
- Setup Wizard: Checklist interativo na Home do Dashboard
- Storefront Live Preview: Editor visual em tempo real (Desktop/Mobile)
- Central de Integrações: Ativação 1-clique

### FASE 8 — Performance Extrema & Qualidade ✅
- LCP Optimization: Logotipo via `next/image` `priority`
- Checkout Express: One-Page Checkout sem fricção
- Smart Caching: `unstable_cache` para produtos e configs
- AI Image Enhancer: Botão "Magic Image" no cadastro de produtos

### FASE 9 — Blog & CMS Completo ✅ (NOVA)
- Blog Engine: Schema `Post` + Server Actions CRUD completas
- Dashboard Blog: Listagem, editor rico Markdown, publicação/rascunho
- Storefront Blog: Página dinâmica consumindo banco real, SEO automático
- Blog `[slug]/page.tsx`: Post individual com `generateMetadata` dinâmico

### FASE 10 — Módulos Dashboard Faltantes ✅ (NOVA)
- **Banners:** CRUD completo com grid visual, preview de imagem, ativar/desativar
- **Cupons:** Tabela com código, tipo (percentual/fixo), usos, validade, status
- **Reviews:** Moderação de avaliações (aprovar/ocultar/deletar) com nota média

### FASE 11 — Landing Page Simplify ✅ (NOVA)
- Nova Home em `app/page.tsx` detecta domínio (principal vs. subdomínio de loja)
- `home/page.tsx`: Landing Page premium dark com:
  - Formulário 2 passos (dados pessoais → dados da loja)
  - Verificação de slug em tempo real (disponibilidade)
  - Seletor visual de categoria (9 categorias)
  - Social proof: depoimentos, stats, planos
  - `onboarding-actions.ts`: cria usuário merchant + loja em 1 operação + auto-login

---

## 🕒 Histórico Técnico Cronológico {#historico}

### [2026-03-18 → 2026-03-19] — Wizard de Configuração
- Criação do Setup Wizard multi-step (pagamento, categorias, entrega)
- Configuração de testes unitários com Vitest
- Documentação inicial no README.md

### [2026-03-23 → 2026-03-25] — E-commerce Core + Portfólio
- Implementação do e-commerce completo com vitrine + dashboard
- Perfil do usuário com upload de foto de perfil
- Chat de suporte simulado + formulário de tickets
- Sistema de pagamento com cartão + validação em tempo real
- FAQ com 20 questões geradas
- Projeto de portfólio pessoal paralelo (React + Vite + Tailwind)

### [2026-03-25 → 2026-03-29] — Refatoração Arquitetural
- Separação clara `src/app/` (rotas) vs `src/backend/` (lógica)
- Movimentação de `lib/` para `backend/lib/`
- Criação do padrão discriminated union para Server Actions:
  ```typescript
  { success: true; data: T } | { success: false; error: string }
  ```

### [2026-04-01] — Core SaaS + Inovação
- **Fase 5** API Pública: `/api/v1/products` com API Key management
- **Fase 6** Billing: UI de planos Free/Starter/Pro
- **Fase 8** Smart Caching: `unstable_cache` para vitrine
- **Fase 9** Blog: Schema `Post` preparado
- CI Pipeline local: vitest + build validation

### [2026-04-06] — CMS Robusto + Landing Page ← SESSÃO ATUAL
- **Blog CMS completo** operacional (actions + dashboard + storefront)
- **Banners Dashboard** com grid visual e preview de imagem
- **Cupons Dashboard** com modal de criação e tabela completa
- **Reviews Dashboard** com moderação (aprovar/ocultar/deletar)
- **Landing Page Simplify** premium com cadastro + criação de loja em 2 passos
- `onboarding-actions.ts`: registro unificado (user + store + auto-login)
- `app/page.tsx`: rota raiz inteligente (detecta domínio principal vs. subdomínio)

---

## 📊 Estado Atual — Módulos e Features {#estado-atual}

| Módulo | Dashboard Lojista | Admin | Storefront | Backend |
|---|---|---|---|---|
| Produtos | ✅ CRUD | ✅ CRUD | ✅ Vitrine | ✅ Actions |
| Pedidos | ✅ | ✅ | ✅ | ✅ |
| Clientes | ✅ | ✅ | — | ✅ |
| Categorias | ✅ | ✅ | ✅ | ✅ |
| Analytics | ✅ Gráficos reais | ✅ | — | ✅ |
| **Blog** | ✅ **NOVO** | — | ✅ **ATUALIZADO** | ✅ **NOVO** |
| **Banners** | ✅ **NOVO** | ✅ | ✅ | ✅ **ATUALIZADO** |
| **Cupons** | ✅ **NOVO** | ✅ existia | ✅ | ✅ **NOVO** |
| **Reviews** | ✅ **NOVO** | — | ✅ | ✅ **NOVO** |
| App Store | ✅ | — | ✅ Injeção | ✅ |
| API Keys | ✅ | — | — | ✅ |
| Planos/Billing | ✅ UI | — | — | 🔄 Stripe parcial |
| Theme Engine | ✅ | — | ✅ | ✅ |
| Checkout | — | — | ✅ One-page | ✅ |
| Frete | — | ✅ | ✅ | ✅ |
| Estoque/Lotes | — | ✅ | — | ✅ |
| Suporte | — | ✅ | — | ✅ |
| Fiscal/NF-e | — | ✅ | — | ✅ |
| **Landing Page** | — | — | — | ✅ **NOVO** |

---

## 🔮 Backlog & Próximos Passos {#backlog}

### Alta Prioridade
1. **Stripe Flow Real** — Conectar botão "Upgrade" a `stripe.checkout.sessions.create` e implementar webhook `customer.subscription.*`
2. **Gate de Features por Plano** — Bloquear API Keys no `free`, limitar produtos, etc.
3. **API v1 Expansão** — Adicionar `/api/v1/categories` e `/api/v1/orders`

### Média Prioridade
4. **Dashboard Suporte** — Página `/dashboard/support` para ver/responder tickets
5. **Blog SEO:** Adicionar sitemap dinâmico de posts ao `sitemap.ts`
6. **Dashboard Frete** — CRUD de transportadoras no dashboard do lojista
7. **Reviews no Storefront** — Exibir avaliações aprovadas na página de produto

### Limpeza Técnica
8. Remover model `StoreConfig` do schema (rodar `prisma migrate`)
9. Executar `npx prisma generate` para sincronizar todos os novos models
10. `npm run build` para validar sem erros TypeScript

### Backlog de Inovação
- **AI Background Remover Real** — Conectar ao Remove.bg
- **Predictive Search Bar** — Auto-complete com imagens no storefront
- **Abandoned Cart Recovery** — Automação WhatsApp para carrinhos abandonados
- **Dashboard Analytics Avançado** — Explorar `BehavioralLog` para funil de conversão
- **Email Marketing** — Envio de newsletters via `EmailTemplate`
- **Multi-Currency** — Conversão dinâmica de preços

---

## ⚙️ Configuração do Ambiente

```bash
# Instalação
npm install

# Prisma
npx prisma generate
npx prisma migrate dev

# Desenvolvimento
npm run dev

# Testes
npm test

# Build produção
npm run build
```

### Variáveis de Ambiente (`.env`)
```env
DATABASE_URL="mysql://..."
PLATFORM_DOMAIN="simplify.com.br"    # Domínio principal da plataforma
NEXT_PUBLIC_APP_URL="https://simplify.com.br"
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
GEMINI_API_KEY="..."
```

---

*Documento mantido pelo agente Antigravity. Atualize após cada sessão de desenvolvimento.*

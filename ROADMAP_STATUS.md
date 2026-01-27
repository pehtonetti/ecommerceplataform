# Status do Roadmap de Desenvolvimento

Este documento rastreia o status atual do desenvolvimento da plataforma de e-commerce e lista as tarefas restantes para o lançamento da versão 1.0 (Produção).

## ✅ Concluído (Core)

### Storefront
- [x] **Home Page:** Renderização dinâmica via Puck Editor.
- [x] **Catálogo de Produtos:** Listagem, filtros e página de detalhes.
- [x] **Carrinho de Compras:** Adicionar, remover, hooks de persistência.
- [x] **Checkout:** Fluxo multi-etapa (Endereço, Revisão, Pagamento).
- [x] **Autenticação:** Login, Registro e recuperação de senha (NextAuth/Custom).
- [x] **Minha Conta:** Histórico de pedidos e endereços.

### Backend / API
- [x] **Banco de Dados:** Schema Prisma completo (Users, Products, Orders, etc.).
- [x] **Pagamentos:** Integração com Stripe (Checkout Sessions).
- [x] **Fiscal:** Integração com ENotas (Emissão de NFe via API).
- [x] **Emails:** Serviço de envio transacional (Sendgrid/Nodemailer).
- [x] **Shipping:** Cálculo de frete (Correios/Melhor Envio Mock).

### Admin Dashboard
- [x] **Analytics:** Gráficos de vendas, pedidos recentes e estoque.
- [x] **Gestão de Pedidos:** Listagem e alteração de status.
- [x] **Gestão de Produtos:** CRUD completo.

---

## ⚠️ Pendente / Ação Necessária (Pré-Launch)

### 1. Segurança Crítica 🚨
- [x] **Config API:** Protegido endpoint `/api/config/route.ts`. Agora exige autenticação e role `admin`.

### 2. Integração Fiscal
- [ ] **Configuração Fiscal:** A função `saveFiscalConfig` em `fiscal-actions.ts` é um stub.
  - *Status:* Implementar persistência ou remover se configurado via ENV.
- [ ] **Webhook ENotas:** Verificar se há endpoint para receber atualização de status da NFe (autorizada/rejeitada).

### 3. Integração de Pagamento
- [x] **Stripe Session:** Implementado.
- [x] **Webhooks Stripe:** Implementado em `src/app/api/webhooks/stripe/route.ts`, processa `checkout.session.completed`.

### 4. Testes & Validação
- [ ] **Fluxo E2E:** Realizar uma compra completa do início ao fim em ambiente de Staging.
- [ ] **Email Templates:** Verificar se os templates de email estão renderizando corretamente (Logo, cores).

### 5. Infraestrutura
- [ ] **Variáveis de Ambiente:** Garantir que todas as chaves em `env.template` estejam preenchidas no ambiente de produção.
- [ ] **Build:** Rodar `npm run build` para garantir que não há erros de tipagem bloqueantes.

---

## 🚀 Próximos Passos (Pós-Launch)

- [ ] **Wishlist Avançada:** Integração com campanhas de marketing.
- [ ] **Multi-CD:** Suporte a múltiplos centros de distribuição.
- [ ] **Marketplace:** Permitir sellers terceiros.

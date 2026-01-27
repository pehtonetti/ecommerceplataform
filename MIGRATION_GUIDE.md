# 🚀 Guia de Migração do Banco de Dados

## ⚠️ IMPORTANTE: Execute a Migração

O projeto possui features empresariais que requerem novas tabelas no banco de dados. Você precisa executar a migração para ativar todas as funcionalidades.

## 📋 O Que Será Criado

A migração `add_enterprise_features` criará as seguintes tabelas:

### Novas Tabelas
1. **WishlistItem** - Lista de desejos dos usuários
2. **Coupon** - Sistema de cupons de desconto
3. **LoyaltyTransaction** - Histórico de pontos de fidelidade
4. **ProductView** - Tracking de visualizações de produtos

### Campos Adicionados
- **User**: `loyaltyPoints` (Int)
- **Order**: `couponId`, `discountAmount`, `loyaltyPointsEarned`, `loyaltyPointsUsed`
- **Product**: Relações para wishlist e views

## 🔧 Como Executar a Migração

### Opção 1: Comando Direto (Recomendado)

```bash
npx prisma migrate dev --name add_enterprise_features
```

### Opção 2: Se houver erro de execução no PowerShell

1. Abra o PowerShell como Administrador
2. Execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
3. Depois execute a migração:
```powershell
npx prisma migrate dev --name add_enterprise_features
```

### Opção 3: Usando Command Prompt

```cmd
npx prisma migrate dev --name add_enterprise_features
```

## ✅ Verificar se Funcionou

Após executar a migração, você deve ver:

```
✔ Generated Prisma Client
✔ The migration has been created successfully
✔ Database schema updated
```

## 🔄 Regenerar Prisma Client

Depois da migração, regenere o Prisma Client:

```bash
npx prisma generate
```

## 🎯 Features que Serão Ativadas

Após a migração, as seguintes features estarão 100% funcionais:

### ✅ Wishlist (Lista de Desejos)
- Adicionar/remover produtos
- Ver lista completa
- Mover para carrinho

### ✅ Sistema de Cupons
- Criar cupons (admin)
- Validar cupons
- Aplicar descontos
- Tracking de uso

### ✅ Programa de Fidelidade
- Ganhar pontos por compra
- Resgatar pontos
- Histórico de transações
- Admin: conceder bônus

### ✅ Analytics Avançado
- Tracking de visualizações
- Produtos mais vistos
- Métricas de engajamento
- Dashboard completo

### ✅ Home Page Completa
- Seção "Vistos Recentemente" (com dados reais)
- Seção "Mais Vendidos"
- Seção "Promoções abaixo de R$ 100"
- Todas as features visuais

## 🐛 Troubleshooting

### Erro: "Environment is non-interactive"
**Solução:** Execute em um terminal interativo (Command Prompt ou PowerShell normal, não integrado do VS Code)

### Erro: "Migration already exists"
**Solução:** A migração já foi criada. Execute apenas:
```bash
npx prisma migrate deploy
```

### Erro: "Database connection failed"
**Solução:** Verifique se o MySQL está rodando e o `.env` está configurado corretamente

### Erro: "Permission denied"
**Solução:** Execute o terminal como Administrador

## 📊 Estado Atual do Projeto

### Sem Migração (Atual)
- ✅ E-commerce básico funciona
- ✅ Catálogo, carrinho, checkout
- ✅ Pagamentos
- ⚠️ Features empresariais com fallback
- ⚠️ Home page usa dados alternativos

### Com Migração (Completo)
- ✅ Tudo acima +
- ✅ Wishlist 100% funcional
- ✅ Cupons 100% funcional
- ✅ Fidelidade 100% funcional
- ✅ Analytics 100% funcional
- ✅ Home page com dados reais

## 🎉 Após a Migração

1. Reinicie o servidor de desenvolvimento:
```bash
# Pare o servidor (Ctrl+C)
npm run dev
```

2. Acesse http://localhost:3000

3. Teste as novas features:
   - Adicione produtos à wishlist
   - Crie um cupom no admin
   - Faça uma compra e ganhe pontos
   - Veja o analytics dashboard

## 📝 Backup (Opcional mas Recomendado)

Antes de executar a migração, faça backup do banco:

```bash
# MySQL
mysqldump -u root -p ecommerce > backup_antes_migracao.sql
```

Para restaurar (se necessário):
```bash
mysql -u root -p ecommerce < backup_antes_migracao.sql
```

## 🆘 Precisa de Ajuda?

Se encontrar problemas:

1. Verifique os logs do erro
2. Confirme que o MySQL está rodando
3. Verifique o arquivo `.env`
4. Tente executar `npx prisma studio` para ver o banco

## ✅ Checklist Pós-Migração

- [ ] Migração executada com sucesso
- [ ] Prisma Client regenerado
- [ ] Servidor reiniciado
- [ ] Home page carrega sem erros
- [ ] Wishlist funciona
- [ ] Cupons funcionam
- [ ] Pontos de fidelidade funcionam
- [ ] Analytics mostra dados

---

**Status Atual:** ⚠️ Migração Pendente  
**Próximo Passo:** Execute `npx prisma migrate dev --name add_enterprise_features`  
**Tempo Estimado:** 1-2 minutos

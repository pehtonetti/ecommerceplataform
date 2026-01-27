# 🚀 Guia de Deploy: E-commerce Platform

Este guia explica como colocar sua plataforma online de forma profissional e escalável.

## 1. Cloud Hosting (Onde hospedar)

### Opção A: Vercel (Recomendado para o Frontend/Next.js)
A Vercel é a criadora do Next.js e oferece a melhor performance e integração.
- **Vantagem:** Deploy automático via GitHub, SSL grátis, CDN global.
- **Custo:** Grátis para projetos pessoais (Hobby).

### Opção B: Railway.app (Recomendado para o Banco de Dados + App)
O Railway permite subir tanto o Next.js quanto o banco de dados MySQL em um só lugar.
- **Vantagem:** Muito simples de configurar o banco de dados.

---

## 2. Passo a Passo (Vercel + Managed Database)

### Passo 1: Preparar o Banco de Dados
Como a Vercel não hospeda bancos de dados relacionais (MySQL), você precisa de um provedor externo:
1. Crie uma conta no **Railway.app** ou **TIDB Cloud**.
2. Crie uma nova instância **MySQL**.
3. Copie a `DATABASE_URL` (algo como `mysql://user:password@host:port/dbname`).

### Passo 2: Subir o Código no GitHub
1. Crie um repositório privado no GitHub.
2. Faça o push do seu código:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin sua-url-do-github
   git push -u origin main
   ```

### Passo 3: Deploy na Vercel
1. Acesse [vercel.com](https://vercel.com) e importe seu repositório do GitHub.
2. Adicione as **Environment Variables**:
   - `DATABASE_URL`: A URL que você copiou do banco de dados.
   - `NEXT_PUBLIC_APP_URL`: A URL final do seu site (ex: `https://minha-loja.vercel.app`).
3. Clique em **Deploy**.

### Passo 4: Sincronizar o Banco
No seu terminal local, rode o comando para criar as tabelas no banco de produção (ajuste o `.env` temporariamente se necessário, ou use o CLI da Vercel):
```bash
npx prisma db push
```

---

## 3. Checklist de Produção

- [ ] **SSL (HTTPS):** Ativado automaticamente pela Vercel.
- [ ] **SEO:** Verifique o `sitemap.xml` e `robots.txt` criados.
- [ ] **Images:** Configure o `next.config.js` para aceitar domínios de imagens externas se necessário.
- [ ] **Emails:** Configure um serviço como SendGrid ou Resend para os e-mails de confirmação de pedido.

---

## 4. Domínio Personalizado
Na Vercel:
1. Vá em **Settings > Domains**.
2. Adicione seu domínio (ex: `sualoja.com.br`).
3. Siga as instruções de DNS (configurar tipo A ou CNAME no seu provedor de domínio).

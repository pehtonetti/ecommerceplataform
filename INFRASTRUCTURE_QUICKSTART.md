# Guia Rápido - Infraestrutura e Microserviços

## 🚀 Início Rápido

### Pré-requisitos

- Docker Desktop instalado
- Docker Compose instalado
- Node.js 20+ (para desenvolvimento local)
- Git

### Passo 1: Configurar Variáveis de Ambiente

```bash
# Copiar template de ambiente
cp env.template .env

# Editar .env com suas configurações
# IMPORTANTE: Alterar senhas e secrets!
```

### Passo 2: Iniciar Infraestrutura

```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

### Passo 3: Executar Migrações

```bash
# Executar migrações do banco de dados
docker-compose exec app npx prisma migrate deploy

# Ou localmente (se preferir)
npx prisma migrate dev --name add_enterprise_features
```

### Passo 4: Verificar Serviços

Acesse os seguintes URLs:

- **Aplicação Principal:** http://localhost:3000
- **Analytics API:** http://localhost:3001/health
- **RabbitMQ Management:** http://localhost:15672 (user: admin, pass: definido em .env)
- **Prometheus:** http://localhost:9090
- **Grafana:** http://localhost:3002 (user: admin, pass: definido em .env)
- **Health Check:** http://localhost/health

## 📦 Estrutura de Serviços

### Portas Utilizadas

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Nginx | 80, 443 | API Gateway |
| Main App | 3000 | Aplicação Next.js |
| Analytics | 3001 | Microserviço de Analytics |
| Grafana | 3002 | Dashboard de Métricas |
| MySQL | 3306 | Banco de Dados |
| Redis | 6379 | Cache |
| RabbitMQ | 5672 | Message Queue |
| RabbitMQ UI | 15672 | Interface de Gerenciamento |
| Prometheus | 9090 | Coleta de Métricas |

## 🔧 Comandos Úteis

### Docker Compose

```bash
# Iniciar serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Rebuild e restart
docker-compose up -d --build

# Ver logs de um serviço específico
docker-compose logs -f app

# Escalar aplicação
docker-compose up -d --scale app=3

# Executar comando em container
docker-compose exec app sh

# Limpar volumes (CUIDADO: apaga dados)
docker-compose down -v
```

### Gerenciamento de Serviços

```bash
# Restart de um serviço específico
docker-compose restart app

# Parar um serviço
docker-compose stop app

# Iniciar um serviço parado
docker-compose start app

# Ver uso de recursos
docker stats
```

## 🧪 Testando os Microserviços

### Email Service

```bash
# Ver logs do email service
docker-compose logs -f email-service

# Testar enviando email via RabbitMQ
# (Use a função queueOrderConfirmation no código)
```

### Analytics Service

```bash
# Testar endpoint de dashboard
curl http://localhost:3001/dashboard

# Testar endpoint de produtos top
curl http://localhost:3001/products/top?limit=5

# Testar com cache
curl -i http://localhost:3001/dashboard
# Verificar header X-Cache
```

### Redis Cache

```bash
# Conectar ao Redis
docker-compose exec redis redis-cli

# Comandos úteis no Redis CLI
PING                    # Testar conexão
KEYS *                  # Ver todas as chaves
GET cache:key           # Ver valor de uma chave
FLUSHALL                # Limpar todo cache (CUIDADO!)
INFO                    # Informações do servidor
```

### RabbitMQ

```bash
# Ver filas
docker-compose exec rabbitmq rabbitmqctl list_queues

# Ver conexões
docker-compose exec rabbitmq rabbitmqctl list_connections

# Purgar fila (limpar mensagens)
docker-compose exec rabbitmq rabbitmqctl purge_queue email_queue
```

## 🔍 Monitoramento

### Prometheus Queries

Acesse http://localhost:9090 e execute:

```promql
# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# Response time (p95)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Memory usage
process_resident_memory_bytes
```

### Grafana Dashboards

1. Acesse http://localhost:3002
2. Login: admin / (senha do .env)
3. Adicione Prometheus como datasource
4. Importe dashboards pré-configurados

## 🐛 Troubleshooting

### Problema: Serviço não inicia

```bash
# Ver logs detalhados
docker-compose logs [service-name]

# Verificar se porta está em uso
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac

# Rebuild do container
docker-compose up -d --build [service-name]
```

### Problema: Banco de dados não conecta

```bash
# Verificar se MySQL está rodando
docker-compose ps mysql

# Ver logs do MySQL
docker-compose logs mysql

# Conectar ao MySQL
docker-compose exec mysql mysql -u root -p

# Verificar variável de ambiente
docker-compose exec app env | grep DATABASE_URL
```

### Problema: Cache não funciona

```bash
# Verificar se Redis está rodando
docker-compose ps redis

# Testar conexão
docker-compose exec redis redis-cli ping

# Ver logs
docker-compose logs redis
```

### Problema: Emails não enviam

```bash
# Verificar logs do email service
docker-compose logs email-service

# Verificar RabbitMQ
docker-compose exec rabbitmq rabbitmqctl list_queues

# Ver mensagens na fila
# Acesse http://localhost:15672
```

## 📊 Desenvolvimento Local

### Opção 1: Tudo no Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Desenvolver com hot reload
docker-compose logs -f app
```

### Opção 2: App local + Infraestrutura no Docker

```bash
# Iniciar apenas infraestrutura
docker-compose up -d mysql redis rabbitmq

# Rodar app localmente
npm run dev
```

## 🔐 Segurança

### Alterar Senhas Padrão

Edite `.env` e altere:
- MYSQL_ROOT_PASSWORD
- MYSQL_PASSWORD
- REDIS_PASSWORD
- RABBITMQ_PASS
- GRAFANA_PASSWORD
- NEXTAUTH_SECRET

### Gerar Secret Seguro

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32
```

## 📈 Performance

### Otimizações Implementadas

1. **Redis Cache** - 5-10 min TTL para dados agregados
2. **Nginx Gzip** - Compressão de respostas
3. **Connection Pooling** - Prisma + MySQL
4. **Async Processing** - RabbitMQ para emails
5. **CDN Ready** - Static files otimizados

### Métricas de Performance

- Response time < 200ms (cached)
- Response time < 1s (uncached)
- Database queries < 100ms
- Cache hit rate > 80%

## 🚢 Deploy para Produção

### Pré-requisitos

1. Servidor com Docker instalado
2. Domínio configurado
3. Certificado SSL (Let's Encrypt)
4. Variáveis de ambiente configuradas

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/your-org/ecommerce-platform.git
cd ecommerce-platform

# 2. Configure variáveis de ambiente
cp env.template .env
nano .env

# 3. Gere certificados SSL
# (Use certbot ou configure manualmente)

# 4. Inicie os serviços
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 5. Execute migrações
docker-compose exec app npx prisma migrate deploy

# 6. Verifique health
curl https://yourdomain.com/health
```

## 📝 Logs

### Ver Logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f app

# Últimas 100 linhas
docker-compose logs --tail=100 app

# Desde timestamp
docker-compose logs --since 2025-12-10T12:00:00 app
```

### Exportar Logs

```bash
# Salvar em arquivo
docker-compose logs app > app.log

# Com timestamp
docker-compose logs -t app > app.log
```

## 🎯 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Senhas alteradas
- [ ] SSL configurado
- [ ] Backup configurado
- [ ] Monitoring ativo
- [ ] Health checks funcionando
- [ ] Logs sendo coletados
- [ ] Rate limiting configurado
- [ ] Firewall configurado
- [ ] DNS configurado

## 📚 Próximos Passos

1. Configure backup automatizado
2. Setup alertas no Grafana
3. Configure CDN (CloudFlare)
4. Implemente APM (New Relic/DataDog)
5. Configure disaster recovery
6. Implemente blue-green deployment

---

**Precisa de ajuda?** Consulte `INFRASTRUCTURE.md` para documentação completa.

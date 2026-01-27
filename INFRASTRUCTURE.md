# Arquitetura de Microserviços e Infraestrutura

## 📋 Visão Geral

Esta plataforma de e-commerce foi construída com uma arquitetura moderna de microserviços, containerização Docker, e infraestrutura escalável.

## 🏗️ Arquitetura

### Componentes Principais

```
┌─────────────────────────────────────────────────────────────┐
│                      Nginx API Gateway                       │
│                    (Load Balancer + SSL)                     │
└────────────┬────────────────────────────────┬───────────────┘
             │                                 │
    ┌────────▼────────┐              ┌────────▼────────────┐
    │   Main App      │              │  Analytics Service  │
    │   (Next.js)     │              │   (Express + TS)    │
    │   Port: 3000    │              │   Port: 3001        │
    └────────┬────────┘              └─────────┬───────────┘
             │                                  │
    ┌────────▼──────────────────────────────────▼───────────┐
    │                    MySQL Database                      │
    │                      Port: 3306                        │
    └────────────────────────────────────────────────────────┘
             │
    ┌────────▼────────┐              ┌────────────────────┐
    │  Redis Cache    │              │   RabbitMQ Queue   │
    │  Port: 6379     │              │   Port: 5672       │
    └─────────────────┘              └─────────┬──────────┘
                                               │
                                      ┌────────▼────────┐
                                      │  Email Service  │
                                      │  (Node.js + TS) │
                                      └─────────────────┘
```

### Monitoramento

```
┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
│   Prometheus    │────▶│   Grafana    │     │  Logs/Alerts │
│   Port: 9090    │     │  Port: 3002  │     │              │
└─────────────────┘     └──────────────┘     └──────────────┘
```

## 🐳 Docker & Containerização

### Serviços Containerizados

1. **Main Application** - Aplicação Next.js principal
2. **MySQL** - Banco de dados relacional
3. **Redis** - Cache em memória
4. **RabbitMQ** - Fila de mensagens
5. **Email Service** - Microserviço de email
6. **Analytics Service** - Microserviço de analytics
7. **Nginx** - API Gateway e Load Balancer
8. **Prometheus** - Coleta de métricas
9. **Grafana** - Visualização de métricas

### Comandos Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f [service-name]

# Parar todos os serviços
docker-compose down

# Rebuild e restart
docker-compose up -d --build

# Escalar serviços
docker-compose up -d --scale app=3
```

## 🔧 Microserviços

### 1. Email Service

**Responsabilidade:** Processamento assíncrono de emails

**Tecnologias:**
- Node.js + TypeScript
- RabbitMQ (consumer)
- Nodemailer

**Funcionalidades:**
- Confirmação de pedido
- Atualização de envio
- Reset de senha
- Email de boas-vindas
- Alertas de estoque baixo

**Endpoint:** Não exposto (consumer interno)

### 2. Analytics Service

**Responsabilidade:** Processamento e cache de analytics

**Tecnologias:**
- Express + TypeScript
- Redis (cache)
- Prisma (database)

**Endpoints:**
- `GET /dashboard` - Estatísticas gerais
- `GET /sales/chart` - Dados de vendas para gráficos
- `GET /products/top` - Produtos mais vendidos
- `GET /products/views` - Produtos mais visualizados
- `GET /realtime` - Métricas em tempo real
- `GET /health` - Health check

**Cache:** 5-10 minutos para dados agregados

## 🌐 API Gateway (Nginx)

### Funcionalidades

1. **Load Balancing** - Distribuição de carga
2. **SSL/TLS Termination** - Gerenciamento de certificados
3. **Rate Limiting** - Proteção contra abuso
4. **Compression** - Gzip para respostas
5. **Security Headers** - Headers de segurança
6. **Routing** - Roteamento para microserviços

### Rate Limits

- API geral: 10 req/s por IP
- Autenticação: 5 req/min por IP

### Rotas

```nginx
/                    → Main App (Next.js)
/api/                → Main App API
/api/analytics/      → Analytics Service
/health              → Health check
```

## 💾 Cache Strategy (Redis)

### Dados Cacheados

1. **Dashboard Stats** - TTL: 5 minutos
2. **Sales Charts** - TTL: 10 minutos
3. **Top Products** - TTL: 10 minutos
4. **Product Views** - TTL: 10 minutos
5. **User Sessions** - TTL: 24 horas

### Invalidação

- Automática por TTL
- Manual via `invalidateCache(pattern)`
- Após mutações (criar pedido, atualizar produto)

## 📨 Message Queue (RabbitMQ)

### Filas

1. **email_queue** - Processamento de emails
2. **analytics_queue** - Eventos de analytics (futuro)
3. **notifications_queue** - Notificações push (futuro)

### Padrão

- **Producer:** Main App
- **Consumer:** Email Service
- **Durabilidade:** Mensagens persistentes
- **Retry:** Requeue em caso de falha

## 📊 Monitoring & Observability

### Prometheus

**Métricas Coletadas:**
- Request rate
- Response time
- Error rate
- CPU/Memory usage
- Database connections
- Cache hit/miss ratio

### Grafana

**Dashboards:**
- Application Performance
- Database Metrics
- Cache Performance
- Business Metrics (vendas, usuários)

**Acesso:** http://localhost:3002
- User: admin
- Password: (definido em .env)

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

1. **Test Stage**
   - Lint code
   - Type checking
   - Run tests
   - Database migrations

2. **Build Stage**
   - Build Docker images
   - Push to registry
   - Tag with version

3. **Security Stage**
   - Vulnerability scanning (Trivy)
   - Dependency audit
   - SARIF upload

4. **Deploy Stage**
   - SSH to production
   - Pull latest images
   - Run migrations
   - Health check

### Triggers

- Push to `main` → Deploy to production
- Push to `develop` → Deploy to staging
- Pull Request → Run tests only

## 🔐 Segurança

### Implementações

1. **SSL/TLS** - Certificados via Let's Encrypt
2. **Rate Limiting** - Proteção DDoS
3. **Security Headers** - XSS, CSRF, etc.
4. **Secrets Management** - Environment variables
5. **Container Security** - Non-root users
6. **Vulnerability Scanning** - Trivy + npm audit

### Headers de Segurança

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer-when-downgrade
Content-Security-Policy: default-src 'self'
```

## 📈 Escalabilidade

### Horizontal Scaling

**Docker Compose:**
```bash
docker-compose up -d --scale app=5
```

**Kubernetes:**
- HPA (Horizontal Pod Autoscaler)
- Min: 2 replicas
- Max: 10 replicas
- Target CPU: 70%
- Target Memory: 80%

### Vertical Scaling

**Resource Limits:**
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

## 🗄️ Backup & Recovery

### Database Backup

```bash
# Backup manual
docker-compose exec mysql mysqldump -u root -p ecommerce > backup.sql

# Restore
docker-compose exec -T mysql mysql -u root -p ecommerce < backup.sql
```

### Automated Backups

- Cron job diário às 2AM
- Retenção: 30 dias
- Storage: AWS S3 / Azure Blob

## 🌍 Deployment

### Ambientes

1. **Development** - Local (Docker Compose)
2. **Staging** - Cloud (Docker Compose / K8s)
3. **Production** - Cloud (Kubernetes)

### Providers Suportados

- AWS (ECS, EKS, RDS, ElastiCache)
- Azure (AKS, Azure Database, Redis Cache)
- Google Cloud (GKE, Cloud SQL, Memorystore)
- DigitalOcean (Kubernetes, Managed Database)

## 📝 Logs

### Estrutura

```json
{
  "timestamp": "2025-12-10T12:00:00Z",
  "level": "info",
  "service": "email-service",
  "message": "Email sent successfully",
  "metadata": {
    "type": "orderConfirmation",
    "to": "user@example.com"
  }
}
```

### Agregação

- Winston (aplicação)
- Docker logs
- Prometheus + Grafana
- ELK Stack (opcional)

## 🔄 Health Checks

### Endpoints

- Main App: `GET /api/health`
- Analytics: `GET /health`
- Nginx: `GET /health`

### Verificações

- Database connectivity
- Redis connectivity
- Memory usage
- Uptime
- Version info

## 🛠️ Troubleshooting

### Problemas Comuns

**1. Container não inicia**
```bash
docker-compose logs [service-name]
docker-compose ps
```

**2. Banco de dados não conecta**
```bash
# Verificar se MySQL está rodando
docker-compose ps mysql

# Verificar logs
docker-compose logs mysql
```

**3. Redis não conecta**
```bash
# Testar conexão
docker-compose exec redis redis-cli ping
```

**4. Email não envia**
```bash
# Verificar logs do serviço
docker-compose logs email-service

# Verificar RabbitMQ
docker-compose exec rabbitmq rabbitmq-diagnostics ping
```

## 📚 Recursos Adicionais

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [Prometheus Documentation](https://prometheus.io/docs/)

## 🎯 Próximos Passos

1. ✅ Implementar microserviços
2. ✅ Configurar Docker Compose
3. ✅ Setup CI/CD pipeline
4. ✅ Configurar monitoring
5. 🔲 Implementar Kubernetes
6. 🔲 Setup CDN (CloudFlare/CloudFront)
7. 🔲 Implementar backup automatizado
8. 🔲 Setup disaster recovery
9. 🔲 Implementar blue-green deployment
10. 🔲 Setup APM (Application Performance Monitoring)

---

**Versão:** 1.0.0  
**Última Atualização:** 2025-12-10

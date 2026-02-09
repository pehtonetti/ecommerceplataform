-- ============================================
-- Script de Configuração PIX
-- ============================================
-- Execute este script para configurar o pagamento PIX na sua loja

-- 1. Atualizar configuração da loja com chave PIX
-- IMPORTANTE: Substitua os valores abaixo pelos seus dados reais

UPDATE StoreConfig 
SET 
    pixKey = 'SUA_CHAVE_PIX_AQUI',  -- Sua chave PIX (CPF, CNPJ, email, telefone ou aleatória)
    merchantCity = 'Sao Paulo'       -- Cidade do seu estabelecimento
WHERE id = (SELECT id FROM (SELECT id FROM StoreConfig LIMIT 1) AS temp);

-- ============================================
-- Exemplos de Configuração
-- ============================================

-- Exemplo 1: Usando CPF como chave PIX
-- UPDATE StoreConfig 
-- SET 
--     pixKey = '12345678901',
--     merchantCity = 'Sao Paulo'
-- WHERE id = (SELECT id FROM (SELECT id FROM StoreConfig LIMIT 1) AS temp);

-- Exemplo 2: Usando CNPJ como chave PIX
-- UPDATE StoreConfig 
-- SET 
--     pixKey = '12345678000190',
--     merchantCity = 'Rio de Janeiro'
-- WHERE id = (SELECT id FROM (SELECT id FROM StoreConfig LIMIT 1) AS temp);

-- Exemplo 3: Usando Email como chave PIX
-- UPDATE StoreConfig 
-- SET 
--     pixKey = 'pagamentos@minhaloja.com.br',
--     merchantCity = 'Belo Horizonte'
-- WHERE id = (SELECT id FROM (SELECT id FROM StoreConfig LIMIT 1) AS temp);

-- Exemplo 4: Usando Telefone como chave PIX
-- UPDATE StoreConfig 
-- SET 
--     pixKey = '+5511999999999',
--     merchantCity = 'Curitiba'
-- WHERE id = (SELECT id FROM (SELECT id FROM StoreConfig LIMIT 1) AS temp);

-- Exemplo 5: Usando Chave Aleatória (UUID)
-- UPDATE StoreConfig 
-- SET 
--     pixKey = '123e4567-e89b-12d3-a456-426614174000',
--     merchantCity = 'Porto Alegre'
-- WHERE id = (SELECT id FROM (SELECT id FROM StoreConfig LIMIT 1) AS temp);

-- ============================================
-- Verificar Configuração
-- ============================================

-- Execute esta query para verificar se a configuração foi aplicada
SELECT 
    storeName,
    pixKey,
    merchantCity,
    originZipCode,
    whatsappNumber
FROM StoreConfig
LIMIT 1;

-- ============================================
-- Criar Configuração Inicial (se não existir)
-- ============================================

-- Se a tabela StoreConfig estiver vazia, execute este INSERT primeiro:
-- INSERT INTO StoreConfig (id, storeName, pixKey, merchantCity, originZipCode, createdAt, updatedAt)
-- VALUES (
--     UUID(),
--     'Minha Loja',
--     'SUA_CHAVE_PIX',
--     'Sao Paulo',
--     '01310-100',
--     NOW(),
--     NOW()
-- );

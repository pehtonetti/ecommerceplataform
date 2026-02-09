-- ============================================
-- Configuração Inicial da Loja - Simplify
-- ============================================

-- Atualizar ou criar configuração da loja
UPDATE StoreConfig 
SET 
    storeName = 'Simplify - Loja Online',
    pixKey = 'pedrotonetti@gmail.com',
    merchantCity = 'Bauru',
    originZipCode = '17000-000',
    whatsappNumber = '+5514996861719',
    whatsappMessage = 'Olá! Gostaria de saber sobre meu pedido',
    updatedAt = NOW()
WHERE id = (SELECT id FROM (SELECT id FROM StoreConfig LIMIT 1) AS temp);

-- Se não existir nenhuma configuração, criar uma nova
INSERT INTO StoreConfig (
    id, 
    storeName, 
    pixKey, 
    merchantCity, 
    originZipCode, 
    whatsappNumber, 
    whatsappMessage,
    createdAt, 
    updatedAt
)
SELECT 
    UUID(),
    'Simplify - Loja Online',
    'pedrotonetti@gmail.com',
    'Bauru',
    '17000-000',
    '+5514996861719',
    'É só enviar um "Oi", que a gente te ajuda! <3',
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM StoreConfig LIMIT 1);

-- Verificar configuração
SELECT 
    storeName AS 'Nome da Loja',
    pixKey AS 'Chave PIX',
    merchantCity AS 'Cidade',
    originZipCode AS 'CEP',
    whatsappNumber AS 'WhatsApp',
    whatsappMessage AS 'Mensagem WhatsApp'
FROM StoreConfig
LIMIT 1;

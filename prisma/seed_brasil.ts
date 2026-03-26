import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
    console.log('--- INICIANDO IMPORTAÇÃO FIEL: 100 PRODUTOS BR ---');

    // Mapeamento de Categorias Oficiais (Removido 'Eletronicos')
    const categoriesData = [
        { name: 'Smartphones', slug: 'smartphones' },
        { name: 'Notebooks', slug: 'notebooks' },
        { name: 'Televisores', slug: 'televisores' },
        { name: 'Eletrodomésticos', slug: 'eletrodomesticos' },
        { name: 'Áudio & Fones', slug: 'audio' },
        { name: 'Games & Consoles', slug: 'games' },
        { name: 'Informática', slug: 'informatica' },
        { name: 'Acessórios Tech', slug: 'acessorios' },
    ];

    for (const cat of categoriesData) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: { name: cat.name, slug: cat.slug },
        });
    }

    const products = [
        // --- SMARTPHONES (20 itens com specs e fotos reais) ---
        { name: 'iPhone 15 Pro Max 256GB - Titânio Natural', price: 899900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800', desc: 'Processador A17 Pro, Câmera Tripla de 48MP, Tela Super Retina XDR 6.7", Titânio Natural. Produto Original Apple.' },
        { name: 'Samsung Galaxy S24 Ultra 512GB - Titânio Gray', price: 749900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1707137819873-199b53177990?q=80&w=800', desc: 'Galaxy AI Integrado, Zoom de 100x, Caneta S Pen, Snapdragon 8 Gen 3 for Galaxy, Tela 6.8" 120Hz.' },
        { name: 'iPhone 15 128GB - Preto', price: 479900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800', desc: 'Dynamic Island, Chip A16 Bionic, Câmera de 48MP, USB-C, Tela Super Retina XDR 6.1".' },
        { name: 'Xiaomi Redmi Note 13 Pro+ 5G 512GB - Black', price: 289900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800', desc: 'Câmera 200MP OIS, Carregamento 120W HyperCharge, Tela AMOLED 1.5K Curva, IP68.' },
        { name: 'iPhone 13 128GB - Meia-Noite', price: 349900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=800', desc: 'Dual SIM, 5G, Chip A15 Bionic, Câmera dupla 12MP, Tela OLED 6.1" impecável.' },
        { name: 'Galaxy Z Flip 5 256GB - Grafite', price: 399900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?q=80&w=800', desc: 'O dobrável mais desejado. Tela externa de 3.4", IPX8, Snapdragon 8 Gen 2, Design Compacto.' },
        { name: 'Xiaomi POCO X6 Pro 5G 512GB - Yellow', price: 259900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=800', desc: 'Monstro de performance. Dimensity 8300-Ultra, 12GB RAM, Tela Flow AMOLED 120Hz Pro.' },
        { name: 'Motorola Edge 50 Pro 256GB - Black Beauty', price: 319900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?q=80&w=800', desc: 'Pantone Unfold, Carregamento 125W TurboPower, Tela pOLED 6.7" 144Hz, IA Moto.' },
        { name: 'Realme 12 Pro+ 512GB - Submarine Blue', price: 299900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800', desc: 'Câmera Periscópica de Retrato, Design Premium em Couro Vegano, Snap 7s Gen 2.' },
        { name: 'iPhone 15 Plus 128GB - Azul', price: 549900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800', desc: 'A maior bateria da categoria. Tela 6.7", Dynamic Island, USB-C, Rosa Pastel.' },
        { name: 'Zenfone 10 256GB - Midnight Black', price: 429900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?q=80&w=800', desc: 'O melhor compacto Android. Tela 5.9", Snapdragon 8 Gen 2, Estabilização Gimbal 6 eixos.' },
        { name: 'Galaxy A55 5G 128GB - Violeta', price: 189900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800', desc: 'O rei do custo-benefício Samsung. Câmera Nightography, Metal e Vidro, IP67.' },
        { name: 'Xiaomi Redmi 13C 128GB - Negro', price: 89900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800', desc: 'Acessível e eficiente. Tela de 90Hz fluida, bateria de 5000mAh e design moderno.' },
        { name: 'iPhone 14 128GB - Estelar', price: 389900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1673332786311-665cd0fa8994?q=80&w=800', desc: 'Sistema de câmera dupla, Modo Ação para vídeos estáveis, Detecção de Acidente.' },
        { name: 'Galaxy S23 FE 128GB - Creme', price: 239900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800', desc: 'Fan Edition com câmeras profissionais e desempenho para jogos pesados.' },
        { name: 'Nothing Phone (2) 256GB - White', price: 459900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?q=80&w=800', desc: 'Interface Glyph minimalista, Design Transparente, Snapdragon 8+ Gen 1.' },
        { name: 'Google Pixel 8 Pro 128GB - Obsidian', price: 549900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?q=80&w=800', desc: 'A melhor câmera em um Android do mundo. IA do Google integrada em cada função.' },
        { name: 'ASUS ROG Phone 8 256GB - Black', price: 699900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=800', desc: 'Desenvolvido para entusiastas. Gatilhos AirTrigger, 16GB RAM, Resfriamento GameCool.' },
        { name: 'Realme C67 256GB - Sunny Oasis', price: 119900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800', desc: 'Design ultrafino, Câmera de 108MP e NFC para pagamentos por aproximação.' },
        { name: 'Samsung Galaxy A15 5G 128GB', price: 99900, cat: 'Smartphones', img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800', desc: 'Conectividade 5G ao melhor preço, Tela Super AMOLED vibrante.' },

        // --- NOTEBOOKS (15 itens) ---
        { name: 'MacBook Air M2 13" 8GB/256GB - Cinza Espacial', price: 829900, cat: 'Notebooks', img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800', desc: 'Design silêncioso sem ventoinha, Bateria para até 18 horas, MagSafe 3, Chip M2.' },
        { name: 'MacBook Pro M3 Pro 14" 18GB/512GB - Space Black', price: 1699900, cat: 'Notebooks', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800', desc: 'Poder absoluto para profissionais de vídeo e código. Tela Liquid Retina XDR de 120Hz.' },
        { name: 'Dell Inspiron 15 Core i5 12a Ger 8GB/512GB', price: 329900, cat: 'Notebooks', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800', desc: 'O clássico para home office. Teclado retroiluminado, Windows 11 Original, Prata.' },
        { name: 'Acer Nitro 5 RTX 3050 Core i5-11400H 8GB', price: 419900, cat: 'Notebooks', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800', desc: 'O notebook gamer preferido do Brasil. Placa dedicada NVIDIA, Teclado RGB, Tela 144Hz.' },
        { name: 'Lenovo Ideapad 1 R3-7320U 8GB/256GB', price: 219900, cat: 'Notebooks', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800', desc: 'Ideal para estudos. Processador AMD Ryzen 7000 Series, Carregamento Rápido.' },
        { name: 'MacBook Air M1 13" 8GB/256GB - Prateado', price: 499900, cat: 'Notebooks', img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800', desc: 'A revolução M1 que uniu performance épica e autonomia de bateria no dia todo.' },
        { name: 'HP Victus RTX 3050 Core i5-12450H 16GB RAM', price: 459900, cat: 'Notebooks', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800', desc: 'Gamer de alto nível com design elegante em preto metálico. Perfeito para edição 4K.' },
        { name: 'Asus Vivobook 15 Core i5 12a Ger 8GB/512GB', price: 269900, cat: 'Notebooks', img: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800', desc: 'Ultrafino de apenas 1.7kg, Tampa em metal, Dobradiça 180º e Tela NanoEdge Full HD.' },
        { name: 'Samsung Galaxy Book3 Core i7 13a Ger 512GB', price: 499900, cat: 'Notebooks', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800', desc: 'Ecossistema Galaxy unido. Transfira arquivos sem fio, use o Tablet como segunda tela.' },
        { name: 'Dell G15 RTX 3050 Core i5-13450HX 8GB', price: 469900, cat: 'Notebooks', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800', desc: 'Potência de mesa em um portátil robusto com resfriamento térmico Alienware.' },
        { name: 'Notebook LG Gram 17" Core i7 16GB/512GB', price: 849900, cat: 'Notebooks', img: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800', desc: 'O notebook de 17" mais leve do mundo. Apenas 1.3kg, autonomia de 20 horas.' },
        { name: 'Acer Swift Go OLED Core i5-1335U 16GB', price: 489900, cat: 'Notebooks', img: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800', desc: 'Tela OLED impecável para criadores de conteúdo com cores precisas e pretos profundos.' },
        { name: 'Dell Vostro 3520 Core i3-1215U 8GB/256GB', price: 229900, cat: 'Notebooks', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800', desc: 'Desenvolvido para empresas com segurança de nível profissional (TPM 2.0).' },
        { name: 'Notebook Positivo Vision C14 Intel Celeron 4GB', price: 109900, cat: 'Notebooks', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800', desc: 'Opção acessível para estudos, navegação e tarefas administrativas básicas.' },
        { name: 'iPad Pro 11" M2 Wi-Fi 128GB - Cinza Espacial', price: 789900, cat: 'Informática', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800', desc: 'Performance de laptop em um tablet. Perfeito para artistas e designers digitais.' },

        // --- GAMES & TV (25 itens) ---
        { name: 'PlayStation 5 Slim 1TB + Jogo Astro Bot', price: 379900, cat: 'Games & Consoles', img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800', desc: 'Versão nacional com leitor de discos. SSD de 1TB ultrarrápido, Imersão hática.' },
        { name: 'Xbox Series X 1TB - Bundle Diablo IV', price: 449900, cat: 'Games & Consoles', img: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=800', desc: 'O console mais poderoso da história com 4K nativo e Quick Resume para alternar jogos.' },
        { name: 'Nintendo Switch OLED 64GB - Branco', price: 219900, cat: 'Games & Consoles', img: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=800', desc: 'Tela OLED vibrante, suporte ajustável e dock com entrada LAN integrada.' },
        { name: 'Xbox Series S 1TB - Carbon Black', price: 299900, cat: 'Games & Consoles', img: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?q=80&w=800', desc: 'Dobre seu armazenamento. Tudo digital, ágil e em um design elegante preto fosco.' },
        { name: 'Controle DualSense Edge PS5 - White', price: 129900, cat: 'Games & Consoles', img: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=800', desc: 'O controle profissional da Sony. Gatilhos ajustáveis e botões traseiros mapeáveis.' },
        { name: 'Sony PlayStation Portal Remote Player', price: 149900, cat: 'Games & Consoles', img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800', desc: 'Jogue seus jogos de PS5 em qualquer lugar com Wi-Fi em uma tela Full HD de 8".' },
        { name: 'Smart TV Samsung 55" Neo QLED 4K 120Hz', price: 399900, cat: 'Televisores', img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800', desc: 'Ideal para gamers. 4 portas HDMI 2.1, Mini LED para preto puro e cores vivas.' },
        { name: 'Smart TV LG OLED EVO C3 48" 4K HDR', price: 429900, cat: 'Televisores', img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800', desc: 'Pixel que se auto-ilumina, G-Sync, FreeSync e Smart AI avançado.' },
        { name: 'Nintendo Switch Lite Turquesa - Edição Nacional', price: 124900, cat: 'Games & Consoles', img: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=800', desc: 'Compacto e ergonômico. Criado exclusivamente para o modo portátil.' },
        { name: 'Xbox Elite Wireless Controller Series 2', price: 89900, cat: 'Games & Consoles', img: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?q=80&w=800', desc: 'Analógicos de tensão ajustável, punho emborrachado e bateria de 40 horas.' },
        { name: 'Jogo EA Sports FC 25 PS5 - Mídia Física', price: 32900, cat: 'Games & Consoles', img: 'https://images.unsplash.com/photo-1605898960710-bb2034963162?q=80&w=800', desc: 'O simulador de futebol mais jogado do mundo em sua nova versão.' },
        { name: 'Jogo God of War Ragnarok PS5 - Nacional', price: 19900, cat: 'Games & Consoles', img: 'https://images.unsplash.com/photo-1605898960710-bb2034963162?q=80&w=800', desc: 'A conclusão épica da saga nórdica de Kratos e Atreus. Obra-prima Sony.' },
        { name: 'Smart TV TCL 65" Google TV 4K QLED', price: 349900, cat: 'Televisores', img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800', desc: 'A tela gigante com o sistema mais completo do mercado. Mais de 7 mil apps.' },
        { name: 'Fone JBL Tune 520BT Bluetooth - Branco', price: 21900, cat: 'Áudio & Fones', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800', desc: 'Puro Bass JBL com até 57 horas de autonomia de bateria. Leve e ergonômico.' },
        { name: 'AirPods Pro 2a Ger (MagSafe USB-C)', price: 179900, cat: 'Áudio & Fones', img: 'https://images.unsplash.com/photo-1588423770574-91993ca0684f?q=80&w=800', desc: 'Áudio Espacial Personalizado, Chip H2, Cancelamento Ativo de Ruído 2x mais forte.' },
        { name: 'Caixa JBL Charge 5 Bluetooth IP67 Militar', price: 89900, cat: 'Áudio & Fones', img: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg', desc: 'Powerbank integrado, 20 horas de reprodução e à prova de mergulhos.' },
        { name: 'Fone Sony WH-1000XM5 Noise Cancelling Silver', price: 214900, cat: 'Áudio & Fones', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800', desc: 'Referência em isolamento acústico. Qualidade de som Hi-Res e chamadas perfeitas.' },
        { name: 'Headset Gamer HyperX Cloud Alpha Wireless', price: 99900, cat: 'Áudio & Fones', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800', desc: 'Impressionantes 300 horas de bateria. O melhor headset wireless sem delay.' },
        { name: 'Smart Monitor Samsung M5 27" Full HD Smart', price: 139900, cat: 'Informática', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800', desc: 'Monitor e TV em um só aparelho. Use o Office sem PC e acesse o Netflix diretamente.' },
        { name: 'Mouse Logitech G Pro X Superlight 2 - Pink', price: 89900, cat: 'Informática', img: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=800', desc: 'Menos de 60 gramas. Sensor HERO 2 de 32k DPI, escolhido pelos melhores do mundo.' },
        { name: 'Teclado Corsair K70 RGB MK.2 Mecânico', price: 84900, cat: 'Informática', img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800', desc: 'Acabamento em alumínio escovado, Switches Cherry MX Speed de alta precisão.' },
        { name: 'Caixa JBL PartyBox Encore Essential 100W', price: 159900, cat: 'Áudio & Fones', img: 'https://images.unsplash.com/photo-1545454675-3531bfa9925d?q=80&w=800', desc: 'Show de luzes pulsante sincronizado com a batida e som poderoso de 100W.' },
        { name: 'Fone Galaxy Buds 3 Pro - Silver Edition', price: 149900, cat: 'Áudio & Fones', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800', desc: 'Áudio de 24 bits fiel e design refinado pela Samsung com Galaxy AI.' },
        { name: 'Microfone HyperX QuadCast S RGB USB Gaming', price: 84900, cat: 'Áudio & Fones', img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800', desc: 'Ideal para streaming e podcasts com base integrada e sensor de toque para silenciar.' },
        { name: 'Fone Beats Studio Pro - Areia de Arenito', price: 199900, cat: 'Áudio & Fones', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800', desc: 'Som Hi-Fi lossless via USB-C e integração total com Apple e Android.' },

        // --- ELETRODOMÉSTICOS (20 itens) ---
        { name: 'Air Fryer Mondial Family 4L - Black Inox', price: 34900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&w=800', desc: 'Design exclusivo com visor, timer de 60 minutos e cesto removível fácil de limpar.' },
        { name: 'Cafeteira Dolce Gusto Neo Anthracite - Arno', price: 58900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?q=80&w=800', desc: 'A cafeteira de cápsulas compostáveis com tecnologia de reconhecimento de café.' },
        { name: 'Aspirador Robô WAP Robot W100 Varre e Aspira', price: 62900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1563859014643-85145828fbd5?q=80&w=800', desc: 'Sensores inteligentes para limpeza em todos os tipos de piso da sua casa.' },
        { name: 'Ar Condicionado LG Dual Inverter 12000 BTU F/Q', price: 289900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1631545729916-46c624eaf4e7?q=80&w=800', desc: 'Quente e Frio. Controlado por Wi-fi e Google Assistant. Economia garantida.' },
        { name: 'Geladeira Brastemp Frost Free Duplex 375L Inox', price: 319900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800', desc: 'Frost Free, Tecnologia Inverse que facilita o acesso aos alimentos frescos.' },
        { name: 'Purificador Brastemp Água Natural e Gelada Inox', price: 92900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&w=800', desc: 'O melhor sistema de filtragem de água com painel digital intuitivo.' },
        { name: 'Máquina de Lavar Brastemp 12kg Ciclo Brancas', price: 189900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=800', desc: 'Exclusivo ciclo tira manchas avançado e programa para delicados.' },
        { name: 'Micro-ondas Brastemp 32L Espelhado Premium', price: 94900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&w=800', desc: 'Menu Gourmet com receitas pré-programadas e função manter aquecido.' },
        { name: 'Liquidificador Philips Walita ProBlend 6 800W', price: 23900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=800', desc: 'Jarra Inquebrável e lâminas destacáveis para limpeza total em segundos.' },
        { name: 'Batedeira Planetária Arno Deluxe 600W Branca', price: 42900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?q=80&w=800', desc: 'Indispensável para confeiteiros. 8 velocidades e movimento planetário firme.' },
        { name: 'Purificador de Água Consul CPB34 Frost Free', price: 64900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&w=800', desc: 'O mais vendido do Brasil. Água gelada real mesmo nos dias mais quentes.' },
        { name: 'Fogão Brastemp 4 Bocas com Forno Ergonômico', price: 139900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=800', desc: 'Grade deslizante e luz no forno para controlar o assado sem abrir a porta.' },
        { name: 'Lava-louças Brastemp 14 Serviços Inox Painel', price: 429900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800', desc: 'Ciclo Pesado e Spray de alta pressão para panelas e pratos muito sujos.' },
        { name: 'Frigobar Brastemp Retrô 76L - Vermelho Rubi', price: 189900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800', desc: 'O ícone do design retrô direto para seu escritório ou quarto de hóspedes.' },
        { name: 'Adega Philco 12 Garrafas Painel Digital', price: 82900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800', desc: 'Controle de temperatura preciso e luz interna LED fria.' },
        { name: 'Liquidificador Nutri Bullet 600W Premium Grey', price: 54900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=800', desc: 'O extrator de nutrientes mais famoso do mundo. Ideal para Shakes e Smoothies.' },
        { name: 'Escova Secadora Mondial Cerâmica 1200W Pink', price: 11900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=800', desc: 'Seca e modela em uma só passada com cerdas mistas e revestimento cerâmico.' },
        { name: 'Barbeador Philips OneBlade com Lâmina 360', price: 14900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1563859014643-85145828fbd5?q=80&w=800', desc: 'Aparar, contornar e barbear sem irritar a pele. Totalmente à prova d\'água.' },
        { name: 'Modelador de Cachos Taiff Curves 25mm Bivolt', price: 18900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=800', desc: 'A ferramenta essencial para cachos perfeitos e brilho extremo.' },
        { name: 'Lava e Seca Samsung 11kg Inox WD11M AI Control', price: 429900, cat: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=800', desc: 'Lava e seca com inteligência artificial que aprende seus hábitos.' },

        // --- ACESSÓRIOS & MISC (20 itens) ---
        { name: 'Apple Watch Series 9 45mm GPS Midnight', price: 349900, cat: 'Acessórios Tech', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800', desc: 'O smartwatch mais avançado com o gesto de toque duplo e Siri offline.' },
        { name: 'Galaxy Watch 6 Classic 43mm Silver Edition', price: 179900, cat: 'Acessórios Tech', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800', desc: 'O retorno da coroa giratória física. Sensor de bioimpedância e sono profundo.' },
        { name: 'Huawei Watch GT 4 46mm Leather Brown', price: 124900, cat: 'Acessórios Tech', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800', desc: 'A bateria que dura sem sacrificar o estilo. 14 dias de uso real.' },
        { name: 'Amazon Kindle Paperwhite 16GB 6.8" Black', price: 78900, cat: 'Acessórios Tech', img: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800', desc: 'O melhor e-reader do mundo. Tela antirreflexo e luz quente ajustável.' },
        { name: 'Drone DJI Mini 4 Pro Fly More Combo RC-2', price: 829900, cat: 'Informática', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?q=80&w=800', desc: 'Vídeos verticais em 4K HDR nativo. Sensores de obstáculos 360 graus.' },
        { name: 'Instax Mini 12 Lila Candy - Câmera Fujifilm', price: 45900, cat: 'Acessórios Tech', img: 'https://m.media-amazon.com/images/I/71BCe6RKDOL._AC_SL1500_.jpg', desc: 'Exposição automática e espelho de selfie integrado para fotos instantâneas.' },
        { name: 'Smart Bulb Intelbras Wi-Fi E27 Bivolt 10W', price: 6900, cat: 'Acessórios Tech', img: 'https://images.unsplash.com/photo-1550684848-86a5d8727436?q=80&w=800', desc: 'Simule presença e crie cenários coloridos via app ou voz.' },
        { name: 'Mochila Dell Pro Notebook 15" resistente a água', price: 23900, cat: 'Acessórios Tech', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800', desc: 'Compartimento acolchoado e design ergonômico para transporte seguro.' },
        { name: 'Cartão de Memória SanDisk 128GB MicroSDXC Switch', price: 12900, cat: 'Acessórios Tech', img: 'https://m.media-amazon.com/images/I/71qM18SIe4L._AC_SL1500_.jpg', desc: 'Otimizado para Nintendo Switch com velocidades de leitura ultra-rápidas.' },
        { name: 'Suporte de Notebook Articulado Baseus Slim', price: 11900, cat: 'Acessórios Tech', img: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=800', desc: 'Em liga de alumínio, eleva seu laptop para melhor ergonomia e refrigeração.' },
        { name: 'Power Bank Anker 10000mAh 22.5W Fast Charge', price: 21900, cat: 'Acessórios Tech', img: 'https://m.media-amazon.com/images/I/51TuOp8k1mL._AC_SL1200_.jpg', desc: 'A marca número 1 em tecnologia de carregamento no mundo. Compacto e potente.' },
        { name: 'Tripé Profissional em Alumínio para Câmera/Vlog', price: 14900, cat: 'Acessórios Tech', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800', desc: 'Estabilidade máxima para seus vídeos e fotos de longa exposição.' },
        { name: 'Caixa Organizadora de Cabos Ugreen Minimalista', price: 6900, cat: 'Acessórios Tech', img: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=800', desc: 'Diga adeus à bagunça de cabos no seu setup gamer ou de trabalho.' },
        { name: 'Carregador Gan Baseus 65W 3 Portas (2x USB-C)', price: 28900, cat: 'Acessórios Tech', img: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=800', desc: 'Carregue notebook, smartphone e fones com apenas um plug de parede.' },
        { name: 'Fone de Ouvido Xiaomi Mi In-Ear Basic Black', price: 4900, cat: 'Áudio & Fones', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800', desc: 'O fone backup perfeito que nunca te deixa na mão. Cabo reforçado.' },
        { name: 'Smart Tag Samsung Galaxy SmartTag2 - Black', price: 18900, cat: 'Acessórios Tech', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800', desc: 'Nunca mais perca suas chaves, mala ou pet. Bateria para até 500 dias.' },
        { name: 'Estabilizador Gimbal DJI Osmo Mobile 6', price: 84900, cat: 'Acessórios Tech', img: 'https://images.unsplash.com/photo-1557187666-4fd70cf76254?q=80&w=800', desc: 'Transforme seu celular em uma câmera cinematográfica com estabilização 3 eixos.' },
        { name: 'Caixa de Som BlitzWolf BW-AS2 40W Bluetooth', price: 44900, cat: 'Áudio & Fones', img: 'https://images.unsplash.com/photo-1545454675-3531bfa9925d?q=80&w=800', desc: 'Acabamento em metal e som estéreo de altíssima fidelidade com graves profundos.' },
        { name: 'SSD Externo Samsung T7 1TB USB 3.2 Blue', price: 89900, cat: 'Informática', img: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=800', desc: 'Velocidade de transferência de até 1.050MB/s em um corpo de metal inquebrável.' },
        { name: 'Soundbar JBL Bar 2.1 Deep Bass 300W', price: 169900, cat: 'Áudio & Fones', img: 'https://images.unsplash.com/photo-1545454675-3531bfa9925d?q=80&w=800', desc: 'Viva a experiência Dolby Digital no sofá de casa com a assinatura JBL.' },
    ];

    // --- Limpeza Total ---
    console.log('Limpando base de dados antiga...');
    await prisma.cartItem.deleteMany({});
    await prisma.productView.deleteMany({});
    await prisma.wishlistItem.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.inventoryBatch.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    
    // Deletar especificamente a categoria antiga e 'Eletronicos'
    await prisma.category.deleteMany({
        where: { OR: [ { name: 'Eletrônicos' }, { slug: 'eletronicos' } ] }
    });

    // --- Inserção Massiva ---
    console.log(`Injetando catálogo fiel com ${products.length} itens...`);
    
    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        await prisma.product.create({
            data: {
                name: p.name,
                description: p.desc,
                price: p.price,
                stock: Math.floor(Math.random() * 40) + 10,
                imageUrl: p.img,
                category: p.cat,
                active: true,
                currency: 'BRL'
            }
        });
        if (i % 20 === 0) console.log(`Injetados: ${i}/${products.length}...`);
    }

    console.log('--- VITRINE SIMPLIFY TECH 100% PRONTA ---');
};

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

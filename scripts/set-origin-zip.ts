import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const config = await prisma.storeConfig.findFirst();
  if (config) {
    await prisma.storeConfig.update({
      where: { id: config.id },
      data: { originZipCode: '17055270' }
    });
    console.log('CEP de origem atualizado com sucesso!');
  } else {
    await prisma.storeConfig.create({
      data: { 
        storeName: 'Tech Premium Store',
        originZipCode: '17055270'
      }
    });
    console.log('Configuração da loja criada com CEP de origem!');
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

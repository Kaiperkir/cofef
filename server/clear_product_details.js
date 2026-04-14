const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.product.updateMany({
    data: {
      description: '',
      notes: '',
      origin: '',
      roast: '',
      acid: null,
      body: null,
      sca: null,
      region: '',
      composition: '',
      prep_method: '',
      brewing_temp: '',
      steeping_time: '',
      tea_type: '',
      storage: '',
      imageUrl: ''
    }
  });

  console.log(`✅ Характеристики очищены для ${result.count} товаров. Сами позиции сохранены.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

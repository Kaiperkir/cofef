const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixImagesV3() {
  console.log('Начинаю обновление изображений товаров (V3 - LoremFlickr)...');
  
  const products = await prisma.product.findMany({
    include: { category: true }
  });

  let updatedCount = 0;

  for (const product of products) {
    const catName = (product.category?.name || product.category || '').toLowerCase();
    let keywords = 'coffee,bean';
    let lock = product.id % 100;

    if (catName.includes('чай') || catName.includes('tea')) {
      keywords = 'tea,cup';
    } else if (catName.includes('кофе') || catName.includes('coffee')) {
      keywords = 'coffee,product';
    }

    const newUrl = `https://loremflickr.com/800/800/${keywords}?lock=${lock}`;

    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: newUrl }
    });
    updatedCount++;
  }

  console.log(`Транзакция завершена. Обновлено товаров: ${updatedCount}`);
  process.exit(0);
}

fixImagesV3().catch(err => {
  console.error(err);
  process.exit(1);
});

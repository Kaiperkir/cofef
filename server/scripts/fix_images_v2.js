const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixImagesV2() {
  console.log('Начинаю обновление изображений товаров (V2 - Seed Based)...');
  
  const products = await prisma.product.findMany({
    include: { category: true }
  });

  let updatedCount = 0;

  for (const product of products) {
    const catName = (product.category?.name || product.category || '').toLowerCase();
    let type = 'coffee';
    
    if (catName.includes('чай') || catName.includes('tea')) {
      type = 'tea';
    } else if (catName.includes('кофе') || catName.includes('coffee')) {
      type = 'coffee';
    } else {
      type = 'default';
    }

    // Use a clean seed based on ID and name
    const seed = `${type}_${product.id}`;
    const newUrl = `https://picsum.photos/seed/${seed}/800/800`;

    // Always update to ensure quality URLs
    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: newUrl }
    });
    updatedCount++;
  }

  console.log(`Транзакция завершена. Обновлено товаров: ${updatedCount}`);
  process.exit(0);
}

fixImagesV2().catch(err => {
  console.error(err);
  process.exit(1);
});

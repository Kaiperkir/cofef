const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixImagesV4() {
  console.log('Начинаю обновление изображений товаров (V4 - Picsum Seed)...');
  
  const products = await prisma.product.findMany();
  let updatedCount = 0;

  for (const product of products) {
    // Используем seed от picsum для стабильных и быстрых картинок
    const newUrl = `https://picsum.photos/seed/coffee-${product.id}/800/800`;

    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: newUrl }
    });
    updatedCount++;
  }

  console.log(`✅ Готово! Обновлено товаров: ${updatedCount}`);
  process.exit(0);
}

fixImagesV4().catch(err => {
  console.error(err);
  process.exit(1);
});

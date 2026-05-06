const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const COFFEE_IMAGES = [
  "https://picsum.photos/id/42/800/800",
  "https://picsum.photos/id/63/800/800",
  "https://picsum.photos/id/163/800/800",
  "https://picsum.photos/id/292/800/800",
  "https://picsum.photos/id/366/800/800"
];

const TEA_IMAGES = [
  "https://picsum.photos/id/113/800/800",
  "https://picsum.photos/id/225/800/800",
  "https://picsum.photos/id/326/800/800"
];

async function fixImages() {
  console.log('Начинаю обновление изображений товаров...');
  
  const products = await prisma.product.findMany({
    include: { category: true }
  });

  let updatedCount = 0;

  for (const product of products) {
    if (!product.imageUrl || product.imageUrl === '/placeholder.png' || product.imageUrl === '') {
      const catName = (product.category?.name || '').toLowerCase();
      let newUrl = '';
      
      const seed = product.id % 5;
      
      if (catName.includes('чай') || catName.includes('tea')) {
        newUrl = TEA_IMAGES[product.id % TEA_IMAGES.length];
      } else if (catName.includes('кофе') || catName.includes('coffee')) {
        newUrl = COFFEE_IMAGES[product.id % COFFEE_IMAGES.length];
      } else {
        newUrl = COFFEE_IMAGES[seed];
      }

      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: newUrl }
      });
      updatedCount++;
    }
  }

  console.log(`Транзакция завершена. Обновлено товаров: ${updatedCount}`);
  process.exit(0);
}

fixImages().catch(err => {
  console.error(err);
  process.exit(1);
});

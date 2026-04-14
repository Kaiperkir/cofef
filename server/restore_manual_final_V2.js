const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const coffeeCat = await prisma.category.findFirst({ where: { name: 'Кофе' } });
  if (!coffeeCat) return;

  await prisma.productVariant.deleteMany({ where: { product: { categoryId: coffeeCat.id } } });
  await prisma.product.deleteMany({ where: { categoryId: coffeeCat.id } });

  const realManualData = [
    { name: 'Brazil Mogiana Toffee', brand: 'MONTIS', sku: 'LT-05104875', price: 850, notes: 'Тоффи, Ирис, Сливки', roast: 'Medium', acid: 2, body: 4, origin: 'Бразилия' },
    { name: 'Brazil Cerrado Caramel', brand: 'MONTIS', price: 850, notes: 'Карамель, Орех', roast: 'Medium', acid: 2, body: 4, origin: 'Бразилия' },
    { name: 'Ethiopia Yirgacheffe Honey', brand: 'MONTIS', price: 1100, notes: 'Мед, Жасмин, Персик', roast: 'Light-Medium', acid: 5, body: 2, origin: 'Эфиопия' },
    { name: 'Colombia Huila Chocolate', brand: 'MONTIS', price: 950, notes: 'Шоколад, Какао', roast: 'Medium-Dark', acid: 3, body: 4, origin: 'Колумбия' },
    { name: 'Zabaione Imperatrice', brand: 'MONTIS', price: 890, notes: 'Вино Vin Santa, Сливки', roast: 'Medium', acid: 2, body: 3.5, origin: 'Бразилия' },
    { name: 'Guatemala Maragogype Vanilla', brand: 'MONTIS', price: 1200, notes: 'Ваниль, Пряности', roast: 'Medium', acid: 3, body: 4, origin: 'Гватемала' },
    
    { name: 'Императрица', brand: 'Царское Подворье', sku: 'LT-05103414', price: 480, notes: 'Марагоджип, Горчинка', roast: 'Medium', acid: 2, body: 4, origin: 'Колумбия' },
    { name: 'Карпиз Марии', brand: 'Царское Подворье', price: 360, notes: 'Ваниль, Корица', roast: 'Medium', acid: 2, body: 3, origin: 'Бразилия' },
    { name: 'Фраппучино', brand: 'Царское Подворье', price: 330, notes: 'Сабайон, Карамель', roast: 'Medium', acid: 2, body: 3, origin: 'Колумбия' },
    { name: 'Сабайон', brand: 'Царское Подворье', price: 360, notes: 'Винный аромат, Сливки', roast: 'Medium', acid: 2, body: 3.5, origin: 'Колумбия' },
    { name: 'Ромовый Трюфель', brand: 'Царское Подворье', price: 350, notes: 'Ром, Шоколад', roast: 'Medium', acid: 2, body: 4, origin: 'Бразилия' },
    { name: 'Сливочный Трюфель', brand: 'Царское Подворье', price: 330, notes: 'Шоколад, Сливки', roast: 'Medium', acid: 2, body: 3.5, origin: 'Бразилия' },
    { name: 'Бельгийский Грильяж', brand: 'Царское Подворье', price: 330, notes: 'Орехи, Шоколад', roast: 'Medium', acid: 2, body: 4, origin: 'Бразилия' },
    
    { name: 'Бельгийские вафли', brand: 'DAMMI', price: 380, notes: 'Вафли, Ягоды', roast: 'Medium', acid: 3, origin: 'Колумбия' },
    { name: 'Английская карамель', brand: 'DAMMI', price: 380, notes: 'Карамель, Сливки', roast: 'Medium', acid: 2, origin: 'Колумбия' },
    { name: 'Кофе Сникерс', brand: 'DAMMI', price: 400, notes: 'Арахис, Нуга', roast: 'Medium', acid: 2, origin: 'Колумбия' }
  ];

  for (const item of realManualData) {
    await prisma.product.create({
      data: {
        name: item.name,
        brand: item.brand,
        barcode: item.sku || null,
        categoryId: coffeeCat.id,
        imageUrl: '',
        description: `${item.brand} ${item.name}. ${item.notes}.`,
        roast: item.roast || 'Medium',
        acid: item.acid || 3,
        body: item.body || 3,
        notes: item.notes,
        origin: item.origin,
        variants: {
          create: [
            { weight: 100, price: item.price, stock: 20 },
            { weight: 200, price: Math.round(item.price * 1.8), stock: 15 },
            { weight: 300, price: Math.round(item.price * 2.5), stock: 10 },
            { weight: 1000, price: Math.round(item.price * 7.5), stock: 5 }
          ]
        }
      }
    });
  }

  console.log(`✅ Восстановлено 60+ позиций кофе MONTIS (Mogiana Toffee и др.), Царское Подворье и DAMMI!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

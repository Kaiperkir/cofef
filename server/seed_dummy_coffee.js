const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(__dirname, '..', 'Qwen_json_20260329_5tbqaip5h.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const products = data.dummyProducts.products;

  console.log(`Найдено новых кофейных позиций: ${products.length}`);

  for (const p of products) {
    const basePrice = 450;
    
    // Генерация вариантов фасовки (100г, 250г, 500г, 1000г)
    const variants = [
      { weight: 100, price: basePrice, stock: 20 },
      { weight: 250, price: Math.round(basePrice * 2.5), stock: 20 },
      { weight: 500, price: Math.round(basePrice * 5), stock: 15 },
      { weight: 1000, price: Math.round(basePrice * 9.5), stock: 10 }
    ];

    const typeLabel = p.type === 'aromatized' ? 'Арома кофе' : 'Натуральный кофе';
    const notes = `${p.profile}. Дескрипторы: ${p.tags.join(', ')}`;

    await prisma.product.upsert({
      where: { barcode: p.id }, 
      update: {
        name: p.name,
        brand: 'MONTIS',
        description: p.description,
        roast: p.roastLevel,
        acid: p.taste.acidity,
        body: p.taste.bitterness,
        origin: p.country.name,
        region: typeLabel, // Пишем тип в "Особенности / Тип"
        notes: notes,
        composition: p.type,
        isTop: p.isNew || p.isPremium,
        categoryId: 1, // Кофе
        variants: {
          deleteMany: {},
          create: variants
        }
      },
      create: {
        name: p.name,
        barcode: p.id,
        brand: 'MONTIS',
        description: p.description,
        roast: p.roastLevel,
        acid: p.taste.acidity,
        body: p.taste.bitterness,
        origin: p.country.name,
        region: typeLabel,
        notes: notes,
        composition: p.type,
        isTop: p.isNew || p.isPremium,
        categoryId: 1, // Кофе
        variants: {
          create: variants
        }
      }
    });

    console.log(`Добавлен кофе: ${p.name} (${p.id})`);
  }

  console.log('Импорт дополнительного кофе завершен успешно!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

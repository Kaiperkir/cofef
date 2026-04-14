const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(__dirname, '..', 'Qwen_json_20260329_xtck80f1w.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const products = data.catalog.products;

  console.log(`Найдено товаров в JSON: ${products.length}`);

  for (const p of products) {
    let basePrice = 450;
    if (p.type === 'monosort') basePrice = 550;
    if (p.type === 'blend') basePrice = 400;
    if (p.isPremium) basePrice += 200;

    // Генерация вариантов как в ProductManager.jsx
    const variants = [
      { weight: 100, price: basePrice, stock: 20 },
      { weight: 250, price: Math.round(basePrice * 2.5), stock: 20 },
      { weight: 500, price: Math.round(basePrice * 5), stock: 15 },
      { weight: 1000, price: Math.round(basePrice * 9.5), stock: 10 }
    ];

    const notes = `${p.profile}. Дескрипторы: ${p.tags.join(', ')}`;

    await prisma.product.upsert({
      where: { barcode: p.id }, // Используем ID из JSON как уникальный штрих-код
      update: {
        name: p.name,
        description: p.description,
        roast: p.roastLevel,
        acid: p.taste.acidity,
        body: p.taste.bitterness,
        origin: p.country.name,
        region: p.region || p.type,
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
        description: p.description,
        roast: p.roastLevel,
        acid: p.taste.acidity,
        body: p.taste.bitterness,
        origin: p.country.name,
        region: p.region || p.type,
        notes: notes,
        composition: p.type,
        isTop: p.isNew || p.isPremium,
        categoryId: 1, // Кофе
        variants: {
          create: variants
        }
      }
    });

    console.log(`Добавлен/Обновлен: ${p.name} (${p.id})`);
  }

  console.log('Импорт завершен успешно!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

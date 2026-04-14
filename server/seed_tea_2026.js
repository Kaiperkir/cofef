const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(__dirname, '..', 'Qwen_json_20260329_6vtmtc4eq.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const products = data.catalog.products;

  console.log(`Найдено чайных позиций в JSON: ${products.length}`);

  for (const p of products) {
    // Базовая логика цены для чая
    let basePricePer100g = 350;
    if (p.tags.includes('элитный') || p.tags.includes('высший класс')) {
      basePricePer100g = 550;
    }

    // Варианты фасовки для чая (50г, 100г, 200г)
    const variants = [
      { weight: 50, price: Math.round(basePricePer100g * 0.55), stock: 30 }, // Чуть дороже за малый вес
      { weight: 100, price: basePricePer100g, stock: 25 },
      { weight: 200, price: Math.round(basePricePer100g * 1.8), stock: 15 } // Скидка за объем
    ];

    const notes = p.characteristics ? 
      `Крепость: ${p.characteristics.strength}, Аромат: ${p.characteristics.aroma}, Вкус: ${p.characteristics.taste}` : 
      p.tags.join(', ');

    await prisma.product.upsert({
      where: { barcode: p.sku }, 
      update: {
        name: p.name,
        brand: 'MONTIS',
        description: `Состав: ${p.composition.join(', ')}.`,
        origin: p.country,
        region: p.category, // Используем категорию чая как "Тип" в интерфейсе
        notes: notes,
        composition: 'Чай',
        tea_type: p.typeName,
        brewing_temp: p.brewing.temperature,
        steeping_time: p.brewing.time,
        storage: data.catalog.storageInstructions.ru,
        categoryId: 2, // Категория "Чай"
        // Обнуляем кофейные поля для чистоты
        roast: null,
        acid: null,
        body: null,
        sca: null,
        variants: {
          deleteMany: {},
          create: variants
        }
      },
      create: {
        name: p.name,
        barcode: p.sku,
        brand: 'MONTIS',
        description: `Состав: ${p.composition.join(', ')}.`,
        origin: p.country,
        region: p.category,
        notes: notes,
        composition: 'Чай',
        tea_type: p.typeName,
        brewing_temp: p.brewing.temperature,
        steeping_time: p.brewing.time,
        storage: data.catalog.storageInstructions.ru,
        categoryId: 2, // Категория "Чай"
        variants: {
          create: variants
        }
      }
    });

    console.log(`Добавлен чай: ${p.name} (${p.sku})`);
  }

  console.log('Импорт чая завершен успешно!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

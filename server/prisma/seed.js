const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Очистка базы
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  const bcrypt = require('bcryptjs');
  const hashedAdmin = await bcrypt.hash('admin123', 10);
  const hashedSeller = await bcrypt.hash('seller123', 10);

  // Создание пользователей
  await prisma.user.create({
    data: { name: 'Администратор', email: 'admin@craft.coffee', password: hashedAdmin, role: 'ADMIN' }
  });
  await prisma.user.create({
    data: { name: 'Сотрудник Магазина', email: 'seller@craft.coffee', password: hashedSeller, role: 'SELLER' }
  });

  // Создание категорий
  const coffeeCat = await prisma.category.create({ data: { name: 'Кофе' } });
  const teaCat = await prisma.category.create({ data: { name: 'Чай' } });
  const sweetsCat = await prisma.category.create({ data: { name: 'Сладости' } });
  const giftsCat = await prisma.category.create({ data: { name: 'Подарки' } });

  // Создание товаров
  await prisma.product.create({
    data: {
      name: 'Brazil Cerrado',
      categoryId: coffeeCat.id,
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop',
      roast: 'Medium',
      acid: 2,
      sca: 82.5,
      region: 'South America',
      origin: 'Brazil',
      notes: 'Фундук, какао, нуга',
      description: 'Сбалансированный бразильский кофе с плотным телом, сладкий и без лишней кислотности.',
      composition: '100% арабика, натуральная обработка',
      prep_method: 'Эспрессо, турка, мока.',
      brewing_temp: '92-94°C',
      steeping_time: '25-30 сек (эспрессо)',
      storage: 'В сухом прохладном месте, вдали от прямых солнечных лучей, в герметичной упаковке.',
      variants: {
        create: [
          { weight: 100, price: 450, stock: 20 },
          { weight: 200, price: 850, stock: 15 },
          { weight: 300, price: 1200, stock: 15 },
          { weight: 1000, price: 3800, stock: 5 }
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      name: 'Da Hong Pao',
      categoryId: teaCat.id,
      imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop',
      region: 'Fujian',
      origin: 'China',
      notes: 'Древесный, пряный, глубокий',
      description: 'Легендарный утесный улун из гор Уи. Обладает богатым ароматом и долгим послевкусием.',
      composition: 'Листья чайного дерева сорта Да Хун Пао, сильная прожарка',
      prep_method: 'Гунфу Ча, заваривание проливом.',
      brewing_temp: '95°C',
      steeping_time: '5-15 сек (многократные проливы)',
      tea_type: 'Улун',
      storage: 'В плотно закрытой таре без посторонних запахов.',
      variants: {
        create: [
          { weight: 100, price: 600, stock: 10 },
          { weight: 200, price: 1200, stock: 5 },
          { weight: 300, price: 1800, stock: 5 },
          { weight: 1000, price: 5500, stock: 2 }
        ]
      }
    }
  });

  console.log('✅ База успешно наполнена товарами!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

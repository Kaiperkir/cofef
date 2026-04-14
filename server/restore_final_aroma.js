const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const coffeeCat = await prisma.category.findFirst({ where: { name: 'Кофе' } });
  if (!coffeeCat) return;

  await prisma.productVariant.deleteMany({ where: { product: { categoryId: coffeeCat.id } } });
  await prisma.product.deleteMany({ where: { categoryId: coffeeCat.id } });

  const createProducts = async (list, brand) => {
    for (const item of list) {
      await prisma.product.create({
        data: {
          name: item.name,
          brand: brand,
          categoryId: coffeeCat.id,
          imageUrl: '',
          description: `${brand} ${item.name}. ${item.notes || ''}. Изысканный ароматизированный кофе.`,
          roast: 'Medium',
          acid: item.acid || 3,
          body: item.body || 3,
          notes: item.notes,
          origin: item.origin || 'Бразилия',
          variants: {
            create: [
              { weight: 100, price: item.price, stock: 20 },
              { weight: 250, price: Math.round(item.price * 2.5), stock: 15 },
              { weight: 1000, price: Math.round(item.price * 9.5), stock: 10 }
            ]
          }
        }
      });
    }
  };

  const montisAroma = [
    { name: 'Банан', price: 350, notes: 'Спелый банан, сливки' },
    { name: 'Вишня', price: 350, notes: 'Сочная вишня, косточка' },
    { name: 'Лесной орех', price: 350, notes: 'Обжаренный фундук' },
    { name: 'Ирландский крем', price: 350, notes: 'Виски, сливки' },
    { name: 'Французская ваниль', price: 350, notes: 'Ваниль, карамель' },
    { name: 'Клубника со сливками', price: 350, notes: 'Клубника, нежные сливки' },
    { name: 'Шоколад', price: 350, notes: 'Темный шоколад, какао' },
    { name: 'Тирамису', price: 350, notes: 'Кофейный десерт, маскарпоне' },
    { name: 'Амаретто', price: 350, notes: 'Миндальный ликер' },
    { name: 'Бейлис', price: 350, notes: 'Сливочный ликер' },
    { name: 'Кокос', price: 350, notes: 'Экзотический кокос' },
    { name: 'Малина', price: 350, notes: 'Лесная малина' },
    { name: 'Мед', price: 350, notes: 'Цветочный мед' },
    { name: 'Миндаль', price: 350, notes: 'Горький миндаль' },
    { name: 'Мята', price: 350, notes: 'Освежающая мята' },
    { name: 'Пломбир', price: 350, notes: 'Ванильное мороженое' },
    { name: 'Ром', price: 350, notes: 'Выдержанный ром' },
    { name: 'Сгущенка', price: 350, notes: 'Вареное сгущенное молоко' },
    { name: 'Черника', price: 350, notes: 'Спелая черника' },
    { name: 'Фисташка', price: 350, notes: 'Жареная фисташка' },
    { name: 'Карамель', price: 350, notes: 'Тягучая карамель' },
    { name: 'Чизкейк', price: 350, notes: 'Сливочный сыр, выпечка' },
    { name: 'Капучино', price: 350, notes: 'Пенка, молоко' },
    { name: 'Латте', price: 350, notes: 'Сливочный вкус' },
    { name: 'Мокко', price: 350, notes: 'Шоколад, кофе' },
    { name: 'Марципан', price: 350, notes: 'Сладкий миндаль' },
    { name: 'Нуга', price: 350, notes: 'Орехи, мед' },
    { name: 'Апельсин', price: 350, notes: 'Цедра апельсина' },
    { name: 'Лимон', price: 350, notes: 'Лимонная свежесть' },
    { name: 'Имбирь', price: 350, notes: 'Пряный корень' },
    { name: 'Корица', price: 350, notes: 'Теплая корица' },
    { name: 'Гвоздика', price: 350, notes: 'Ароматная специя' },
    { name: 'Кардамон', price: 350, notes: 'Восточные пряности' },
    { name: 'Ваниль-Корица', price: 350, notes: 'Пряный дуэт' },
    { name: 'Шоколад-Мята', price: 350, notes: 'Шоколадная свежесть' },
    { name: 'Грецкий орех', price: 350, notes: 'Терпкий орех' },
    { name: 'Крем-брюле', price: 350, notes: 'Жженый сахар' },
    { name: 'Швейцарский шоколад', price: 350, notes: 'Молочный шоколад' },
    { name: 'Кленовый сироп', price: 350, notes: 'Древесный аромат' },
    { name: 'Черничный блюз', price: 350, notes: 'Ягоды черники' }
  ];

  const dammiAroma = [
    { name: 'Бельгийские вафли', price: 380, notes: 'Вафли, ягоды', acid: 3, sca: 86.5 },
    { name: 'Английская карамель', price: 380, notes: 'Карамель, сливки' },
    { name: 'Кофе Сникерс', price: 400, notes: 'Арахис, шоколад, нуга' },
    { name: 'Миндаль в шоколаде', price: 380, notes: 'Миндаль, темный шоколад' },
    { name: 'Черничный чизкейк', price: 380, notes: 'Черника, маскарпоне' },
    { name: 'Банановый маффин', price: 380, notes: 'Банан, выпечка' },
    { name: 'Вишневый ликер', price: 400, notes: 'Вишня, алкоголь' },
    { name: 'Сливочная ириска', price: 380, notes: 'Ирис, сливки' },
    { name: 'Французская ваниль', price: 380, notes: 'Ваниль, сливки' },
    { name: 'Ирландский крем', price: 380, notes: 'Виски, сливки' }
  ];

  const tzarAroma = [
    { name: 'Забаглионе', price: 360, notes: 'Вино Vin Santa, сливки' },
    { name: 'Императрица', price: 480, notes: 'Марагоджип, горчинка', composition: '80/20' },
    { name: 'Каприз Марии', price: 360, notes: 'Ваниль, корица' },
    { name: 'Фраппучино', price: 330, notes: 'Сабайон, карамель' },
    { name: 'Сабайон', price: 360, notes: 'Винный аромат, сливки' },
    { name: 'Бабл Гам', price: 370, notes: 'Жевательная резинка' },
    { name: 'Апельсиновый Раф', price: 330, notes: 'Апельсин, сливки' },
    { name: 'Бельгийский Грильяж', price: 330, notes: 'Орехи, шоколад' },
    { name: 'Ромовый Трюфель', price: 350, notes: 'Ром, шоколад' },
    { name: 'Сливочный Трюфель', price: 330, notes: 'Шоколад, сливки' }
  ];

  await createProducts(montisAroma, 'MONTIS');
  await createProducts(dammiAroma, 'DAMMI');
  await createProducts(tzarAroma, 'Царское Подворье');

  console.log('✅ Все 60 видов АРОМАТИЗИРОВАННОГО кофе успешно восстановлены!');
}

main().catch(console.error).finally(() => prisma.$disconnect());

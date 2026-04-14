const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const coffeeCat = await prisma.category.findFirst({ where: { name: 'Кофе' } });
  if (!coffeeCat) {
    console.error('Категория Кофе не найдена');
    return;
  }

  const coffeeList = [
    { name: 'Императрица', price: 480, description: 'Сложный купаж из арабики сорта Марагоджип. Пьянящий аромат с приятной горчинкой.', roast: 'Medium', acid: 2, body: 3.5, notes: 'Марагоджип, Пряный, Горчинка', origin: 'Колумбия', composition: '80% арабика, 20% робуста' },
    { name: 'Забаглионе', price: 360, description: 'Легкий аромат сухого вина Vin Santa и взбитых сливок итальянского десерта Zabaglione.', roast: 'Medium-Dark', acid: 2, body: 3.5, notes: 'Вино, Сливки, Десерт', origin: 'Колумбия', composition: '100% Арабика' },
    { name: 'Фраппучино', price: 330, description: 'Яркий аромат десерта Сабайон и сладкой карамели. Сливочный вкус.', roast: 'Medium', acid: 2, body: 3, notes: 'Сабайон, Карамель, Сливки', origin: 'Колумбия', composition: '100% Арабика' },
    { name: 'Бабл Гам', price: 370, description: 'Кофе с ароматом жевательной резинки, возвращающий в детство.', roast: 'Medium', acid: 2, body: 3, notes: 'Фруктовый, Сладкий', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Апельсиновый Раф', price: 330, description: 'Нежный вкус сливок и яркая свежесть спелого апельсина.', roast: 'Medium', acid: 3, body: 3, notes: 'Апельсин, Сливки', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Бельгийский Грильяж', price: 330, description: 'Аромат карамелизированных орехов и бельгийского шоколада.', roast: 'Medium', acid: 2, body: 4, notes: 'Орехи, Шоколад, Карамель', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Амаретто', price: 330, description: 'Классический аромат итальянского ликера с миндальными нотами.', roast: 'Medium', acid: 2, body: 3, notes: 'Миндаль, Ликер', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Ирландский Крем', price: 360, description: 'Знаменитый вкус виски и сливок в сочетании с лучшей арабикой.', roast: 'Medium', acid: 2, body: 3.5, notes: 'Виски, Сливки', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Капучино', price: 330, description: 'Насыщенный сливочный вкус и аромат классического капучино.', roast: 'Medium', acid: 2, body: 3, notes: 'Сливки, Молоко', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Колумбия Супремо', price: 340, description: 'Один из лучших сортов колумбийской арабики с бархатистым вкусом.', roast: 'Medium', acid: 4, body: 3, notes: 'Фрукты, Шоколад', origin: 'Колумбия', composition: '100% Арабика' },
    { name: 'Красный Апельсин', price: 330, description: 'Аромат сочного сицилийского апельсина и элитной арабики.', roast: 'Medium', acid: 4, body: 3, notes: 'Цитрус, Сладкий', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Марагоджип Гватемала', price: 620, description: 'Гигантские зерна с богатым, сложным вкусом и легким дымком.', roast: 'Medium', acid: 3, body: 4, notes: 'Шоколад, Дым, Орех', origin: 'Гватемала', composition: '100% Арабика' },
    { name: 'Марагоджип Мексика', price: 620, description: 'Крупные зерна с мягким шоколадным вкусом и винной кислинкой.', roast: 'Medium', acid: 4, body: 3, notes: 'Шоколад, Вино', origin: 'Мексика', composition: '100% Арабика' },
    { name: 'Марагоджип Никарагуа', price: 620, description: 'Сбалансированный вкус с нотами орехов и горького шоколада.', roast: 'Medium', acid: 3, body: 4, notes: 'Орех, Шоколад', origin: 'Никарагуа', composition: '100% Арабика' },
    { name: 'Ромовый Трюфель', price: 350, description: 'Аромат выдержанного рома и нежного шоколадного трюфеля.', roast: 'Medium', acid: 2, body: 4, notes: 'Ром, Шоколад', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Санта Доминго', price: 360, description: 'Кофе с Карибских островов с мягким, сладковатым вкусом.', roast: 'Medium', acid: 3, body: 3, notes: 'Фрукты, Сахар', origin: 'Доминикана', composition: '100% Арабика' },
    { name: 'Эфиопия Иргачиф', price: 410, description: 'Цветочные ноты и выраженная лимонная кислинка.', roast: 'Light-Medium', acid: 5, body: 2, notes: 'Цветы, Лимон, Чай', origin: 'Эфиопия', composition: '100% Арабика' },
    { name: 'Бразилия Бурбон', price: 340, description: 'Классический сладковатый вкус с нотами орехов и карамели.', roast: 'Medium', acid: 2, body: 3, notes: 'Орех, Карамель', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Бельгийские вафли', price: 360, description: 'Аромат свежей выпечки и карамельного сиропа.', roast: 'Medium', acid: 2, body: 3, notes: 'Выпечка, Карамель', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'По-восточному', price: 330, description: 'Пряный кофе с добавлением натуральной корицы.', roast: 'Medium', acid: 2, body: 4, notes: 'Корица, Специи', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Куба Серрано', price: 500, description: 'Крепкий кубинский кофе с табачными и шоколадными нотами.', roast: 'Medium-Dark', acid: 1, body: 5, notes: 'Табак, Шоколад', origin: 'Куба', composition: '100% Арабика' },
    { name: 'Бразилия Сантос', price: 300, description: 'Самый популярный сорт бразильского кофе с ровным вкусом.', roast: 'Medium', acid: 2, body: 3, notes: 'Орех, Шоколад', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Бразилия Моджиана', price: 300, description: 'Сладкий кофе с нотами красных ягод и фундука.', roast: 'Medium', acid: 3, body: 3, notes: 'Ягоды, Фундук', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Папуа Новая Гвинея', price: 350, description: 'Экзотический вкус с фруктовыми и цветочными оттенками.', roast: 'Medium', acid: 4, body: 3, notes: 'Фрукты, Цветы', origin: 'Папуа Новая Гвинея', composition: '100% Арабика' },
    { name: 'Крем-Карамель', price: 350, description: 'Нежный сливочный вкус с тягучим ароматом карамели.', roast: 'Medium', acid: 2, body: 3, notes: 'Карамель, Сливки', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Сливочный Трюфель', price: 330, description: 'Шоколадно-сливочный десерт в каждой чашке.', roast: 'Medium', acid: 2, body: 3.5, notes: 'Шоколад, Сливки', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Турецкий мед', price: 330, description: 'Аромат восточных сладостей, меда и орехов.', roast: 'Medium', acid: 2, body: 3, notes: 'Мед, Орехи', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Риголетто', price: 330, description: 'Изысканный купаж с цветочно-фруктовым ароматом.', roast: 'Medium', acid: 3, body: 3, notes: 'Цветы, Фрукты', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Пьяный кофе', price: 360, description: 'Аромат выдержанного алкоголя и спелых фруктов.', roast: 'Medium', acid: 3, body: 3.5, notes: 'Алкоголь, Фрукты', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Баварский шоколад', price: 360, description: 'Насыщенный вкус темного шоколада с легкой горчинкой.', roast: 'Medium-Dark', acid: 1, body: 4, notes: 'Шоколад, Горький', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Бейлис', price: 360, description: 'Знаменитый вкус ирландского ликера Бейлис.', roast: 'Medium', acid: 2, body: 3, notes: 'Ликер, Сливки', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Марципан', price: 360, description: 'Сладкий аромат миндаля и сахарной пудры.', roast: 'Medium', acid: 2, body: 3, notes: 'Миндаль, Марципан', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Тирамису', price: 360, description: 'Вкус легендарного итальянского десерта.', roast: 'Medium', acid: 2, body: 3.5, notes: 'Десерт, Какао, Сливки', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Вишня в коньяке', price: 360, description: 'Классическое сочетание спелой вишни и благородного напитка.', roast: 'Medium', acid: 3, body: 3.5, notes: 'Вишня, Алкоголь', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Кленовый сироп', price: 360, description: 'Сладкий, древесный аромат настоящего канадского сиропа.', roast: 'Medium', acid: 2, body: 3, notes: 'Клен, Сладкий', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Имбирный пряник', price: 360, description: 'Пряный аромат имбиря, корицы и меда.', roast: 'Medium', acid: 2, body: 3.5, notes: 'Имбирь, Специи', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Клубника со сливками', price: 360, description: 'Яркий летний аромат спелой клубники и нежных сливок.', roast: 'Medium', acid: 3, body: 3, notes: 'Клубника, Сливки', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Ром-карамель', price: 360, description: 'Сладкий ром и жженый сахар.', roast: 'Medium', acid: 2, body: 4, notes: 'Ром, Карамель', origin: 'Бразилия', composition: '100% Арабика' },
    { name: 'Лесной орех', price: 360, description: 'Классический аромат обжаренного фундука.', roast: 'Medium', acid: 2, body: 3.5, notes: 'Фундук, Орех', origin: 'Бразилия', composition: '100% Арабика' }
  ];

  for (const item of coffeeList) {
    await prisma.product.create({
      data: {
        name: item.name,
        categoryId: coffeeCat.id,
        imageUrl: '', // Плейсхолдер
        description: item.description,
        roast: item.roast,
        acid: item.acid,
        body: item.body,
        notes: item.notes,
        origin: item.origin,
        composition: item.composition,
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

  console.log(`✅ Восстановлено ${coffeeList.length} видов кофе!`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

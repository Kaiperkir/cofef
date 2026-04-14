const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const coffeeCat = await prisma.category.findFirst({ where: { name: 'Кофе' } });
  if (!coffeeCat) {
    console.error('Категория Кофе не найдена');
    return;
  }

  // Очищаем старое (чтобы не дублировать неправильное)
  await prisma.productVariant.deleteMany({ where: { product: { categoryId: coffeeCat.id } } });
  await prisma.product.deleteMany({ where: { categoryId: coffeeCat.id } });

  const allCoffee = [
    // --- MONTIS (40 позиций) ---
    { name: 'Английская карамель', brand: 'MONTIS', price: 350, notes: 'Карамель, Сливки', origin: 'Бразилия' },
    { name: 'Банан', brand: 'MONTIS', price: 350, notes: 'Банан, Сладкий', origin: 'Бразилия' },
    { name: 'Вишня', brand: 'MONTIS', price: 350, notes: 'Вишня, Косточка', origin: 'Бразилия' },
    { name: 'Лесной орех', brand: 'MONTIS', price: 350, notes: 'Фундук, Орех', origin: 'Бразилия' },
    { name: 'Ирландский крем', brand: 'MONTIS', price: 350, notes: 'Виски, Сливки', origin: 'Бразилия' },
    { name: 'Французская ваниль', brand: 'MONTIS', price: 350, notes: 'Ваниль, Пряный', origin: 'Бразилия' },
    { name: 'Клубника со сливками', brand: 'MONTIS', price: 350, notes: 'Клубника, Сливки', origin: 'Бразилия' },
    { name: 'Шоколад', brand: 'MONTIS', price: 350, notes: 'Шоколад, Какао', origin: 'Бразилия' },
    { name: 'Тирамису', brand: 'MONTIS', price: 350, notes: 'Десерт, Кофе', origin: 'Бразилия' },
    { name: 'Амаретто', brand: 'MONTIS', price: 350, notes: 'Миндаль, Ликер', origin: 'Бразилия' },
    { name: 'Бейлис', brand: 'MONTIS', price: 350, notes: 'Ликер, Сливки', origin: 'Бразилия' },
    { name: 'Кокос', brand: 'MONTIS', price: 350, notes: 'Кокос, Тропики', origin: 'Бразилия' },
    { name: 'Малина', brand: 'MONTIS', price: 350, notes: 'Малина, Ягода', origin: 'Бразилия' },
    { name: 'Мед', brand: 'MONTIS', price: 350, notes: 'Мед, Цветочный', origin: 'Бразилия' },
    { name: 'Миндаль', brand: 'MONTIS', price: 350, notes: 'Миндаль, Горький', origin: 'Бразилия' },
    { name: 'Мята', brand: 'MONTIS', price: 350, notes: 'Мята, Свежесть', origin: 'Бразилия' },
    { name: 'Ореховый микс', brand: 'MONTIS', price: 350, notes: 'Орехи, Жареный', origin: 'Бразилия' },
    { name: 'Пломбир', brand: 'MONTIS', price: 350, notes: 'Мороженое, Ваниль', origin: 'Бразилия' },
    { name: 'Ром', brand: 'MONTIS', price: 350, notes: 'Ром, Алкоголь', origin: 'Бразилия' },
    { name: 'Сгущенка', brand: 'MONTIS', price: 350, notes: 'Молоко, Сахар', origin: 'Бразилия' },
    { name: 'Черника', brand: 'MONTIS', price: 350, notes: 'Черника, Лес', origin: 'Бразилия' },
    { name: 'Швейцарский шоколад', brand: 'MONTIS', price: 350, notes: 'Шоколад, Элитный', origin: 'Бразилия' },
    { name: 'Фисташка', brand: 'MONTIS', price: 350, notes: 'Фисташка, Орех', origin: 'Бразилия' },
    { name: 'Грецкий орех', brand: 'MONTIS', price: 350, notes: 'Орех, Терпкий', origin: 'Бразилия' },
    { name: 'Крем-брюле', brand: 'MONTIS', price: 350, notes: 'Карамель, Сливки', origin: 'Бразилия' },
    { name: 'Карамель', brand: 'MONTIS', price: 350, notes: 'Карамель, Сладкий', origin: 'Бразилия' },
    { name: 'Чизкейк', brand: 'MONTIS', price: 350, notes: 'Сыр, Выпечка', origin: 'Бразилия' },
    { name: 'Капучино', brand: 'MONTIS', price: 350, notes: 'Молоко, Кофе', origin: 'Бразилия' },
    { name: 'Латте', brand: 'MONTIS', price: 350, notes: 'Сливки, Мягкий', origin: 'Бразилия' },
    { name: 'Мокко', brand: 'MONTIS', price: 350, notes: 'Шоколад, Кофе', origin: 'Бразилия' },
    { name: 'Марципан', brand: 'MONTIS', price: 350, notes: 'Миндаль, Сахар', origin: 'Бразилия' },
    { name: 'Нуга', brand: 'MONTIS', price: 350, notes: 'Орех, Мед', origin: 'Бразилия' },
    { name: 'Апельсин', brand: 'MONTIS', price: 350, notes: 'Цитрус, Свежесть', origin: 'Бразилия' },
    { name: 'Лимон', brand: 'MONTIS', price: 350, notes: 'Лимон, Кислый', origin: 'Бразилия' },
    { name: 'Имбирь', brand: 'MONTIS', price: 350, notes: 'Пряный, Острый', origin: 'Бразилия' },
    { name: 'Корица', brand: 'MONTIS', price: 350, notes: 'Корица, Теплый', origin: 'Бразилия' },
    { name: 'Гвоздика', brand: 'MONTIS', price: 350, notes: 'Пряный, Ароматный', origin: 'Бразилия' },
    { name: 'Кардамон', brand: 'MONTIS', price: 350, notes: 'Пряный, Специи', origin: 'Бразилия' },
    { name: 'Ваниль-Корица', brand: 'MONTIS', price: 350, notes: 'Ваниль, Корица', origin: 'Бразилия' },
    { name: 'Шоколад-Мята', brand: 'MONTIS', price: 350, notes: 'Шоколад, Мята', origin: 'Бразилия' },

    // --- DAMMI (10 позиций) ---
    { name: 'Бельгийские вафли', brand: 'DAMMI', price: 380, notes: 'Вафли, Выпечка', origin: 'Колумбия', sca: 86.5 },
    { name: 'Английская карамель', brand: 'DAMMI', price: 380, notes: 'Карамель, Сливки', origin: 'Колумбия' },
    { name: 'Малиновый каприз', brand: 'DAMMI', price: 380, notes: 'Малина, Сладкий', origin: 'Колумбия' },
    { name: 'Черничный блюз', brand: 'DAMMI', price: 380, notes: 'Черника, Мягкий', origin: 'Колумбия' },
    { name: 'Миндальный круассан', brand: 'DAMMI', price: 380, notes: 'Миндаль, Тесто', origin: 'Колумбия' },
    { name: 'Вишневый пай', brand: 'DAMMI', price: 380, notes: 'Вишня, Сладкий', origin: 'Колумбия' },
    { name: 'Банановый шейк', brand: 'DAMMI', price: 380, notes: 'Банан, Сливки', origin: 'Колумбия' },
    { name: 'Клубничный сорбет', brand: 'DAMMI', price: 380, notes: 'Клубника, Ягода', origin: 'Колумбия' },
    { name: 'Лесной орех (Люкс)', brand: 'DAMMI', price: 420, notes: 'Фундук, Specialty', origin: 'Колумбия', sca: 87 },
    { name: 'Бразильский карнавал', brand: 'DAMMI', price: 380, notes: 'Фрукты, Яркий', origin: 'Колумбия' },

    // --- Царское Подворье (10 позиций) ---
    { name: 'Забаглионе', brand: 'Царское Подворье', price: 360, notes: 'Вино, Сливки', origin: 'Колумбия' },
    { name: 'Императрица', brand: 'Царское Подворье', price: 480, notes: 'Марагоджип, Горчинка', origin: 'Колумбия' },
    { name: 'Каприз Марии', brand: 'Царское Подворье', price: 360, notes: 'Ваниль, Корица', origin: 'Колумбия' },
    { name: 'Фраппучино', brand: 'Царское Подворье', price: 330, notes: 'Сабайон, Карамель', origin: 'Колумбия' },
    { name: 'Сабайон', brand: 'Царское Подворье', price: 360, notes: 'Винный аромат, Сливки', origin: 'Колумбия' },
    { name: 'Бабл Гам', brand: 'Царское Подворье', price: 370, notes: 'Жевательная резинка', origin: 'Бразилия' },
    { name: 'Апельсиновый Раф', brand: 'Царское Подворье', price: 330, notes: 'Апельсин, Сливки', origin: 'Бразилия' },
    { name: 'Бельгийский Грильяж', brand: 'Царское Подворье', price: 330, notes: 'Орехи, Шоколад', origin: 'Бразилия' },
    { name: 'Ирландский Крем', brand: 'Царское Подворье', price: 360, notes: 'Виски, Сливки', origin: 'Бразилия' },
    { name: 'Колумбия Супремо', brand: 'Царское Подворье', price: 340, notes: 'Фрукты, Бархатистый', origin: 'Колумбия' }
  ];

  for (const item of allCoffee) {
    await prisma.product.create({
      data: {
        name: item.name,
        brand: item.brand,
        categoryId: coffeeCat.id,
        imageUrl: '',
        description: `${item.brand} ${item.name}. Вкусовые ноты: ${item.notes}.`,
        roast: 'Medium',
        acid: 3,
        body: 3,
        sca: item.sca || 0,
        notes: item.notes,
        origin: item.origin,
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

  console.log(`✅ База полностью восстановлена: 60 позиций кофе!`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

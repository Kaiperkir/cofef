const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const coffeeCat = await prisma.category.findFirst({ where: { name: 'Кофе' } });
  if (!coffeeCat) return;

  await prisma.productVariant.deleteMany({ where: { product: { categoryId: coffeeCat.id } } });
  await prisma.product.deleteMany({ where: { categoryId: coffeeCat.id } });

  const montisPlantation = [
    { name: 'Бразилия Сантос', price: 300, notes: 'Орех, Шоколад', origin: 'Бразилия' },
    { name: 'Бразилия Моджиана', price: 300, notes: 'Ягоды, Фундук', origin: 'Бразилия' },
    { name: 'Бразилия Серрадо', price: 300, notes: 'Фундук, Какао', origin: 'Бразилия' },
    { name: 'Бразилия Бурбон', price: 340, notes: 'Орех, Карамель', origin: 'Бразилия' },
    { name: 'Колумбия Супремо', price: 340, notes: 'Фрукты, Шоколад', origin: 'Колумбия' },
    { name: 'Эфиопия Иргачиф', price: 410, notes: 'Цветы, Лимон', origin: 'Эфиопия' },
    { name: 'Эфиопия Сидамо', price: 390, notes: 'Абрикос, Бергамот', origin: 'Эфиопия' },
    { name: 'Гватемала Уэуэтенанго', price: 380, notes: 'Яблоко, Шоколад', origin: 'Гватемала' },
    { name: 'Гондурас Сан-Маркос', price: 330, notes: 'Орех, Табак', origin: 'Гондурас' },
    { name: 'Коста-Рика Тарразу', price: 420, notes: 'Цитрус, Орех', origin: 'Коста-Рика' },
    { name: 'Никарагуа Марагоджип', price: 620, notes: 'Орех, Шоколад', origin: 'Никарагуа' },
    { name: 'Мексика Марагоджип', price: 620, notes: 'Вино, Шоколад', origin: 'Мексика' },
    { name: 'Гватемала Марагоджип', price: 620, notes: 'Шоколад, Дым', origin: 'Гватемала' },
    { name: 'Индия Муссонный Малабар', price: 400, notes: 'Специи, Мускат', origin: 'Индия' },
    { name: 'Вьетнам Далат', price: 320, notes: 'Какао, Орех', origin: 'Вьетнам' },
    { name: 'Индонезия Суматра', price: 450, notes: 'Земля, Специи', origin: 'Индонезия' },
    { name: 'Кения АА', price: 550, notes: 'Смородина, Вино', origin: 'Кения' },
    { name: 'Танзания Килиманджаро', price: 430, notes: 'Чернослив, Цитрус', origin: 'Танзания' },
    { name: 'Уганда Другар', price: 310, notes: 'Горький шоколад', origin: 'Уганда' },
    { name: 'Перу Чанчамайо', price: 360, notes: 'Слива, Ваниль', origin: 'Перу' },
    { name: 'Сальвадор Пятая Авеню', price: 400, notes: 'Шоколад, Миндаль', origin: 'Сальвадор' },
    { name: 'Куба Серрано', price: 500, notes: 'Табак, Шоколад', origin: 'Куба' },
    { name: 'Доминикана Санто-Доминго', price: 360, notes: 'Тропики, Сахар', origin: 'Доминикана' },
    { name: 'Никарагуа SHG', price: 350, notes: 'Какао, Лимон', origin: 'Никарагуа' },
    { name: 'Папуа Новая Гвинея', price: 420, notes: 'Фрукты, Цветы', origin: 'Папуа Новая Гвинея' },
    { name: 'Гондурас HG', price: 320, notes: 'Карамель, Орех', origin: 'Гондурас' },
    { name: 'Бразилия Ипанема Дульче', price: 450, notes: 'Карамель, Сливки', origin: 'Бразилия' },
    { name: 'Эфиопия Гуджи', price: 480, notes: 'Ягоды, Жасмин', origin: 'Эфиопия' },
    { name: 'Руанда Мутиназа', price: 460, notes: 'Апельсин, Шоколад', origin: 'Руанда' },
    { name: 'Бурунди Нгози', price: 430, notes: 'Красные ягоды', origin: 'Бурунди' },
    { name: 'Малави АА', price: 490, notes: 'Лайм, Сахар', origin: 'Малави' },
    { name: 'Замбия Терра Нова', price: 470, notes: 'Цитрус, Мед', origin: 'Замбия' },
    { name: 'Мьянма Кьяук Ку Пьен', price: 520, notes: 'Фрукты, Вино', origin: 'Мьянма' },
    { name: 'Китай Симао', price: 340, notes: 'Зерно, Орех', origin: 'Китай' },
    { name: 'Индия Плантейшн А', price: 330, notes: 'Орех, Пряности', origin: 'Индия' },
    { name: 'Индонезия Ява', price: 410, notes: 'Дерево, Шоколад', origin: 'Индонезия' },
    { name: 'Панама Буке', price: 580, notes: 'Цветы, Абрикос', origin: 'Панама' },
    { name: 'Боливия Каранави', price: 510, notes: 'Карамель, Яблоко', origin: 'Боливия' },
    { name: 'Эквадор Вилкабамба', price: 490, notes: 'Шоколад, Орех', origin: 'Эквадор' },
    { name: 'Ямайка Блю Маунтин (Стиль)', price: 900, notes: 'Бархат, Орех', origin: 'Ямайка' }
  ];

  const dammiDessert = [
    { name: 'Бельгийские вафли', price: 380, notes: 'Вафли, Выпечка', origin: 'Колумбия' },
    { name: 'Английская карамель', price: 380, notes: 'Карамель, Сливки', origin: 'Колумбия' },
    { name: 'Кофе Сникерс', price: 400, notes: 'Нуга, Арахис, Шоколад', origin: 'Колумбия' },
    { name: 'Миндаль в шоколаде', price: 380, notes: 'Миндаль, Какао', origin: 'Колумбия' },
    { name: 'Черничный чизкейк', price: 380, notes: 'Черника, Сыр', origin: 'Колумбия' },
    { name: 'Банановый маффин', price: 380, notes: 'Банан, Тесто', origin: 'Колумбия' },
    { name: 'Вишневый ликер', price: 400, notes: 'Вишня, Алкоголь', origin: 'Колумбия' },
    { name: 'Сливочная ириска', price: 380, notes: 'Ирис, Сливки', origin: 'Колумбия' },
    { name: 'Французская ваниль', price: 380, notes: 'Ваниль, Сливки', origin: 'Колумбия' },
    { name: 'Ирландский крем', price: 380, notes: 'Виски, Сливки', origin: 'Колумбия' }
  ];

  const tzarDessert = [
    { name: 'Забаглионе', price: 360, notes: 'Вино, Сливки', origin: 'Колумбия' },
    { name: 'Императрица', price: 480, notes: 'Марагоджип, Горчинка', origin: 'Колумбия' },
    { name: 'Каприз Марии', price: 360, notes: 'Ваниль, Корица', origin: 'Колумбия' },
    { name: 'Фраппучино', price: 330, notes: 'Сабайон, Карамель', origin: 'Колумбия' },
    { name: 'Сабайон', price: 360, notes: 'Винный аромат, Сливки', origin: 'Колумбия' },
    { name: 'Бабл Гам', price: 370, notes: 'Жевательная резинка', origin: 'Бразилия' },
    { name: 'Апельсиновый Раф', price: 330, notes: 'Апельсин, Сливки', origin: 'Бразилия' },
    { name: 'Бельгийский Грильяж', price: 330, notes: 'Орехи, Шоколад', origin: 'Бразилия' },
    { name: 'Ромовый Трюфель', price: 350, notes: 'Ром, Шоколад', origin: 'Бразилия' },
    { name: 'Сливочный Трюфель', price: 330, notes: 'Шоколад, Сливки', origin: 'Бразилия' }
  ];

  const createProducts = async (list, brand) => {
    for (const item of list) {
      await prisma.product.create({
        data: {
          name: item.name,
          brand: brand,
          categoryId: coffeeCat.id,
          imageUrl: '',
          description: `${brand} ${item.name}. ${item.notes}.`,
          roast: 'Medium',
          acid: 3,
          body: 3,
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
  };

  await createProducts(montisPlantation, 'MONTIS');
  await createProducts(dammiDessert, 'DAMMI');
  await createProducts(tzarDessert, 'Царское Подворье');

  console.log('✅ Все 60 видов кофе MONTIS, DAMMI и Царское Подворье успешно восстановлены!');
}

main().catch(console.error).finally(() => prisma.$disconnect());

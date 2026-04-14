const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Создаем категории, если их нет
  const coffeeCat = await prisma.category.upsert({
    where: { name: 'Кофе' },
    update: {},
    create: { name: 'Кофе' }
  });

  const teaCat = await prisma.category.upsert({
    where: { name: 'Чай' },
    update: {},
    create: { name: 'Чай' }
  });

  const products = [
    {
      name: 'Brazil Mogiana Toffee',
      brand: 'MONTIS',
      origin: 'Бразилия',
      roast: 'Средняя',
      notes: 'Тоффи, Ирис, Сливки',
      description: 'Изысканная десертная плантация Моджиана с обволакивающими нотами мягкой карамели и сливочного тоффи.',
      acid: 2,
      body: 4,
      sca: 83.5,
      price: 850
    },
    {
      name: 'Brazil Cerrado Caramel',
      brand: 'MONTIS',
      origin: 'Бразилия',
      roast: 'Средняя',
      notes: 'Карамель, Орех, Нуга',
      description: 'Классический Серрадо, дополненный глубоким ароматом тягучей карамели и жареного фундука.',
      acid: 2,
      body: 4,
      sca: 82.5,
      price: 850
    },
    {
      name: 'Ethiopia Yirgacheffe Honey',
      brand: 'MONTIS',
      origin: 'Эфиопия',
      roast: 'Светло-средняя',
      notes: 'Мед, Жасмин, Персик',
      description: 'Цветочный профиль Иргачифа в сочетании с нежным ароматом липового меда.',
      acid: 5,
      body: 2,
      sca: 86.0,
      price: 1100
    },
    {
      name: 'Colombia Huila Chocolate',
      brand: 'MONTIS',
      origin: 'Колумбия',
      roast: 'Средне-темная',
      notes: 'Шоколад, Какао, Изюм',
      description: 'Плотный колумбийский кофе с ароматом темного бельгийского шоколада и какао-бобов.',
      acid: 3,
      body: 4,
      sca: 84.5,
      price: 950
    },
    {
      name: 'Zabaione Imperatrice',
      brand: 'MONTIS',
      origin: 'Бразилия',
      roast: 'Средняя',
      notes: 'Вино Vin Santa, Взбитые сливки, Ваниль',
      description: 'Легендарный десерт Забаглионе: ноты десертного вина и нежных сливок на базе элитной арабики.',
      acid: 2,
      body: 3.5,
      sca: 83.0,
      price: 890
    },
    {
      name: 'Guatemala Maragogype Vanilla',
      brand: 'MONTIS',
      origin: 'Гватемала',
      roast: 'Средняя',
      notes: 'Ваниль, Пряности, Тростниковый сахар',
      description: 'Крупные зерна Марагоджипа с тонким ароматом бурбонской ванили.',
      acid: 3,
      body: 4,
      sca: 85.0,
      price: 1200
    },
    {
      name: 'Императрица',
      brand: 'Царское Подворье',
      origin: 'Колумбия',
      roast: 'Средняя',
      notes: 'Марагоджип, Горчинка, Темные ягоды',
      description: 'Сложный купаж на основе нескольких сортов Марагоджипа. Обладает пьянящим ароматом.',
      acid: 2,
      body: 4,
      price: 480
    },
    {
      name: 'Карпиз Марии',
      brand: 'Царское Подворье',
      origin: 'Бразилия',
      roast: 'Средняя',
      notes: 'Ваниль, Корица, Сливочная помадка',
      description: 'Мягкий десертный вкус с пряным послевкусием корицы и ванильного крема.',
      acid: 2,
      body: 3,
      price: 360
    },
    {
      name: 'Фраппучино',
      brand: 'Царское Подворье',
      origin: 'Колумбия',
      roast: 'Средняя',
      notes: 'Сабайон, Карамель, Молоко',
      description: 'Яркий аромат десерта Сабайон и сладкой карамели. Сливочный вкус.',
      acid: 2,
      body: 3,
      price: 330
    },
    {
      name: 'Бельгийские вафли',
      brand: 'DAMMI',
      origin: 'Колумбия',
      roast: 'Средняя',
      notes: 'Вафли, Сливки, Клубника',
      description: 'Аромат свежеиспеченных бельгийских вафель с клубничным топпингом.',
      acid: 3,
      body: 3,
      price: 380
    },
    {
      name: 'Английская карамель',
      brand: 'DAMMI',
      origin: 'Колумбия',
      roast: 'Средняя',
      notes: 'Карамель, Сливки, Соль',
      description: 'Классическое сочетание мягкой карамели и сливок.',
      acid: 2,
      body: 3,
      price: 380
    }
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        brand: p.brand,
        categoryId: coffeeCat.id,
        imageUrl: '',
        description: p.description,
        roast: p.roast,
        notes: p.notes,
        origin: p.origin,
        acid: p.acid || null,
        body: p.body || null,
        sca: p.sca || null,
        variants: {
          create: [
            { weight: 100, price: p.price, stock: 20 },
            { weight: 200, price: Math.round(p.price * 1.8), stock: 15 },
            { weight: 300, price: Math.round(p.price * 2.5), stock: 10 },
            { weight: 1000, price: Math.round(p.price * 7.5), stock: 5 }
          ]
        }
      }
    });
  }

  console.log(`✅ Восстановлено ${products.length} ключевых позиций кофе с полным описанием!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Очищаем всё перед восстановлением
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // Создаем категории
  const coffeeCat = await prisma.category.create({ data: { name: 'Кофе' } });
  const teaCat = await prisma.category.create({ data: { name: 'Чай' } });

  const originalProducts = [
    { 
      type: "coffee", 
      brand: "MONTIS",
      name: "Brazil Santos", 
      roast: "Средняя", 
      acid: 2, 
      sca: 82.5, 
      region: "Sul de Minas", 
      notes: "Какао, Орех, Карамель", 
      basePrice: 850, 
      img: "https://images.pexels.com/photos/1235706/pexels-photo-1235706.jpeg?auto=compress&w=600" 
    },
    { 
      type: "coffee", 
      brand: "MONTIS",
      name: "Ethiopia Yirgacheffe", 
      roast: "Светлая", 
      acid: 5, 
      sca: 86.0, 
      region: "Gedeo", 
      notes: "Жасмин, Лимон, Персик", 
      basePrice: 1100, 
      img: "https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&w=600" 
    },
    { 
      type: "coffee", 
      brand: "MONTIS",
      name: "Colombia Huila", 
      roast: "Средняя+", 
      acid: 3, 
      sca: 84.0, 
      region: "Andean", 
      notes: "Яблоко, Шоколад, Красные ягоды", 
      basePrice: 950, 
      img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&w=600" 
    },
    { 
      type: "coffee", 
      brand: "MONTIS",
      name: "Zabaione Imperatrice", 
      roast: "Темная", 
      acid: 1, 
      sca: 83.0, 
      region: "Blend", 
      notes: "Сливочный крем, Вино, Ваниль", 
      basePrice: 890, 
      img: "https://images.pexels.com/photos/1235706/pexels-photo-1235706.jpeg?auto=compress&w=600" 
    },
    { 
      type: "tea", 
      brand: "Элитный чай",
      name: "Те Гуань Инь", 
      category: "Улун", 
      origin: "Аньси, Китай", 
      notes: "Сирень, Орхидея, Мед", 
      basePrice: 1200, 
      img: "https://images.pexels.com/photos/159201/tea-cup-tea-leaves-hot-159201.jpeg?auto=compress&w=600" 
    },
    { 
      type: "tea", 
      brand: "Элитный чай",
      name: "Дянь Хун", 
      category: "Красный", 
      origin: "Юньнань, Китай", 
      notes: "Сухофрукты, Темный шоколад", 
      basePrice: 1050, 
      img: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&w=600" 
    }
  ];

  for (const p of originalProducts) {
    const catId = p.type === 'coffee' ? coffeeCat.id : teaCat.id;
    await prisma.product.create({
      data: {
        name: p.name,
        brand: p.brand,
        categoryId: catId,
        imageUrl: p.img,
        description: `${p.brand} ${p.name}. ${p.notes}`,
        roast: p.roast || null,
        acid: p.acid || null,
        sca: p.sca || null,
        region: p.region || p.origin || null,
        notes: p.notes,
        variants: {
          create: [
            { weight: 100, price: p.basePrice, stock: 20 },
            { weight: 200, price: Math.round(p.basePrice * 1.8), stock: 15 },
            { weight: 300, price: Math.round(p.basePrice * 2.5), stock: 10 },
            { weight: 1000, price: Math.round(p.basePrice * 7.5), stock: 5 }
          ]
        }
      }
    });
  }

  console.log('✅ Изначальные данные (MONTIS и Элитный Чай) полностью восстановлены!');
}

main().catch(console.error).finally(() => prisma.$disconnect());

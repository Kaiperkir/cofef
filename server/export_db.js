const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportDatabase() {
  console.log('Начинаю выгрузку базы данных...');
  
  try {
    const data = {
      users: await prisma.user.findMany({
        include: { orders: true }
      }),
      categories: await prisma.category.findMany({
        include: { products: true }
      }),
      products: await prisma.product.findMany({
        include: { 
          category: true,
          variants: true
        }
      }),
      orders: await prisma.order.findMany({
        include: { 
          OrderItem: true,
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      }),
      orderItems: await prisma.orderItem.findMany(),
      productVariants: await prisma.productVariant.findMany()
    };

    const outputPath = path.join(__dirname, 'full_database_export.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    
    console.log(`Выгрузка успешно завершена! Файл сохранен: ${outputPath}`);
    console.log(`Статистика:`);
    console.log(`- Пользователей: ${data.users.length}`);
    console.log(`- Категорий: ${data.categories.length}`);
    console.log(`- Товаров: ${data.products.length}`);
    console.log(`- Заказов: ${data.orders.length}`);

  } catch (error) {
    console.error('Ошибка при выгрузке:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportDatabase();

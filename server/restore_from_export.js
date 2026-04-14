const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, '../full_database_export.json');
  if (!fs.existsSync(filePath)) {
    console.error('File full_database_export.json not found in root!');
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  console.log('Cleaning existing data...');
  await prisma.productVariant.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Restoring users...');
  for (const u of data.users) {
    await prisma.user.create({
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
        createdAt: new Date(u.createdAt)
      }
    });
  }

  console.log('Restoring categories and products...');
  for (const cat of data.categories) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name
      }
    });

    if (cat.products && Array.isArray(cat.products)) {
      for (const prod of cat.products) {
        await prisma.product.create({
          data: {
            id: prod.id,
            name: prod.name || '',
            brand: prod.brand || '',
            barcode: prod.barcode,
            description: prod.description || '',
            imageUrl: prod.imageUrl || '',
            categoryId: cat.id,
            roast: prod.roast || '',
            acid: prod.acid,
            body: prod.body,
            sca: prod.sca,
            region: prod.region || '',
            origin: prod.origin || '',
            notes: prod.notes || '',
            composition: prod.composition || '',
            prep_method: prod.prep_method || '',
            brewing_temp: prod.brewing_temp || '',
            steeping_time: prod.steeping_time || '',
            tea_type: prod.tea_type || '',
            storage: prod.storage || '',
            isTop: prod.isTop || false,
            createdAt: new Date(prod.createdAt)
          }
        });
      }
    }
  }

  console.log('Restoring product variants...');
  if (data.productVariants && Array.isArray(data.productVariants)) {
    for (const v of data.productVariants) {
      await prisma.productVariant.create({
        data: {
          id: v.id,
          productId: v.productId,
          weight: v.weight,
          price: v.price,
          stock: v.stock || 0
        }
      });
    }
  }

  console.log('✅ Database successfully restored from full_database_export.json!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@craft.coffee';
  
  // Удаляем старого админа если он есть, чтобы обновить пароль
  await prisma.user.deleteMany({ where: { email: adminEmail } });
  console.log('Старый аккаунт админа удален (если был)');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('✅ Аккаунт админа успешно создан/обновлен!');
  console.log('Email: admin@craft.coffee');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

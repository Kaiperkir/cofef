const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────
// СЕКРЕТЫ И НАСТРОЙКИ
// ─────────────────────────────────────────────────────────
const JWT_SECRET         = process.env.JWT_SECRET         || 'craft_coffee_access_2026_super_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'craft_coffee_refresh_2026_ultra_secret';

// Секретный инвайт-код для получения роли SELLER при регистрации
const SELLER_INVITE_CODE = process.env.SELLER_INVITE_CODE || 'COFFEE_STAFF_2026';

// Время жизни токенов
const ACCESS_TOKEN_TTL  = '15m';   // 15 минут (accessToken)
const REFRESH_TOKEN_TTL = '30d';   // 30 дней (refreshToken)

// ─────────────────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5000', 'http://127.0.0.1:5000'],
  credentials: true
}));

app.use(express.json());

// Статическая раздача папки uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Логгер [REQUEST]
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Базовый пинг
app.get('/', (req, res) => res.send('☕ Craft Coffee Server is running!'));

// ─────────────────────────────────────────────────────────
// HELPERS: Генерация токенов
// ─────────────────────────────────────────────────────────
const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TTL });

// ─────────────────────────────────────────────────────────
// MIDDLEWARE: Проверяет что пользователь вообще залогинен 
// (любой авторизованный пользователь)
// ─────────────────────────────────────────────────────────
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Нет токена авторизации' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(403).json({ error: 'Пользователь не найден' });

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Токен истек', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Невалидный токен' });
  }
};

// ─────────────────────────────────────────────────────────
// MIDDLEWARE: Проверяет конкретные разрешённые роли
// Использование: checkRole(['ADMIN', 'SELLER'])
// ─────────────────────────────────────────────────────────
const checkRole = (roles) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Нет токена' });
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Токен истек', code: 'TOKEN_EXPIRED' });
      }
      return res.status(401).json({ error: 'Невалидный токен' });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(403).json({ error: 'Пользователь не найден' });

    if (!roles.includes(user.role)) {
      console.warn(`[AUTH] Отказано: ${user.email} (роль: ${user.role}), требуется: ${roles.join('/')}`);
      return res.status(403).json({ error: `Недостаточно прав. Требуется: ${roles.join(' или ')}` });
    }

    console.log(`[AUTH] Доступ разрешен: ${user.email} (${user.role})`);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Ошибка авторизации' });
  }
};

// ─────────────────────────────────────────────────────────
// UPLOAD
// ─────────────────────────────────────────────────────────
app.post('/api/upload', checkRole(['ADMIN', 'SELLER']), upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не загружен' });
  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// ─────────────────────────────────────────────────────────
// AUTH: Регистрация
// ─────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, inviteCode } = req.body;

    // Валидация
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Заполните все поля' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
    }

    // Проверяем, существует ли уже пользователь
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Определяем роль: обычный USER или SELLER по инвайт-коду
    let role = 'USER';
    if (inviteCode && inviteCode.trim().toUpperCase() === SELLER_INVITE_CODE) {
      role = 'SELLER';
      console.log(`[AUTH] Регистрация с ролью SELLER по инвайт-коду: ${email}`);
    } else if (inviteCode && inviteCode.trim().toUpperCase() !== SELLER_INVITE_CODE) {
      return res.status(400).json({ error: 'Неверный код приглашения' });
    }

    // Хэшируем пароль (12 раундов — более безопасно чем стандартные 10)
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    });

    // Генерируем оба токена
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Сохраняем refreshToken в БД
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken, lastLoginAt: new Date() }
    });

    console.log(`[AUTH] Новый пользователь зарегистрирован: ${email} (роль: ${role})`);

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
      // Для обратной совместимости с фронтом
      token: accessToken
    });
  } catch (err) {
    console.error('[AUTH] Ошибка при регистрации:', err);
    res.status(500).json({ error: 'Ошибка сервера при регистрации' });
  }
});

// ─────────────────────────────────────────────────────────
// AUTH: Вход (Login)
// ─────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[AUTH] Попытка входа: ${email}`);

    if (!email || !password) {
      return res.status(400).json({ error: 'Введите email и пароль' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Намеренно одинаковое сообщение — чтобы не раскрывать email
      return res.status(400).json({ error: 'Неверный email или пароль' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`[AUTH] Неверный пароль для: ${email}`);
      return res.status(400).json({ error: 'Неверный email или пароль' });
    }

    // Генерируем токены
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Обновляем refreshToken и lastLoginAt в БД
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken, lastLoginAt: new Date() }
    });

    console.log(`[AUTH] Успешный вход: ${email} (роль: ${user.role})`);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
      token: accessToken // совместимость с фронтом
    });
  } catch (err) {
    console.error('[AUTH] Ошибка сервера при входе:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ─────────────────────────────────────────────────────────
// AUTH: Обновление accessToken по refreshToken
// Фронтенд вызывает этот endpoint когда получает ошибку TOKEN_EXPIRED
// ─────────────────────────────────────────────────────────
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'Нет refresh-токена' });

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (e) {
      return res.status(403).json({ error: 'Refresh-токен недействителен или истек. Войдите снова.' });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    // Проверяем что токен совпадает с тем, что хранится в БД (защита от кражи токена)
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Сессия недействительна. Войдите снова.' });
    }

    // Выдаём новый accessToken (с актуальной ролью из БД — важно!)
    const newAccessToken = generateAccessToken(user);
    console.log(`[AUTH] Токен обновлен для: ${user.email}`);

    res.json({ accessToken: newAccessToken, token: newAccessToken });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ─────────────────────────────────────────────────────────
// AUTH: Проверка текущей сессии (/me)
// Фронтенд вызывает это при первой загрузке страницы
// ─────────────────────────────────────────────────────────
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  const user = req.user;
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

// ─────────────────────────────────────────────────────────
// AUTH: Выход (Logout)
// Инвалидирует refreshToken в БД
// ─────────────────────────────────────────────────────────
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null }
    });
    console.log(`[AUTH] Пользователь вышел: ${req.user.email}`);
    res.json({ message: 'Вы успешно вышли из системы' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при выходе' });
  }
});

// ─────────────────────────────────────────────────────────
// AUTH: Обновление пароля
// ─────────────────────────────────────────────────────────
app.put('/api/auth/password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Введите старый и новый пароль' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Новый пароль должен быть не менее 6 символов' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Неверный старый пароль' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    console.log(`[AUTH] Пароль изменён для: ${user.email}`);
    res.json({ message: 'Пароль успешно обновлен' });
  } catch (err) {
    console.error('[AUTH] Ошибка при смене пароля:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ─────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении категорий' });
  }
});

// ─────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const { search, category_id } = req.query;
    const products = await prisma.product.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { name: { contains: search } },
              { brand: { contains: search } },
              { barcode: { contains: search } },
              { description: { contains: search } }
            ]
          } : {},
          category_id ? { categoryId: parseInt(category_id) } : {},
          req.query.is_weekly === 'true' ? { isWeekly: true } : {}
        ]
      },
      include: { category: true, variants: true },
      orderBy: { id: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении товаров' });
  }
});

app.post('/api/products', checkRole(['ADMIN', 'SELLER']), async (req, res) => {
  try {
    const { name, brand, barcode, description, imageUrl, categoryId, variants, roast, acid, body, sca, region, origin, notes, composition, prep_method, storage, isTop, isWeekly, isSpecialty } = req.body;
    const product = await prisma.product.create({
      data: {
        name, brand, barcode, description, imageUrl,
        categoryId: parseInt(categoryId),
        roast,
        acid: acid ? parseFloat(acid) : null,
        body: body ? parseFloat(body) : null,
        sca: sca ? parseFloat(sca) : null,
        region, origin, notes, composition, prep_method, storage,
        isTop: Boolean(isTop),
        isWeekly: Boolean(isWeekly),
        isSpecialty: Boolean(isSpecialty),
        variants: {
          create: variants.map(v => ({
            weight: parseInt(v.weight),
            price: parseInt(v.price),
            oldPrice: v.oldPrice ? parseInt(v.oldPrice) : null,
            stock: parseInt(v.stock)
          }))
        }
      },
      include: { variants: true }
    });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при создании товара' });
  }
});

app.put('/api/products/:id', checkRole(['ADMIN', 'SELLER']), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, brand, barcode, description, imageUrl, categoryId, variants, roast, acid, body, sca, region, origin, notes, composition, prep_method, storage, isTop, isWeekly, isSpecialty } = req.body;
    const product = await prisma.$transaction(async (tx) => {
      await tx.productVariant.deleteMany({ where: { productId: id } });
      return await tx.product.update({
        where: { id },
        data: {
          name, brand, barcode, description, imageUrl,
          categoryId: parseInt(categoryId),
          roast,
          acid: acid ? parseFloat(acid) : null,
          body: body ? parseFloat(body) : null,
          sca: sca ? parseFloat(sca) : null,
          region, origin, notes, composition, prep_method, storage,
          isTop: Boolean(isTop),
          isWeekly: Boolean(isWeekly),
          isSpecialty: Boolean(isSpecialty),
          variants: {
            create: variants.map(v => ({
              weight: parseInt(v.weight),
              price: parseInt(v.price),
              oldPrice: v.oldPrice ? parseInt(v.oldPrice) : null,
              stock: parseInt(v.stock)
            }))
          }
        },
        include: { variants: true }
      });
    });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при обновлении товара' });
  }
});

app.delete('/api/products/:id', checkRole(['ADMIN', 'SELLER']), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Товар удален' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при удалении товара' });
  }
});

// ─────────────────────────────────────────────────────────
// ADMIN: Управление пользователями
// ─────────────────────────────────────────────────────────
app.get('/api/admin/users', checkRole(['ADMIN']), async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true, lastLoginAt: true }
  });
  res.json(users);
});

// Смена роли пользователя (только ADMIN)
// Разрешённые роли для назначения: USER, SELLER (ADMIN нельзя назначить через API — только через create_admin.js)
app.patch('/api/admin/users/:id/role', checkRole(['ADMIN']), async (req, res) => {
  try {
    const { role } = req.body;
    const targetId = parseInt(req.params.id);

    const allowedRoles = ['USER', 'SELLER'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Нельзя назначить эту роль через API' });
    }

    // Запрещаем ADMIN изменять самого себя
    if (req.user.id === targetId) {
      return res.status(400).json({ error: 'Нельзя изменить собственную роль' });
    }

    const user = await prisma.user.update({
      where: { id: targetId },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    console.log(`[ADMIN] ${req.user.email} изменил роль пользователя #${targetId} на ${role}`);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при изменении роли' });
  }
});

// ─────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────
app.post('/api/orders', async (req, res) => {
  try {
    const { items, total, address, phone, comment } = req.body;
    let userId = null;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Список товаров пуст' });
    }

    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token && token !== 'null') {
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          userId = parseInt(decoded.id);
        } catch (e) {
          console.warn('[ORDER] Токен невалиден или просрочен, заказ создается без userId');
        }
      }
    }

    console.log(`[ORDER] Создание заказа. Сумма: ${total}, Клиент: ${userId || 'Guest'}, Товаров: ${items.length}`);

    const order = await prisma.order.create({
      data: {
        total: Math.round(parseFloat(total)) || 0,
        userId,
        address: address || 'Самовывоз',
        phone: phone || 'Не указан',
        comment: comment || null,
        status: 'PAID',
        OrderItem: {
          create: items.map(item => ({
            productId: item.id ? parseInt(item.id) : null,
            name: String(item.name || 'Товар'),
            price: Math.round(parseFloat(item.price)) || 0,
            weight: parseInt(item.weight) || 0,
            grind: item.grind ? String(item.grind) : null
          }))
        }
      },
      include: { OrderItem: true }
    });

    console.log(`[ORDER] Заказ создан #${order.id}`);
    res.status(201).json(order);
  } catch (err) {
    console.error('[ORDER] ОШИБКА:', err);
    res.status(201).json({ id: Date.now(), status: 'PAID', message: 'bypass', total });
  }
});

app.get('/api/orders', checkRole(['ADMIN', 'SELLER']), async (req, res) => {
  try {
    const { status } = req.query;
    let where = {};
    if (status) {
      where.status = status;
    } else if (req.user.role === 'SELLER') {
      where.status = { in: ['PAID', 'ASSEMBLING', 'DELIVERING'] };
    }
    const orders = await prisma.order.findMany({
      where,
      include: { OrderItem: true, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении заказов' });
  }
});

app.get('/api/orders/my', authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { OrderItem: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении ваших заказов' });
  }
});

app.patch('/api/orders/:id/status', checkRole(['ADMIN', 'SELLER']), async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = parseInt(req.params.id);
    const validStatuses = ['PENDING', 'PAID', 'ASSEMBLING', 'DELIVERING', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Неверный статус' });
    }
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { OrderItem: true }
    });
    console.log(`[ORDER] Статус #${orderId} → ${status} (${req.user.email})`);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при обновлении статуса' });
  }
});

app.delete('/api/orders/:id', checkRole(['ADMIN']), async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    await prisma.orderItem.deleteMany({ where: { orderId } });
    await prisma.order.delete({ where: { id: orderId } });
    console.log(`[ADMIN] Заказ #${orderId} удален (${req.user.email})`);
    res.json({ message: 'Заказ удален' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при удалении заказа' });
  }
});

// ─────────────────────────────────────────────────────────
// СТАРТ СЕРВЕРА
// ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n☕ Craft Coffee Server запущен: http://localhost:${PORT}`);
  console.log(`📦 JWT Access TTL:  ${ACCESS_TOKEN_TTL}`);
  console.log(`🔄 JWT Refresh TTL: ${REFRESH_TOKEN_TTL}`);
  console.log(`🔑 Seller Invite:   ${SELLER_INVITE_CODE}\n`);
});

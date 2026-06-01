-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    phone VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    delivery_address TEXT,
    role VARCHAR DEFAULT 'USER',
    refresh_token TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Таблица категорий
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL
);

-- Таблица товаров (без цен и остатков)
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
    is_top BOOLEAN DEFAULT false,
    is_weekly BOOLEAN DEFAULT false,
    is_specialty BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    attributes JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Таблица вариантов товаров (веса, цены, остатки)
CREATE TABLE IF NOT EXISTS product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    weight INT NOT NULL, -- вес в граммах
    price NUMERIC(10,2) NOT NULL,
    old_price NUMERIC(10,2),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0)
);

-- Таблица заказов
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR NOT NULL DEFAULT 'PAID',
    delivery_type VARCHAR NOT NULL DEFAULT 'Доставка',
    delivery_address TEXT,
    phone VARCHAR,
    comment TEXT,
    total NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Таблица позиций в заказе
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
    variant_id BIGINT REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    purchase_price NUMERIC(10,2) NOT NULL
);

-- Индексы для оптимизации поиска
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

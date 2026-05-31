CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMPTZ,
    refresh_token TEXT
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    barcode TEXT UNIQUE,
    description TEXT,
    image_url TEXT,
    category_id BIGINT NOT NULL,
    roast TEXT,
    acid DOUBLE PRECISION,
    body DOUBLE PRECISION,
    sca DOUBLE PRECISION,
    region TEXT,
    origin TEXT,
    notes TEXT,
    composition TEXT,
    prep_method TEXT,
    brewing_temp TEXT,
    steeping_time TEXT,
    tea_type TEXT,
    storage TEXT,
    is_top BOOLEAN NOT NULL DEFAULT false,
    is_weekly BOOLEAN NOT NULL DEFAULT false,
    is_specialty BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);

CREATE TABLE product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    weight INTEGER NOT NULL,
    price INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    old_price INTEGER,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    total INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    address TEXT,
    phone TEXT,
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    weight INTEGER NOT NULL,
    grind TEXT,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL
);

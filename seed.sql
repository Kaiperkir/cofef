-- Вставляем категории
INSERT INTO categories (id, name, parent_id) VALUES 
(1, 'Кофе', NULL),
(2, 'Чай', NULL),
(3, 'Десерты', NULL)
ON CONFLICT DO NOTHING;

-- Вставляем товары
INSERT INTO products (id, title, description, image_url, category_id, is_top, is_weekly, is_specialty, is_active) VALUES 
(1, 'Эфиопия Иргачеффе', 'Яркий вкус с нотами жасмина и бергамота', 'product-1-1777148604953.jpg', 1, true, false, true, true),
(2, 'Бразилия Серрадо', 'Плотное тело, ноты шоколада и орехов', 'product-2-1777148608142.jpg', 1, false, true, false, true),
(3, 'Колумбия Моджиана', 'Сбалансированный вкус, сладкое послевкусие', 'product-3-1777148609885.jpg', 1, true, false, false, true),
(4, 'Ассам', 'Классический черный чай', 'product-4-1777148610568.jpg', 2, false, false, false, true),
(5, 'Сенча', 'Популярный зеленый чай', 'product-5-1777148611197.jpg', 2, true, false, false, true),
(6, 'Матча', 'Японский порошковый чай', 'product-6-1777148611691.jpg', 2, false, true, true, true),
(7, 'Чизкейк Нью-Йорк', 'Классический нежный десерт', 'product-7-1777148612262.jpg', 3, true, false, false, true),
(8, 'Тирамису', 'Популярный итальянский десерт', 'product-8-1777148612776.jpg', 3, false, true, false, true),
(9, 'Макарон', 'Нежное французское печенье', 'product-9-1777148613863.jpg', 3, false, false, true, true)
ON CONFLICT DO NOTHING;

-- Обновляем счетчик для products
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- Вставляем варианты
INSERT INTO product_variants (product_id, weight, price, old_price, stock_quantity) VALUES 
(1, 250, 750, 900, 100),
(1, 1000, 2500, 3000, 50),
(2, 250, 600, NULL, 150),
(2, 1000, 2000, NULL, 80),
(3, 250, 650, 700, 120),
(3, 1000, 2200, 2400, 60),
(4, 100, 300, NULL, 200),
(5, 100, 350, 400, 150),
(6, 50, 500, NULL, 100),
(7, 150, 250, NULL, 30),
(8, 150, 300, 350, 25),
(9, 50, 100, NULL, 50)
ON CONFLICT DO NOTHING;
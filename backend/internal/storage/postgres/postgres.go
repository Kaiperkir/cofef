package postgres

import (
	"context"
	"errors"
	"fmt"
	"time"

	"craft-coffee-backend/internal/domain"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Storage оборачивает пул соединений с БД
type Storage struct {
	pool *pgxpool.Pool
}

// New создает новое подключение к БД
func New(ctx context.Context, connString string) (*Storage, error) {
	var pool *pgxpool.Pool
	var err error

	// Попытка подключиться с задержкой (полезно для docker-compose, когда БД еще встает)
	for i := 0; i < 5; i++ {
		pool, err = pgxpool.New(ctx, connString)
		if err == nil {
			if pingErr := pool.Ping(ctx); pingErr == nil {
				return &Storage{pool: pool}, nil
			}
			pool.Close()
		}
		time.Sleep(2 * time.Second)
	}

	return nil, fmt.Errorf("unable to connect to database after retries: %w", err)
}

// GetCategories возвращает все категории
func (s *Storage) GetCategories(ctx context.Context) ([]domain.Category, error) {
	const query = "SELECT id, name FROM categories ORDER BY id"

	rows, err := s.pool.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close()

	res, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (domain.Category, error) {
		var c domain.Category
		err := row.Scan(&c.ID, &c.Name)
		return c, err
	})
	if err != nil {
		return nil, fmt.Errorf("failed to collect rows: %w", err)
	}

	return res, nil
}

// GetProducts возвращает список всех активных продуктов вместе с их категориями и вариантами.
func (s *Storage) GetProducts(ctx context.Context) ([]domain.Product, error) {
	queryProducts := `
	SELECT 
		p.id, p.title, p.description, p.image_url, p.category_id, 
		p.is_top, p.is_weekly, p.is_specialty, p.is_active,
		c.id, c.name
	FROM products p
	LEFT JOIN categories c ON p.category_id = c.id
	WHERE p.is_active = true
	ORDER BY p.id DESC
	`

	rows, err := s.pool.Query(ctx, queryProducts)
	if err != nil {
		return nil, fmt.Errorf("failed to query products: %w", err)
	}
	defer rows.Close()

	var products []domain.Product
	productsMap := make(map[int64]*domain.Product)

	for rows.Next() {
		var p domain.Product
		var c domain.Category
		var categoryID *int64
		var categoryName *string

		err := rows.Scan(
			&p.ID, &p.Name, &p.Description, &p.ImageURL, &p.CategoryID,
			&p.IsTop, &p.IsWeekly, &p.IsSpecialty, &p.IsActive,
			&categoryID, &categoryName,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan product: %w", err)
		}

		if categoryID != nil && categoryName != nil {
			c.ID = *categoryID
			c.Name = *categoryName
			p.Category = &c
		}

		p.Variants = make([]domain.ProductVariant, 0)
		products = append(products, p)
	}

	for i := range products {
		productsMap[products[i].ID] = &products[i]
	}

	queryVariants := `SELECT id, product_id, weight, price, old_price, stock_quantity FROM product_variants`
	variantRows, err := s.pool.Query(ctx, queryVariants)
	if err != nil {
		return nil, fmt.Errorf("failed to query variants: %w", err)
	}
	defer variantRows.Close()

	for variantRows.Next() {
		var v domain.ProductVariant
		if err := variantRows.Scan(&v.ID, &v.ProductID, &v.Weight, &v.Price, &v.OldPrice, &v.Stock); err != nil {
			return nil, fmt.Errorf("failed to scan variant: %w", err)
		}

		if p, ok := productsMap[v.ProductID]; ok {
			p.Variants = append(p.Variants, v)
		}
	}

	return products, nil
}

// CreateUser создает нового пользователя
func (s *Storage) CreateUser(ctx context.Context, phone, passwordHash, fullName string) (int64, error) {
	const q = "INSERT INTO users (phone, password, full_name) VALUES ($1, $2, $3) RETURNING id"
	var id int64
	if err := s.pool.QueryRow(ctx, q, phone, passwordHash, fullName).Scan(&id); err != nil {
		return 0, fmt.Errorf("failed to create user: %w", err)
	}
	return id, nil
}

// GetUserByPhone возвращает пользователя по номеру телефона
func (s *Storage) GetUserByPhone(ctx context.Context, phone string) (domain.User, error) {
	const op = "postgres.GetUserByPhone"
	const q = "SELECT id, phone, email, password, full_name, role FROM users WHERE phone = $1"

	var user domain.User
	err := s.pool.QueryRow(ctx, q, phone).Scan(
		&user.ID,
		&user.Phone,
		&user.Email,
		&user.Password,
		&user.FullName,
		&user.Role,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.User{}, fmt.Errorf("%s: %w", op, domain.ErrUserNotFound)
		}
		return domain.User{}, fmt.Errorf("%s: %w", op, err)
	}

	return user, nil
}

// GetUserByID возвращает пользователя по ID
func (s *Storage) GetUserByID(ctx context.Context, id int64) (domain.User, error) {
	const op = "postgres.GetUserByID"
	const q = "SELECT id, phone, email, password, full_name, role FROM users WHERE id = $1"

	var user domain.User
	err := s.pool.QueryRow(ctx, q, id).Scan(
		&user.ID,
		&user.Phone,
		&user.Email,
		&user.Password,
		&user.FullName,
		&user.Role,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.User{}, fmt.Errorf("%s: %w", op, domain.ErrUserNotFound)
		}
		return domain.User{}, fmt.Errorf("%s: %w", op, err)
	}

	return user, nil
}

// SetRefreshToken обновляет refresh токен пользователя
func (s *Storage) SetRefreshToken(ctx context.Context, userID int64, token string) error {
	const op = "postgres.SetRefreshToken"
	const q = "UPDATE users SET refresh_token = $1 WHERE id = $2"

	tag, err := s.pool.Exec(ctx, q, token, userID)
	if err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	if tag.RowsAffected() == 0 {
		return fmt.Errorf("%s: %w", op, domain.ErrUserNotFound)
	}

	return nil
}

func (s *Storage) CreateOrder(ctx context.Context, userID int64, req domain.CreateOrderRequest) (int64, error) {
	// Начинаем транзакцию
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return 0, fmt.Errorf("failed to begin tx: %w", err)
	}
	// Важно: откатываем транзакцию при панике или ошибке, если не было Commit
	defer tx.Rollback(ctx)

	// 1. Создаем заказ
	var orderID int64
	orderQuery := `
	INSERT INTO orders (user_id, delivery_type, delivery_address, phone, comment, total)
	VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
	`
	err = tx.QueryRow(ctx, orderQuery, userID, req.DeliveryType, req.DeliveryAddress, req.Phone, req.Comment, req.Total).Scan(&orderID)
	if err != nil {
		return 0, fmt.Errorf("failed to insert order: %w", err)
	}

	// 2. Создаем элементы заказа
	itemQuery := `
	INSERT INTO order_items (order_id, product_id, variant_id, quantity, purchase_price)
	VALUES ($1, $2, $3, $4, $5)
	`
	for _, item := range req.Items {
		_, err = tx.Exec(ctx, itemQuery, orderID, item.ProductID, item.VariantID, item.Quantity, item.Price)
		if err != nil {
			return 0, fmt.Errorf("failed to insert order item: %w", err)
		}
	}

	// 3. Сохраняем всё
	if err := tx.Commit(ctx); err != nil {
		return 0, fmt.Errorf("failed to commit tx: %w", err)
	}

	return orderID, nil
}

// GetMyOrders возвращает список заказов пользователя
func (s *Storage) GetMyOrders(ctx context.Context, userID int64) ([]domain.Order, error) {
	// 1. Получаем заказы
	orderQuery := `
		SELECT id, user_id, status, delivery_type, delivery_address, phone, comment, total, created_at
		FROM orders
		WHERE user_id = $1
		ORDER BY created_at DESC
	`
	rows, err := s.pool.Query(ctx, orderQuery, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query orders: %w", err)
	}
	defer rows.Close()

	var orders []domain.Order
	orderMap := make(map[int64]*domain.Order)
	var orderIDs []int64

	for rows.Next() {
		var o domain.Order
		var createdAtTime time.Time
		
		err := rows.Scan(
			&o.ID, &o.UserID, &o.Status, &o.DeliveryType, &o.DeliveryAddress, 
			&o.Phone, &o.Comment, &o.Total, &createdAtTime,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan order: %w", err)
		}
		
		o.CreatedAt = createdAtTime.Format(time.RFC3339)
		o.OrderItem = make([]domain.OrderItem, 0)
		orders = append(orders, o)
		orderIDs = append(orderIDs, o.ID)
	}
	
	// Если заказов нет, можно сразу вернуть
	if len(orders) == 0 {
		return orders, nil
	}
	
	// Построим мапу для быстрого добавления айтемов
	for i := range orders {
		orderMap[orders[i].ID] = &orders[i]
	}

	// 2. Получаем позиции (элементы) заказов
	itemQuery := `
		SELECT oi.id, oi.order_id, oi.product_id, oi.variant_id, oi.quantity, oi.purchase_price, p.title as name, pv.weight
		FROM order_items oi
		JOIN products p ON oi.product_id = p.id
		JOIN product_variants pv ON oi.variant_id = pv.id
		WHERE oi.order_id = ANY($1)
	`
	itemRows, err := s.pool.Query(ctx, itemQuery, orderIDs)
	if err != nil {
		return nil, fmt.Errorf("failed to query order items: %w", err)
	}
	defer itemRows.Close()

	for itemRows.Next() {
		var item domain.OrderItem
		if err := itemRows.Scan(&item.ID, &item.OrderID, &item.ProductID, &item.VariantID, &item.Quantity, &item.PurchasePrice, &item.Name, &item.Weight); err != nil {
			return nil, fmt.Errorf("failed to scan order item: %w", err)
		}
		
		if o, ok := orderMap[item.OrderID]; ok {
			o.OrderItem = append(o.OrderItem, item)
		}
	}

	return orders, nil
}

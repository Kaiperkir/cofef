package postgres

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Storage оборачивает пул соединений с БД
type Storage struct {
	pool *pgxpool.Pool
}

// New создает новое подключение к БД
func New(ctx context.Context, connString string) (*Storage, error) {
	pool, err := pgxpool.New(ctx, connString)
	if err != nil {
		return nil, fmt.Errorf("unable to create connection pool: %w", err)
	}

	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("unable to ping database: %w", err)
	}

	return &Storage{pool: pool}, nil
}

func (s *Storage) GetCategories(ctx context.Context) ([]Category, error) {
	// 1. Напиши SQL запрос: SELECT id, name FROM categories ORDER BY id
	// 2. Выполни запрос через s.pool.Query(ctx, query)
	// 3. Не забудь defer rows.Close() (или используй готовую фичу из pgx/v5 - pgx.CollectRows)
	// 4. Верни срез (slice) полученных категорий
	query := "SELECT id, name FROM categories ORDER BY id"
	rows, err := s.pool.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close()

	res, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (Category, error) {
		var c Category
		err := row.Scan(&c.ID, &c.Name)
		return c, err
	})
	if err != nil {
		return nil, fmt.Errorf("failed to collect rows: %w", err)
	}

	return res, nil
}

// GetProducts возвращает список всех активных продуктов вместе с их категориями и вариантами.
func (s *Storage) GetProducts(ctx context.Context) ([]Product, error) {
	// 1. Запрос товаров + JOIN категорий
	queryProducts := `
	SELECT
		p.id, p.title, p.description, p.image_url, p.category_id,
		p.is_top, p.is_weekly, p.is_specialty, p.is_active,
		c.id, c.name
	FROM products p
	LEFT JOIN categories c ON p.category_id = c.id
	WHERE p.is_active = true
	`

	rows, err := s.pool.Query(ctx, queryProducts)
	if err != nil {
		return nil, fmt.Errorf("failed to query products: %w", err)
	}
	defer rows.Close()

	// Используем мапу для быстрого доступа к продукту по ID при добавлении вариантов
	productsMap := make(map[int64]*Product)
	var products []Product

	for rows.Next() {
		var p Product
		var c Category
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

		// Инициализируем пустой срез вариантов, чтобы избежать nil в JSON
		p.Variants = make([]ProductVariant, 0)
		products = append(products, p)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	// Сохраняем указатели на элементы среза в мапу
	for i := range products {
		productsMap[products[i].ID] = &products[i]
	}

	// 2. Запрос всех вариантов
	queryVariants := `SELECT id, product_id, weight, price, old_price, stock_quantity FROM product_variants`

	variantRows, err := s.pool.Query(ctx, queryVariants)
	if err != nil {
		return nil, fmt.Errorf("failed to query variants: %w", err)
	}
	defer variantRows.Close()

	for variantRows.Next() {
		var v ProductVariant

		err := variantRows.Scan(
			&v.ID, &v.ProductID, &v.Weight, &v.Price, &v.OldPrice, &v.Stock,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan variant: %w", err)
		}

		// 3. Группировка
		if p, ok := productsMap[v.ProductID]; ok {
			p.Variants = append(p.Variants, v)
		}
	}

	if err = variantRows.Err(); err != nil {
		return nil, fmt.Errorf("variant rows error: %w", err)
	}

	// 4. Возвращаем собранный []Product
	return products, nil
}

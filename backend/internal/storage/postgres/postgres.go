package postgres

import (
	"context"
	"fmt"

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

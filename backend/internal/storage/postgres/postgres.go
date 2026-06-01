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

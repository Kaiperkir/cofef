package handlers

import (
	"context"
	"log/slog"

	"craft-coffee-backend/internal/storage/postgres"
)

// Storage описывает контракт для работы с базой данных.
// Интерфейс позволяет отвязаться от конкретной реализации (PostgreSQL)
// и упрощает тестирование за счет использования моков.
type Storage interface {
	GetCategories(ctx context.Context) ([]postgres.Category, error)
}

// Handler объединяет все HTTP-обработчики и хранит зависимости
type Handler struct {
	db  Storage
	log *slog.Logger
}

// New создает новый экземпляр Handler
func New(db Storage, log *slog.Logger) *Handler {
	return &Handler{
		db:  db,
		log: log,
	}
}

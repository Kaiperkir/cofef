package handlers

import (
	"log/slog"

	"craft-coffee-backend/internal/domain"
)

// Handler объединяет все HTTP-обработчики и хранит зависимости
type Handler struct {
	db  domain.Storage
	log *slog.Logger
}

// New создает новый экземпляр Handler
func New(db domain.Storage, log *slog.Logger) *Handler {
	return &Handler{
		db:  db,
		log: log,
	}
}

package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

// GetCategories обрабатывает GET /api/categories
func (h *Handler) GetCategories(w http.ResponseWriter, r *http.Request) {
	const op = "handlers.GetCategories"

	// Логируем сам факт запроса
	h.log.Info("fetching categories", slog.String("op", op))

	categories, err := h.db.GetCategories(r.Context())
	if err != nil {
		h.log.Error("failed to get categories", slog.String("op", op), slog.String("error", err.Error()))
		http.Error(w, "Ошибка сервера", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(categories); err != nil {
		h.log.Error("failed to encode response", slog.String("op", op), slog.String("error", err.Error()))
		http.Error(w, "Ошибка сервера", http.StatusInternalServerError)
		return
	}

	h.log.Debug("categories fetched successfully", slog.String("op", op), slog.Int("count", len(categories)))
}

package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

// GetProducts обрабатывает GET /api/products и возвращает список продуктов.
func (h *Handler) GetProducts(w http.ResponseWriter, r *http.Request) {
	const op = "handlers.GetProducts"
	h.log.Info("fetching products", slog.String("op", op))

	products, err := h.db.GetProducts(r.Context())
	if err != nil {
		h.log.Error("failed to get products", slog.String("op", op), slog.String("error", err.Error()))
		http.Error(w, "Ошибка сервера", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(products); err != nil {
		h.log.Error("failed to encode response", slog.String("op", op), slog.String("error", err.Error()))
		http.Error(w, "Ошибка сервера", http.StatusInternalServerError)
		return
	}

	h.log.Debug("products fetched successfully", slog.String("op", op), slog.Int("count", len(products)))
}

package handlers

import (
	"log/slog"
	"net/http"
)

// GetProducts обрабатывает GET /api/products и возвращает список продуктов.
func (h *Handler) GetProducts(w http.ResponseWriter, r *http.Request) {
	const op = "handlers.GetProducts"
	log := h.log.With(slog.String("op", op))

	log.Info("fetching products")

	products, err := h.db.GetProducts(r.Context())
	if err != nil {
		log.Error("failed to get products", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Ошибка сервера")
		return
	}

	log.Debug("products fetched successfully", slog.Int("count", len(products)))

	h.sendOK(w, http.StatusOK, products)
}

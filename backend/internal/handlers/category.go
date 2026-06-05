package handlers

import (
	"log/slog"
	"net/http"
)

// GetCategories обрабатывает GET /api/categories
func (h *Handler) GetCategories(w http.ResponseWriter, r *http.Request) {
	const op = "handlers.GetCategories"
	log := h.log.With(slog.String("op", op))

	log.Info("fetching categories")

	categories, err := h.db.GetCategories(r.Context())
	if err != nil {
		log.Error("failed to get categories", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Ошибка сервера")
		return
	}

	log.Debug("categories fetched successfully", slog.Int("count", len(categories)))

	h.sendOK(w, http.StatusOK, categories)
}

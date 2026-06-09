package handlers

import (
	"encoding/json"
	"net/http"
	"log/slog"

	"craft-coffee-backend/internal/domain"
	"craft-coffee-backend/internal/service"
)

// RecommendCoffee обрабатывает запрос к ИИ-баристе
func (h *Handler) RecommendCoffee(w http.ResponseWriter, r *http.Request) {
	const op = "handlers.RecommendCoffee"
	log := h.log.With(slog.String("op", op))

	log.Info("received recommendation request")

	var req domain.AIRequest
	// 1. Распарси r.Body в структуру domain.AIRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error("failed to decode request", "error", err.Error())
		// 2. Если ошибка -> h.sendError(w, http.StatusBadRequest, "Неверный формат")
		h.sendError(w, http.StatusBadRequest, "Неверный формат запроса")
		return
	}

	if req.Prompt == "" {
		h.sendError(w, http.StatusBadRequest, "Промпт не может быть пустым")
		return
	}

	// 3. Получаем список товаров из БД для контекста
	products, err := h.db.GetProducts(r.Context())
	if err != nil {
		log.Error("failed to get products for AI context", "error", err.Error())
		// Не прерываемся, просто ИИ ответит без контекста если что
	}

	// 4. Вызови сервис с контекстом товаров
	recommendation, err := service.AskBarista(r.Context(), req.Prompt, products)
	if err != nil {
		// 5. Если ошибка -> залогируй её и верни h.sendError(w, 500, "ИИ-бариста устал")
		log.Error("failed to get AI recommendation", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "ИИ-бариста устал, попробуйте позже")
		return
	}

	// 5. Верни успешный ответ через h.sendOK(w, http.StatusOK, domain.AIResponse{Recommendation: recommendation})
	h.sendOK(w, http.StatusOK, domain.AIResponse{Recommendation: recommendation})
}

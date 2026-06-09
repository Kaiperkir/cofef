package handlers

import (
	"encoding/json"
	"net/http"
	"log/slog"

	"craft-coffee-backend/internal/domain"
)

func (h *Handler) CreateOrder(w http.ResponseWriter, r *http.Request) {
	var req domain.CreateOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.sendError(w, http.StatusBadRequest, "Неверный формат запроса")
		return
	}

	userID, ok := r.Context().Value(UserIDKey).(int64)
	if !ok {
		h.sendError(w, http.StatusUnauthorized, "Не авторизован")
		return
	}

	orderID, err := h.db.CreateOrder(r.Context(), userID, req)
	if err != nil {
		h.log.Error("failed to create order", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Ошибка при создании заказа")
		return
	}

	h.sendOK(w, http.StatusCreated, map[string]any{
		"status":  "ok",
		"orderId": orderID,
	})
}

func (h *Handler) GetMyOrders(w http.ResponseWriter, r *http.Request) {
	const op = "handlers.GetMyOrders"
	log := h.log.With(slog.String("op", op))

	userID, ok := r.Context().Value(UserIDKey).(int64)
	if !ok {
		h.sendError(w, http.StatusUnauthorized, "Не авторизован")
		return
	}

	orders, err := h.db.GetMyOrders(r.Context(), userID)
	if err != nil {
		log.Error("failed to get my orders", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Ошибка при получении заказов")
		return
	}

	// Если заказов нет, возвращаем пустой массив, а не null
	if orders == nil {
		orders = []domain.Order{}
	}

	h.sendOK(w, http.StatusOK, orders)
}
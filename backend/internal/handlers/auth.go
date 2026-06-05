package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

type registerRequest struct {
	Phone    string `json:"phone"`
	Password string `json:"password"`
	FullName string `json:"fullName"`
}

// Register обрабатывает запрос на регистрацию нового пользователя.
func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	const op = "handlers.Register"
	log := h.log.With(slog.String("op", op))

	var req registerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error("failed to decode request", "error", err.Error())
		h.sendError(w, http.StatusBadRequest, "Некорректный запрос")
		return
	}

	if req.Phone == "" || req.Password == "" || req.FullName == "" {
		h.sendError(w, http.StatusBadRequest, "Все поля обязательны для заполнения")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Error("failed to generate password hash", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Ошибка сервера")
		return
	}

	id, err := h.db.CreateUser(r.Context(), req.Phone, string(hash), req.FullName)
	if err != nil {
		log.Error("failed to create user in db", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Ошибка при регистрации")
		return
	}

	log.Info("user registered successfully", slog.Int64("id", id))

	h.sendOK(w, http.StatusCreated, map[string]any{
		"status": "ok",
		"userId": id,
	})
}

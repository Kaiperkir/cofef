package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"time"

	"craft-coffee-backend/internal/domain"
	"craft-coffee-backend/internal/lib/jwt"

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

type loginRequest struct {
	Phone    string `json:"phone"`
	Password string `json:"password"`
}

// Login обрабатывает вход пользователя и выдачу токенов.
func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	const op = "handlers.Login"
	log := h.log.With(slog.String("op", op))

	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error("failed to decode request", "error", err.Error())
		h.sendError(w, http.StatusBadRequest, "Некорректный запрос")
		return
	}

	if req.Phone == "" || req.Password == "" {
		h.sendError(w, http.StatusBadRequest, "Введите телефон и пароль")
		return
	}

	// 1. Ищем пользователя
	user, err := h.db.GetUserByPhone(r.Context(), req.Phone)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			log.Warn("user not found", slog.String("phone", req.Phone))
			h.sendError(w, http.StatusUnauthorized, "Неверный логин или пароль")
			return
		}
		log.Error("failed to get user", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Ошибка сервера")
		return
	}

	// 2. Проверяем пароль
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		log.Warn("invalid password", slog.String("phone", req.Phone))
		h.sendError(w, http.StatusUnauthorized, "Неверный логин или пароль")
		return
	}

	// 3. Генерируем токены
	// Access токен обычно короткий (например, 15 минут)
	accessToken, err := jwt.NewToken(user, 15*time.Minute)
	if err != nil {
		log.Error("failed to generate access token", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Ошибка сервера")
		return
	}

	// Refresh токен длинный (например, 30 дней)
	refreshToken, err := jwt.NewToken(user, 30*24*time.Hour)
	if err != nil {
		log.Error("failed to generate refresh token", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Ошибка сервера")
		return
	}

	// 4. Сохраняем Refresh токен в БД
	if err := h.db.SetRefreshToken(r.Context(), user.ID, refreshToken); err != nil {
		log.Error("failed to save refresh token", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Ошибка сервера")
		return
	}

	log.Info("user logged in", slog.Int64("id", user.ID))

	h.sendOK(w, http.StatusOK, map[string]any{
		"accessToken":  accessToken,
		"refreshToken": refreshToken,
		"user": map[string]any{
			"id":       user.ID,
			"role":     user.Role,
			"fullName": user.FullName,
		},
	})
}

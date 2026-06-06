package handlers

import (
	"context"
	"log/slog"
	"net/http"
	"strings"

	"craft-coffee-backend/internal/lib/jwt"
)

// Ключи для значений в context.Context
type contextKey string

const (
	UserIDKey   contextKey = "userID"
	UserRoleKey contextKey = "userRole"
)

func (h *Handler) RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		const op = "handlers.RequireAuth"
		log := h.log.With(slog.String("op", op))

		authHeader := r.Header.Get("Authorization")

		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			log.Warn("missing or invalid authorization header")
			h.sendError(w, http.StatusUnauthorized, "Отсутствует или некорректный токен авторизации")
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		
		uid, role, err := jwt.ParseToken(token)
		if err != nil {
			log.Error("failed to parse token", "error", err.Error())
			h.sendError(w, http.StatusUnauthorized, "Недействительный или просроченный токен")
			return
		}
		
		ctx := context.WithValue(r.Context(), UserIDKey, uid)
		ctx = context.WithValue(ctx, UserRoleKey, role)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

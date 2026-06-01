package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"craft-coffee-backend/internal/handlers"
	"craft-coffee-backend/internal/logger"
	"craft-coffee-backend/internal/storage/postgres"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {
	// Инициализация логгера (по умолчанию используем 'local' для читабельного вывода в консоль,
	// на проде можно заменить на 'prod' через переменные окружения)
	env := os.Getenv("ENV")
	if env == "" {
		env = logger.EnvLocal
	}
	log := logger.SetupLogger(env)

	log.Info("Starting Coffee API", slog.String("env", env))

	ctx := context.Background()
	p, err := postgres.New(ctx, "postgres://postgres:1234@localhost:5432/postgres?sslmode=disable")
	if err != nil {
		log.Error("Ошибка при запуске БД", slog.String("error", err.Error()))
		os.Exit(1)
	}

	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
	// Передаем логгер в слой хендлеров
	h := handlers.New(p, log)

	// === Handler ===
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Coffee API is alive! ☕"))
	})
	r.Get("/api/categories", h.GetCategories)

	r.Get("/api/products", h.GetProducts)

	// Настройка сервера
	srv := &http.Server{
		Addr:         ":5000",
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Info("Сервер запущен", slog.String("addr", srv.Addr))
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Error("Критическая ошибка сервера", slog.String("error", err.Error()))
			os.Exit(1)
		}
	}()

	// Graceful Shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)

	<-quit
	log.Info("Получен сигнал на остановку. Начинаем Graceful Shutdown...")

	shutdownCtx, cancelShutdown := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelShutdown()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Error("Сервер упал при остановке", slog.String("error", err.Error()))
		os.Exit(1)
	}

	log.Info("Сервер корректно завершил работу.")
}

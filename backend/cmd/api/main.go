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
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

const (
	defaultPort = ":5000"
	dbConnStr   = "postgres://postgres:1234@localhost:5432/postgres?sslmode=disable"
)

func main() {
	env := getEnv("ENV", logger.EnvLocal)
	log := logger.SetupLogger(env)

	log.Info("Starting Coffee API", slog.String("env", env))

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Storage init
	db, err := postgres.New(ctx, dbConnStr)
	if err != nil {
		log.Error("failed to init db", "error", err.Error())
		os.Exit(1)
	}

	// Handlers init
	h := handlers.New(db, log)

	// Router setup
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Route("/api", func(r chi.Router) {
		r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("Coffee API is alive! ☕"))
		})

		r.Get("/categories", h.GetCategories)
		r.Get("/products", h.GetProducts)
		r.Post("/auth/register", h.Register)
		r.Post("/api/auth/login", h.Login)
	})

	srv := &http.Server{
		Addr:         defaultPort,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Info("Server started", slog.String("addr", srv.Addr))
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Error("Server error", "error", err.Error())
		}
	}()

	// Graceful shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	<-stop

	log.Info("Stopping server...")

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Error("Server shutdown failed", "error", err.Error())
		os.Exit(1)
	}

	log.Info("Server stopped gracefully")
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

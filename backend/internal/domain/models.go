package domain

import (
	"context"
	"errors"
)

var ErrUserNotFound = errors.New("user not found")

type Category struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type ProductVariant struct {
	ID        int64 `json:"id"`
	ProductID int64 `json:"-"`
	Weight    int   `json:"weight"`
	Price     int   `json:"price"`
	OldPrice  *int  `json:"oldPrice"`
	Stock     int   `json:"stock"`
}

type Product struct {
	ID          int64            `json:"id"`
	Name        string           `json:"name"`
	Description *string          `json:"description"`
	ImageURL    string           `json:"imageUrl"`
	CategoryID  int64            `json:"categoryId"`
	Category    *Category        `json:"category,omitempty"`
	IsTop       bool             `json:"isTop"`
	IsWeekly    bool             `json:"isWeekly"`
	IsSpecialty bool             `json:"isSpecialty"`
	IsActive    bool             `json:"isActive"`
	Variants    []ProductVariant `json:"variants"`
}

type User struct {
	ID              int64   `json:"id"`
	Phone           string  `json:"phone"`
	Email           *string `json:"email,omitempty"`
	Password        string  `json:"-"`
	FullName        string  `json:"fullName"`
	DeliveryAddress *string `json:"deliveryAddress,omitempty"`
	Role            string  `json:"role"`
}

type OrderItemRequest struct {
	ProductID int64   `json:"productId"`
	VariantID int64   `json:"variantId"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"` // Актуальная цена
}

type CreateOrderRequest struct {
	DeliveryType    string             `json:"deliveryType"`
	DeliveryAddress string             `json:"deliveryAddress"`
	Phone           string             `json:"phone"`
	Comment         string             `json:"comment"`
	Total           float64            `json:"total"`
	Items           []OrderItemRequest `json:"items"`
}

type OrderItem struct {
	ID            int64   `json:"id"`
	OrderID       int64   `json:"orderId"`
	ProductID     int64   `json:"productId"`
	VariantID     int64   `json:"variantId"`
	Quantity      int     `json:"quantity"`
	PurchasePrice float64 `json:"price"`
	Name          string  `json:"name,omitempty"`
	Weight        int     `json:"weight,omitempty"`
}

type Order struct {
	ID              int64       `json:"id"`
	UserID          int64       `json:"userId"`
	Status          string      `json:"status"`
	DeliveryType    string      `json:"deliveryType"`
	DeliveryAddress string      `json:"address"` // Маппинг на ожидаемый фронтом address
	Phone           string      `json:"phone"`
	Comment         string      `json:"comment"`
	Total           float64     `json:"total"`
	CreatedAt       string      `json:"createdAt"`
	OrderItem       []OrderItem `json:"OrderItem"` // Маппинг на ожидаемый фронтом OrderItem (с большой буквы)
}

// AI
type AIRequest struct {
	Prompt string `json:"prompt"`
}

type AIResponse struct {
	Recommendation string `json:"recommendation"`
}

// Storage описывает интерфейс взаимодействия с данными (Repository в Clean Arch)
type Storage interface {
	GetCategories(ctx context.Context) ([]Category, error)
	GetProducts(ctx context.Context) ([]Product, error)
	CreateUser(ctx context.Context, phone, passwordHash, fullName string) (int64, error)
	GetUserByPhone(ctx context.Context, phone string) (User, error)
	GetUserByID(ctx context.Context, id int64) (User, error)
	SetRefreshToken(ctx context.Context, userID int64, token string) error
	CreateOrder(ctx context.Context, userID int64, req CreateOrderRequest) (int64, error)
	GetMyOrders(ctx context.Context, userID int64) ([]Order, error)
}

package domain

import (
	"context"
)

type Category struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type ProductVariant struct {
	ID        int64  `json:"id"`
	ProductID int64  `json:"-"`
	Weight    int    `json:"weight"`
	Price     int    `json:"price"`
	OldPrice  *int   `json:"oldPrice"`
	Stock     int    `json:"stock"`
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

// Storage описывает интерфейс взаимодействия с данными (Repository в Clean Arch)
type Storage interface {
	GetCategories(ctx context.Context) ([]Category, error)
	GetProducts(ctx context.Context) ([]Product, error)
	CreateUser(ctx context.Context, phone, passwordHash, fullName string) (int64, error)
}

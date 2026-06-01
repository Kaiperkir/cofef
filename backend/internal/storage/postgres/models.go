package postgres

type Category struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type ProductVariant struct {
	ID        int64 `json:"id"`
	ProductID int64 `json:"-"` // Скрываем из JSON
	Weight    int   `json:"weight"`
	Price     int   `json:"price"` // Из NUMERIC(10,2) в БД будем сканировать в int или float64 (лучше float64, но если цены целые, можно оставить int)
	OldPrice  *int  `json:"oldPrice"`
	Stock     int   `json:"stock"` // В базе поле stock_quantity
}

type Product struct {
	ID          int64            `json:"id"`
	Name        string           `json:"name"` // Мапится на db: title
	Description *string          `json:"description"`
	ImageURL    string           `json:"imageUrl"` // Мапится на db: image_url
	CategoryID  int64            `json:"categoryId"`
	Category    *Category        `json:"category,omitempty"`
	IsTop       bool             `json:"isTop"`
	IsWeekly    bool             `json:"isWeekly"`
	IsSpecialty bool             `json:"isSpecialty"`
	IsActive    bool             `json:"isActive"`
	Variants    []ProductVariant `json:"variants"` // Сюда мы положим варианты
}

type User struct {
	ID              int64   `json:"id"`
	Phone           string  `json:"phone"`
	Email           *string `json:"email,omitempty"`
	Password        string  `json:"-"` // Скрываем пароль из JSON
	FullName        string  `json:"fullName"`
	DeliveryAddress *string `json:"deliveryAddress,omitempty"`
	Role            string  `json:"role"`
}

type RegisterRequest struct {
	Phone    string `json:"phone"`
	Password string `json:"password"`
	FullName string `json:"fullName"`
}

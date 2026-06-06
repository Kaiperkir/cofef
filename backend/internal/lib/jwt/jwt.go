package jwt

import (
	"fmt"
	"time"

	"craft-coffee-backend/internal/domain"
	"github.com/golang-jwt/jwt/v5"
)

const (
	secret = "super-secret-key" // TODO: move to config
)

// NewToken создает новый JWT токен для пользователя
func NewToken(user domain.User, duration time.Duration) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["uid"] = user.ID
	claims["role"] = user.Role
	claims["exp"] = time.Now().Add(duration).Unix()

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func ParseToken(tokenString string) (int64, string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		// 1. ЗАЩИТА ОТ ВЗЛОМА: Обязательно проверяем метод подписи
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("неожиданный метод подписи: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})

	if err != nil {
		return 0, "", err
	}

	// 2. БЕЗОПАСНОЕ ПРИВЕДЕНИЕ ТИПОВ: Проверяем токен на валидность и аккуратно достаем Claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return 0, "", fmt.Errorf("невалидный токен")
	}

	// 3. ПРОВЕРКА НАЛИЧИЯ ПОЛЕЙ: Аккуратно достаем uid
	uidFloat, ok := claims["uid"].(float64)
	if !ok {
		return 0, "", fmt.Errorf("uid отсутствует или имеет неверный формат")
	}
	uid := int64(uidFloat)

	// Аккуратно достаем role
	role, ok := claims["role"].(string)
	if !ok {
		return 0, "", fmt.Errorf("role отсутствует или имеет неверный формат")
	}

	return uid, role, nil
}

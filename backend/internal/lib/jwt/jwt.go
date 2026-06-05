package jwt

import (
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

package handlers

import (
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"
	// не забудь импорт логгера и моделей
)

// Register обрабатывает запрос на регистрацию нового пользователя.
func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	// 1. Распарси r.Body в структуру RegisterRequest через json.NewDecoder
	// 2. Захэшируй пароль:
	//    hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	// 3. Вызови h.db.CreateUser(r.Context(), req.Phone, string(hash), req.FullName)
	// 4. Если всё ок - верни JSON с сообщением {"status": "ok", "userId": id}
}

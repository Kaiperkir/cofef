package service

import (
	"context"
	"fmt"
	"strings"
	// добавь нужные импорты (bytes, encoding/json, net/http и т.д.) когда будешь подключать Gemini
)

// AskBarista обращается к API нейросети и возвращает рекомендацию
func AskBarista(ctx context.Context, userPrompt string) (string, error) {
	// 1. Сформируй системный промпт:
	//    "Ты профессиональный бариста. Посоветуй клиенту напиток на основе его пожелания: " + userPrompt

	// Здесь пока реализуем ЗАГЛУШКУ (Mock) для проверки работы
	// Позже можно будет добавить реальный вызов Gemini API

	promptLower := strings.ToLower(userPrompt)

	if strings.Contains(promptLower, "холод") || strings.Contains(promptLower, "айс") {
		return "Попробуйте наш Айс Латте или Эспрессо-тоник. Отлично освежает в жару!", nil
	}

	if strings.Contains(promptLower, "сладк") {
		return "Рекомендую Карамельный Раф или Моккачино. Очень нежные и сладкие напитки.", nil
	}

	if strings.Contains(promptLower, "крепк") || strings.Contains(promptLower, "бодр") {
		return "Двойной эспрессо или Флэт Уайт — то, что нужно для мощного заряда бодрости!", nil
	}

	// Дефолтный ответ
	return fmt.Sprintf("Основываясь на вашем пожелании («%s»), я бы порекомендовал вам наш фирменный Капучино на классическом зерне.", userPrompt), nil
}

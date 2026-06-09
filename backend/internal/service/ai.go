package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"craft-coffee-backend/internal/domain"
)

// AskBarista — главный мозг, который выбирает как ответить: локально или через ИИ
func AskBarista(ctx context.Context, userPrompt string, products []domain.Product) (string, error) {
	promptLower := strings.ToLower(strings.TrimSpace(userPrompt))

	// Если вопрос совсем короткий и содержит название товара — отвечаем сразу
	for _, p := range products {
		if len(promptLower) < 25 && strings.Contains(promptLower, strings.ToLower(p.Name)) {
			// БЕЗОПАСНАЯ проверка на nil, чтобы сервер не рухнул с panic
			desc := "Отличный выбор!"
			if p.Description != nil {
				desc = *p.Description
			}
			return fmt.Sprintf("Отличный выбор! %s — это один из наших фаворитов. %s Подсказать вам цену на него?", p.Name, desc), nil
		}
	}

	// --- 2. ПОДГОТОВКА ДАННЫХ ДЛЯ ИИ ---
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		fmt.Println("[AI Service] GEMINI_API_KEY не задан, используем локальный Mock.")
		return askBaristaMock(userPrompt), nil
	}

	var productsInfo strings.Builder
	for _, p := range products {
		desc := ""
		if p.Description != nil {
			desc = *p.Description
		}
		productsInfo.WriteString(fmt.Sprintf("- %s: %s\n", p.Name, desc))
	}

	systemPrompt := fmt.Sprintf(`Ты бариста Craft Coffee. Советуй ТОЛЬКО из меню:
	%s
	Пожелание клиента: %s
	Ответь очень коротко (1-2 фразы).`, productsInfo.String(), userPrompt)

	// --- 3. МНОГОУРОВНЕВЫЙ ЗАПРОС (Failover Chain / Пинговка) ---
	// Приоритетный список моделей (от самых быстрых/новых к запасным)
	models := []string{
		"gemini-3.1-flash-lite", // Твой приоритет №1
		"gemini-2.0-flash",      // Твой приоритет №2
		"gemini-2.0-flash-001",  // Запасная
	}

	for _, model := range models {
		fmt.Printf("[AI Service] Trying model: %s...\n", model)

		// Ставим короткий таймаут на каждую попытку
		timeout := 7 * time.Second
		if strings.Contains(model, "lite") {
			timeout = 5 * time.Second
		}

		attemptCtx, cancel := context.WithTimeout(ctx, timeout)
		res, err := callGemini(attemptCtx, model, apiKey, systemPrompt)
		cancel() // Освобождаем ресурсы контекста

		if err == nil && res != "" {
			fmt.Printf("[AI Service] Model %s responded successfully!\n", model)
			return res, nil
		}

		fmt.Printf("[AI Service] Model %s failed: %v. Moving to next...\n", model, err)
	}

	// --- 4. ПОСЛЕДНИЙ РУБЕЖ (Mock) ---
	fmt.Println("[AI Service] All AI models failed or timed out. Using local fallback.")
	return askBaristaMock(userPrompt), nil
}

// callGemini — вспомогательная функция для одного HTTP запроса к Google
func callGemini(ctx context.Context, model, apiKey, prompt string) (string, error) {
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", model, apiKey)

	reqBody := map[string]any{
		"contents": []map[string]any{
			{
				"parts": []map[string]any{
					{"text": prompt},
				},
			},
		},
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("ошибка сборки JSON: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("ошибка создания HTTP запроса: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("сетевая ошибка при запросе к API: %w", err)
	}
	defer resp.Body.Close()

	// Улучшенный отлов ошибок: читаем ответ Google, чтобы знать точную причину
	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("status %d, response: %s", resp.StatusCode, string(bodyBytes))
	}

	var result struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("ошибка парсинга ответа: %w", err)
	}

	if len(result.Candidates) > 0 && len(result.Candidates[0].Content.Parts) > 0 {
		return strings.TrimSpace(result.Candidates[0].Content.Parts[0].Text), nil
	}

	return "", fmt.Errorf("API вернул пустой ответ")
}

func askBaristaMock(userPrompt string) string {
	promptLower := strings.ToLower(userPrompt)
	if strings.Contains(promptLower, "холод") || strings.Contains(promptLower, "айс") {
		return "В такую жару идеально подойдет Айс Латте или Эспрессо-тоник. Освежает мгновенно!"
	}
	if strings.Contains(promptLower, "сладк") {
		return "Рекомендую Карамельный Раф или наш Тирамису. Это самые нежные позиции в меню!"
	}
	if strings.Contains(promptLower, "крепк") || strings.Contains(promptLower, "бодр") {
		return "Попробуйте наш Двойной Эспрессо или Флэт Уайт. Мощный заряд энергии гарантирован!"
	}
	return "Основываясь на вашем пожелании, я бы рекомендовал вам наш фирменный Капучино на классическом зерне. Оно идеально сбалансировано и нравится всем!"
}

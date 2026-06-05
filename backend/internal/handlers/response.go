package handlers

import (
	"encoding/json"
	"net/http"
)

type response struct {
	Status string `json:"status"`
	Error  string `json:"error,omitempty"`
	Data   any    `json:"data,omitempty"`
}

func (h *Handler) sendJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		h.log.Error("failed to encode response", "error", err.Error())
	}
}

func (h *Handler) sendError(w http.ResponseWriter, status int, msg string) {
	h.sendJSON(w, status, response{
		Status: "error",
		Error:  msg,
	})
}

func (h *Handler) sendOK(w http.ResponseWriter, status int, data any) {
	h.sendJSON(w, status, data)
}

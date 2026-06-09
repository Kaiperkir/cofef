FROM golang:alpine AS builder

WORKDIR /app

# Install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o api ./cmd/api/main.go

FROM alpine:latest

WORKDIR /app

# Install CA certificates for external HTTPS calls
RUN apk --no-cache add ca-certificates

# Copy the binary
COPY --from=builder /app/api .

# Copy uploads if needed (will be mounted in compose)
# RUN mkdir -p /app/uploads

EXPOSE 5000

CMD ["./api"]
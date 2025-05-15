package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/pratham-ak2004/cloud-metric/server/internal/logger"
	"golang.org/x/crypto/bcrypt"
)

const SESSION_LIFETIME = 10 * time.Second    // 1 day
const REFRESH_LIFETIME = 30 * 24 * time.Hour // 30 days

const SESSION_TOKEN_NAME = "session_id"
const REFRESH_JWT_NAME = "refresh_jwt"

func HashPassword(val string) (string, error) {
	secret := logger.GetEnv("AUTH_SECRET")
	if secret == "" {
		secret = "default_secret"
	}

	bytes, err := bcrypt.GenerateFromPassword([]byte(val+secret), 10)
	if err != nil {
		return "", err
	}

	return string(bytes), nil
}

func ComparePassword(hashed string, val string) bool {
	secret := logger.GetEnv("AUTH_SECRET")
	if secret == "" {
		secret = "default_secret"
	}

	err := bcrypt.CompareHashAndPassword([]byte(hashed), []byte(val+secret))

	if err != nil {
		return false
	} else {
		return true
	}
}

func GenerateSession() (struct {
	SessionId  uuid.UUID
	RefreshJwt string
	Expiry     time.Time
}, error) {
	sessionId := uuid.New()
	expiry := time.Now().Add(SESSION_LIFETIME)
	secret := logger.GetEnv("JWT_SECRET")

	fmt.Println("Generating session")

	if secret == "" {
		secret = "default_secret"
	}

	refreshJwt, err := jwt.NewWithClaims(jwt.SigningMethodHS512, jwt.MapClaims{
		"session_id": sessionId,
		"exp":        time.Now().Add(REFRESH_LIFETIME).Unix(),
		"iat":        time.Now().Unix(),
		"iss":        "cloud-metric",
	}).SignedString([]byte(secret))

	return struct {
		SessionId  uuid.UUID
		RefreshJwt string
		Expiry     time.Time
	}{
		SessionId:  sessionId,
		RefreshJwt: refreshJwt,
		Expiry:     expiry,
	}, err
}

func ParseJWT(token string) (jwt.MapClaims, error) {
	secret := logger.GetEnv("JWT_SECRET")
	if secret == "" {
		secret = "default_secret"
	}

	claims := jwt.MapClaims{}

	parsedToken, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.NewValidationError("unexpected signing method", jwt.ValidationErrorSignatureInvalid)
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := parsedToken.Claims.(jwt.MapClaims); ok && parsedToken.Valid {
		return claims, nil
	} else {
		return nil, err
	}
}

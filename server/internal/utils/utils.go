package utils

import (
	"time"

	types "github.com/pratham-ak2004/cloud-metric/server/internal/types"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/pratham-ak2004/cloud-metric/server/internal/logger"
	"golang.org/x/crypto/bcrypt"
)

const SESSION_LIFETIME = 7 * 24 * time.Hour
const REFRESH_LIFETIME = 30 * 24 * time.Hour // 30 days

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

func GenerateToken(user types.User) (string, uuid.UUID, time.Time, error) {
	secret := logger.GetEnv("AUTH_SECRET")

	if secret == "" {
		secret = "default_secret"
	}

	// Generate a unique session ID
	sessionId := uuid.New()
	expiry := time.Now().Add(SESSION_LIFETIME)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"data":      user,
		"sessionId": sessionId.String(),
		"exp":       jwt.NewNumericDate(expiry),
		"iat":       jwt.NewNumericDate(time.Now()),
		"jti":       "cloud-metric",
	})

	tokenString, err := token.SignedString([]byte(secret))
	return tokenString, sessionId, expiry, err
}

// ValidateToken verifies if a token is valid
func ValidateToken(tokenString string) (*jwt.Token, error) {
	secret := logger.GetEnv("AUTH_SECRET")
	if secret == "" {
		secret = "default_secret"
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		// Validate signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(secret), nil
	})

	return token, err
}

func GenerateSessionId() (uuid.UUID, uuid.UUID, time.Time) {
	return uuid.New(), uuid.New(), time.Now().Add(SESSION_LIFETIME)
}

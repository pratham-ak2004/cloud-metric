package utils

import (
	"github.com/pratham-ak2004/cloud-metric/server/internal/logger"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(val string) (string, error) {
	secret := logger.GetEnv("AUTH_SECRET")
	if secret == "" {
		secret = "default_secret"
	}

	bytes, err := bcrypt.GenerateFromPassword([]byte(val + secret), 10)
	if err != nil {
		return "", err
	}

	return string(bytes), nil
}

func ComparePassword(hashed string, val string) bool {
	secret := logger.GetEnv("AUTH_SECRET")
	if secret == "" {
		secret = "default"
	}

	err := bcrypt.CompareHashAndPassword([]byte(hashed), []byte(val+secret))

	if err != nil {
		return false
	} else {
		return true
	}
}
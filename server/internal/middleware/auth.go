package middleware

import (
	"context"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/pratham-ak2004/cloud-metric/server/internal/server"
	"github.com/pratham-ak2004/cloud-metric/server/internal/utils"

	database "github.com/pratham-ak2004/cloud-metric/server/internal/server/db"
)

func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sessionToken, err := r.Cookie("session_token")
		db := server.GetDB()

		if err != nil {
			refreshToken, err := r.Cookie("refresh_token")

			if err != nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			newSessionToken, newRefreshToken, expiry := utils.GenerateSessionId()

			_, err = db.UpdateSession(context.Background(), database.UpdateSessionParams{
				Sessiontoken:   newSessionToken.String(),
				Refreshtoken:   newRefreshToken.String(),
				ExpiresAt:      pgtype.Timestamp{Time: expiry, Valid: true},
				Refreshtoken_2: refreshToken.Value,
			})

			if err != nil {
				http.Error(w, "Error Refreshing token", http.StatusInternalServerError)
				return
			}

			sessionToken = &http.Cookie{
				Name:  "session_token",
				Value: newSessionToken.String(),
			}

			http.SetCookie(w, &http.Cookie{
				Name:     "session_token",
				Value:    newSessionToken.String(),
				Path:     "/",
				HttpOnly: true,
				Secure:   true,
				SameSite: http.SameSiteStrictMode,
				MaxAge:   int(time.Until(expiry).Seconds()),
			})
			http.SetCookie(w, &http.Cookie{
				Name:     "refresh_token",
				Value:    newRefreshToken.String(),
				Path:     "/",
				HttpOnly: true,
				Secure:   true,
				SameSite: http.SameSiteStrictMode,
				MaxAge:   int(utils.REFRESH_LIFETIME),
			})
		}

		user, err := db.GetSessionUser(context.Background(), sessionToken.Value)

		if err != nil {
			if err.Error() == "no rows in result set" {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		ctx := context.WithValue(r.Context(), "user", user)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}

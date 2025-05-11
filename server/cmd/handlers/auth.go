package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/pratham-ak2004/cloud-metric/server/internal/server"
	database "github.com/pratham-ak2004/cloud-metric/server/internal/server/db"
	"github.com/pratham-ak2004/cloud-metric/server/internal/utils"
)

func SignUpAPI(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(1024); err != nil {
		http.Error(w, "Error parsing form", http.StatusBadRequest)
		return
	}

	name := r.FormValue("name")
	email := r.FormValue("email")
	password := r.FormValue("password")

	if name == "" || email == "" || password == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	db := server.GetDB()

	userExists, err := db.GetUserByEmail(context.Background(), email)

	if err != nil && err.Error() != "no rows in result set" {
		http.Error(w, "Error checking user existence", http.StatusInternalServerError)
		return
	}

	if userExists.Email == email {
		http.Error(w, "User already exists", http.StatusConflict)
		return
	}

	hashedPassword, err := utils.HashPassword(password)

	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	_, err = db.AddUser(context.Background(), database.AddUserParams{
		Email:    email,
		Name:     name,
		Password: hashedPassword,
	})

	if err != nil {
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	if err := json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully", "status": "success"}); err != nil {
		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
		return
	}
}

func LoginAPI(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(1024); err != nil {
		http.Error(w, "Error parsing form", http.StatusBadRequest)
		return
	}

	email := r.FormValue("email")
	password := r.FormValue("password")

	if email == "" || password == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	db := server.GetDB()

	user, err := db.GetUserByEmail(context.Background(), email)

	if err != nil && err.Error() == "no rows in result set" {
		http.Error(w, "Email not found", http.StatusUnauthorized)
		return
	}

	if !utils.ComparePassword(user.Password, password) {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	sessionToken, refreshToken, expiry := utils.GenerateSessionId()

	_, err = db.CreateSession(context.Background(), database.CreateSessionParams{
		Sessiontoken: sessionToken.String(),
		Refreshtoken: refreshToken.String(),
		UserID:       user.ID,
		ExpiresAt:    pgtype.Timestamp{Time: expiry, Valid: true},
	})

	if err != nil {
		http.Error(w, "Error creating session", http.StatusInternalServerError)
		return
	}

	redirect := r.URL.Query().Get("redirect")

	if redirect == "" {
		redirect = "/"
	}

	response := map[string]string{
		"message":  "Login successful",
		"status":   "success",
		"redirect": redirect,
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    sessionToken.String(),
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   int(time.Until(expiry).Seconds()),
	})
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken.String(),
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   int(utils.REFRESH_LIFETIME),
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
		return
	}
}

func LogoutAPI(w http.ResponseWriter, r *http.Request) {
	session, _ := r.Cookie("session_token")

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   -1,
	})
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   -1,
	})

	if session != nil {
		db := server.GetDB()
		db.DeleteSession(context.Background(), session.Value)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	response := map[string]string{
		"message":  "Logged out successfully",
		"status":   "success",
		"redirect": "/",
	}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
		return
	}
}

// func RefreshSessionAPI(w http.ResponseWriter, r *http.Request) {
// 	refreshToken, err := r.Cookie("refresh_token")

// 	if err != nil {
// 		http.Error(w, "Unauthorized", http.StatusUnauthorized)
// 		return
// 	}

// 	db := server.GetDB()

// 	newSessionToken, newRefreshToken, expiry := utils.GenerateSessionId()

// 	_, err = db.UpdateSession(context.Background(), database.UpdateSessionParams{
// 		Sessiontoken:   newSessionToken.String(),
// 		Refreshtoken:   newRefreshToken.String(),
// 		ExpiresAt:      pgtype.Timestamp{Time: expiry, Valid: true},
// 		Refreshtoken_2: refreshToken.Value,
// 	})

// 	if err != nil {
// 		http.Error(w, "Error creating session", http.StatusInternalServerError)
// 		return
// 	}

// 	http.SetCookie(w, &http.Cookie{
// 		Name:     "session_token",
// 		Value:    newSessionToken.String(),
// 		Path:     "/",
// 		HttpOnly: true,
// 		Secure:   true,
// 		SameSite: http.SameSiteStrictMode,
// 		MaxAge:   int(time.Until(expiry).Seconds()),
// 	})
// 	http.SetCookie(w, &http.Cookie{
// 		Name:     "refresh_token",
// 		Value:    newRefreshToken.String(),
// 		Path:     "/",
// 		HttpOnly: true,
// 		Secure:   true,
// 		SameSite: http.SameSiteStrictMode,
// 		MaxAge:   int(utils.REFRESH_LIFETIME),
// 	})

// 	response := map[string]string{
// 		"message": "Session retrieved successfully",
// 		"status":  "success",
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusOK)

// 	if err := json.NewEncoder(w).Encode(response); err != nil {
// 		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
// 		return
// 	}
// }

func GetSessionUser(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(database.User)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	response := map[string]interface{}{
		"message": "User retrieved successfully",
		"status":  "success",
		"user": map[string]interface{}{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
		},
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
		return
	}
}

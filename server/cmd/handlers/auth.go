package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/pratham-ak2004/cloud-metric/server/internal/server"
	database "github.com/pratham-ak2004/cloud-metric/server/internal/server/db"
	"github.com/pratham-ak2004/cloud-metric/server/internal/utils"
)

func SignUpAPI(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
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
		Email: email,
		Name:  name,
		Password: hashedPassword,
	})

	if err != nil {
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	if err := json.NewEncoder(w).Encode(map[string]string{ "message": "User created successfully", "status": "success"}); err != nil {
		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
		return
	}

}
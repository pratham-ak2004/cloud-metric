package main

import (
	"encoding/json"
	"log"
	"net/http"

	handlers "github.com/pratham-ak2004/cloud-metric/server/cmd/handlers"
	logger "github.com/pratham-ak2004/cloud-metric/server/internal/logger"
	"github.com/pratham-ak2004/cloud-metric/server/internal/middleware"
	routes "github.com/pratham-ak2004/cloud-metric/server/internal/routes"
	server "github.com/pratham-ak2004/cloud-metric/server/internal/server"
)

func Ping(w http.ResponseWriter, r *http.Request) {
	response := map[string]string{"message": "pong"}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Internal server Error", http.StatusInternalServerError)
	}
}

func bindRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/api/auth/signup", routes.POST(handlers.SignUpAPI))
	mux.HandleFunc("/api/auth/login", routes.POST(handlers.LoginAPI))
	mux.HandleFunc("/api/auth/logout", routes.POST(middleware.GlobalMiddleWare(handlers.LogoutAPI)))
	mux.HandleFunc("/api/auth/session", routes.GET(middleware.ProtectedMiddleware(handlers.GetSessionUser)))

	mux.HandleFunc("/api/ping", routes.GET(Ping))
}

func main() {
	logger.LoadEnv()

	host := logger.GetEnv("HOST")
	port := logger.GetEnv("PORT")

	db, err := server.ConnectDB()
	if err != nil {
		log.Fatal(err)
	}
	server.SetDB(db)

	mux := server.GetMux()
	// server.SetFileServer(mux, "./static", "/api")
	routes.BindRoutes(mux, bindRoutes)

	server := server.CreateServer(host+":"+port, mux)

	logger.Logger.Println(logger.Colors["green"] + "Server started on " + logger.Colors["magenta"] + host + ":" + port + logger.Colors["reset"])
	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}

package main

import (
	"log"
	"net/http"

	handlers "github.com/pratham-ak2004/cloud-metric/server/cmd/handlers"
	logger "github.com/pratham-ak2004/cloud-metric/server/internal/logger"
	routes "github.com/pratham-ak2004/cloud-metric/server/internal/routes"
	server "github.com/pratham-ak2004/cloud-metric/server/internal/server"
)

func bindRoutes(mux *http.ServeMux){
	mux.HandleFunc("/api/signup", routes.POST(handlers.SignUpAPI))
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
	server.SetFileServer(mux, "./static")
	routes.BindRoutes(mux, bindRoutes)
	
	server := server.CreateServer(host+":"+port, mux)

	logger.Logger.Println(logger.Colors["green"] + "Server started on " + logger.Colors["magenta"] + host + ":" + port + logger.Colors["reset"])
	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
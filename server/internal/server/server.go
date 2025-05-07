package server

import (
	"net/http"
	"time"

	"github.com/pratham-ak2004/cloud-metric/server/internal/routes"
)

func GetMux() *http.ServeMux {
	mux := http.NewServeMux()
	return mux
}

func SetFileServer(mux *http.ServeMux, path string){
	fileServer := http.FileServer(http.Dir(path))
	mux.Handle("/", routes.FileServerMiddleware(http.StripPrefix("/", fileServer)))
}

func CreateServer(addr string, mux *http.ServeMux) *http.Server {
	server := &http.Server{
		Addr:           addr,
		Handler:        mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	return server 
}
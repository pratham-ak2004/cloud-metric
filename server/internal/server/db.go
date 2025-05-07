package server

import (
	"context"
	"errors"
	"sync"

	"github.com/jackc/pgx/v5"
	"github.com/pratham-ak2004/cloud-metric/server/internal/logger"
	database "github.com/pratham-ak2004/cloud-metric/server/internal/server/db"
)

var (
	db *database.Queries
	once sync.Once
	mu sync.RWMutex
)

func SetDB(d *database.Queries) {
	once.Do(func () {
		mu.Lock()
		defer mu.Unlock()
		db = d
	})
}

func GetDB() *database.Queries {
	mu.RLock()
	defer mu.RUnlock()
	return db
}

func ConnectDB() (*database.Queries, error) {
	conn, err := pgx.Connect(context.Background(), logger.GetEnv("DATABASE_URL"))
	
	if err != nil {
		return nil, errors.New("failed to connect to database")
	}

	if err := conn.Ping(context.Background()); err != nil {
		return nil, errors.New("couldn't reach database")
	}

	logger.Logger.Println(logger.Colors["blue"] + "Connected to database" + logger.Colors["reset"])

	queries := database.New(conn)

	return queries, nil
}
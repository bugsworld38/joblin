package db

import (
	"context"
	"fmt"

	"github.com/bugsworld38/joblin/scraper/config"
	sqlc "github.com/bugsworld38/joblin/scraper/db/sqlc"
	"github.com/jackc/pgx/v5"
)

func Connect(ctx context.Context, cfg config.DBConfig) (*pgx.Conn, error) {
	dbURL := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=%s",
		cfg.User, cfg.Password,
		cfg.Host, cfg.Port,
		cfg.Name, cfg.SSLMode,
	)

	return pgx.Connect(ctx, dbURL)
}

func NewQueries(conn *pgx.Conn) *sqlc.Queries {
	return sqlc.New(conn)
}

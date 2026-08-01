package main

import (
	"context"
	"log"

	"github.com/bugsworld38/joblin/scraper/config"
	"github.com/bugsworld38/joblin/scraper/db"
	"github.com/bugsworld38/joblin/scraper/internal/board"
	"github.com/bugsworld38/joblin/scraper/internal/scraper"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	ctx := context.Background()
	cfg := config.Load()

	conn, err := db.Connect(ctx, cfg.DB)
	if err != nil {
		log.Fatalf("db connect: %v", err)
	}
	defer conn.Close(ctx)

	boards := []board.Board{
		board.NewDou(),
		board.NewDjinni(),
	}

	scraper := scraper.New(db.NewQueries(conn), cfg.Keywords, boards)
	scraper.Run(ctx)
}

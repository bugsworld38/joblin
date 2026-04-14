package main

import (
	"context"
	"log"

	"github.com/bugsworld38/joblin/scraper/internal/board"
)

func main() {
	boards := []board.Board{
		board.NewDou(),
		board.NewDjinni(),
	}

	for _, kw := range []string{"ui/ux"} {
		for _, b := range boards {
			vacancies, err := b.Scrape(context.Background(), kw)
			if err != nil {
				log.Fatal(err)
			}

			log.Printf("[%s][%s] scraped %d vacancies \n", b.Name(), kw, len(vacancies))
		}
	}
}

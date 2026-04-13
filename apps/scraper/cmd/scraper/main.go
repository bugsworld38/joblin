package main

import (
	"context"
	"log"

	"github.com/bugsworld38/joblin/scraper/internal/boards"
)

func main() {
	boards := []boards.Board{
		boards.NewDjinniBoard(),
		boards.NewDouBoard(),
	}

	for _, kw := range []string{"fullstack", "frontend", "backend", "design"} {
		for _, b := range boards {
			vacancies, err := b.Scrape(context.Background(), kw)
			if err != nil {
				log.Fatal(err)
			}

			log.Printf("[%s][%s] scraped %d vacancies \n", b.Name(), kw, len(vacancies))
		}
	}
}

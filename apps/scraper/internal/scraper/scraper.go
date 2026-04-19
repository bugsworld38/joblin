package scraper

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgtype"

	db "github.com/bugsworld38/joblin/scraper/db/sqlc"
	"github.com/bugsworld38/joblin/scraper/internal/board"
)

type Scraper struct {
	queries  *db.Queries
	keywords []string
	boards   []board.Board
}

func New(queries *db.Queries, keywords []string, boards []board.Board) *Scraper {
	return &Scraper{queries: queries, keywords: keywords, boards: boards}
}

func (s *Scraper) Run(ctx context.Context) {
	for _, kw := range s.keywords {
		for _, b := range s.boards {
			vacancies, err := b.Scrape(ctx, kw)
			if err != nil {
				log.Printf("[%s] scrape error: %v", b.Name(), err)
				continue
			}

			saved := 0
			for _, v := range vacancies {
				err := s.queries.UpsertVacancy(ctx, db.UpsertVacancyParams{
					Title:       v.Title,
					CompanyName: v.CompanyName,
					Url:         pgtype.Text{String: v.Url, Valid: true},
					Source:      pgtype.Text{String: b.Name(), Valid: true},
				})
				if err != nil {
					log.Printf("[%s] upsert error for %q: %v", b.Name(), v.Url, err)
					continue
				}

				saved++
			}

			log.Printf("[%s][%s] saved %d/%d vacancies \n", b.Name(), kw, saved, len(vacancies))
		}
	}

	if err := s.queries.ExpireStaleVacancies(ctx); err != nil {
		log.Printf("expire stale vacancies: %v", err)
	} else {
		log.Printf("stale vacancies expired")
	}
}

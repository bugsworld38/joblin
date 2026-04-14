package board

import (
	"context"
)

type Vacancy struct {
	Title       string
	Url         string
	CompanyName string
}

type Board interface {
	Name() string
	Scrape(ctx context.Context, keyword string) ([]Vacancy, error)
}

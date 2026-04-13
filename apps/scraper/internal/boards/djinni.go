package boards

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

type DjinniBoard struct {
	scraper
}

const djinniURL = "https://djinni.co"

func NewDjinniBoard() *DjinniBoard {
	return &DjinniBoard{scraper: newScraper()}
}

func (d *DjinniBoard) Name() string {
	return "djinni"
}

func (d *DjinniBoard) Scrape(ctx context.Context, keyword string) ([]Vacancy, error) {
	var vacancies []Vacancy

	for page := 1; ; page++ {
		doc, err := d.fetchPage(fmt.Sprintf("%s/jobs/?all_keywords=%s&page=%d", djinniURL, keyword, page))
		if err != nil {
			return nil, err
		}

		items := doc.Find(".job-item")
		log.Printf("[djinni][%s] page %d: found %d jobs", keyword, page, items.Length())

		if items.Length() == 0 {
			break
		}

		items.Each(func(i int, s *goquery.Selection) {
			href, exists := s.Find("a.job_item__header-link").Attr("href")
			if !exists {
				return
			}

			v := Vacancy{
				Title:       strings.TrimSpace(s.Find("h2").Text()),
				Url:         djinniURL + href,
				CompanyName: strings.TrimSpace(s.Find(`header span.small`).Text()),
			}
			vacancies = append(vacancies, v)
			log.Printf("[djinni][%s] saved: %s — %s", keyword, v.Title, v.CompanyName)
		})

		nextBtn := doc.Find("ul.pagination.pagination_with_numbers li.page-item.disabled a.page-link span.bi-chevron-right")
		if nextBtn.Length() != 0 {
			break
		}

		time.Sleep(time.Duration(1000+rand.Intn(2000)) * time.Millisecond)
	}

	return vacancies, nil
}

package board

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

type Djinni struct {
	httpClient
}

const djinniURL = "https://djinni.co"

func NewDjinni() *Djinni {
	return &Djinni{httpClient: newHTTPClient()}
}

func (d *Djinni) Name() string {
	return "djinni"
}

func (d *Djinni) Scrape(ctx context.Context, keyword string) ([]Vacancy, error) {
	var vacancies []Vacancy

	for page := 1; ; page++ {
		params := url.Values{}
		params.Set("all_keywords", keyword)
		params.Set("page", fmt.Sprintf("%d", page))
		doc, err := d.fetchPage(fmt.Sprintf("%s/jobs/?%s", djinniURL, params.Encode()))
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

		nextEnabled := doc.Find("ul.pagination li.page-item:not(.disabled) a.page-link span.bi-chevron-right")
		if nextEnabled.Length() == 0 {
			break
		}

		jitter()
	}

	return vacancies, nil
}

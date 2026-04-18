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

const djinniBaseURL = "https://djinni.co"

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

		doc, err := d.fetchPage(ctx, fmt.Sprintf("%s/jobs/?%s", djinniBaseURL, params.Encode()))
		if err != nil {
			return nil, err
		}

		items := parseDjinniItems(doc)
		log.Printf("[djinni][%s] page %d: found %d jobs", keyword, page, len(items))

		if len(items) == 0 {
			break
		}

		vacancies = append(vacancies, items...)

		nextBtn := doc.Find("ul.pagination li.page-item:not(.disabled) a.page-link span.bi-chevron-right")
		if nextBtn.Length() == 0 {
			break
		}

		jitter()
	}

	return vacancies, nil
}

func parseDjinniItems(doc *goquery.Document) []Vacancy {
	var vacancies []Vacancy

	doc.Find(".job-item").Each(func(_ int, s *goquery.Selection) {
		href, exists := s.Find("a.job_item__header-link").Attr("href")
		if !exists {
			return
		}

		vacancies = append(vacancies, Vacancy{
			Title:       strings.TrimSpace(s.Find("h2").Text()),
			Url:         djinniBaseURL + href,
			CompanyName: strings.TrimSpace(s.Find("header span.small").Text()),
		})
	})

	return vacancies
}

package boards

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

type DouBoard struct {
	scraper
}

const douURL = "https://jobs.dou.ua"

func NewDouBoard() *DouBoard {
	return &DouBoard{scraper: newScraper()}
}

func (d *DouBoard) Name() string {
	return "dou"
}

func (d *DouBoard) Scrape(ctx context.Context, keyword string) ([]Vacancy, error) {
	var vacancies []Vacancy

	doc, err := d.fetchPage(fmt.Sprintf("%s/vacancies/?category=%s", douURL, keyword))
	if err != nil {
		return nil, err
	}

	csrf, err := extractCSRF(doc)
	if err != nil {
		return nil, err
	}

	for page := 1; ; page++ {
		more, err := d.loadMore(csrf, len(vacancies), keyword)
		if err != nil {
			return nil, err
		}

		items := more.Find("li.l-vacancy")
		log.Printf("[dou][%s] page %d: found %d jobs", keyword, page, items.Length())

		if items.Length() == 0 {
			break
		}

		items.Each(func(_ int, s *goquery.Selection) {
			href, exists := s.Find("a.vt").Attr("href")
			if !exists {
				return
			}

			v := Vacancy{
				Title:       strings.TrimSpace(s.Find("a.vt").Text()),
				Url:         href,
				CompanyName: strings.TrimSpace(s.Find("a.company").Text()),
			}
			vacancies = append(vacancies, v)
			log.Printf("[dou][%s] saved: %s — %s", keyword, v.Title, v.CompanyName)
		})

		time.Sleep(time.Duration(1000+rand.Intn(2000)) * time.Millisecond)
	}

	return vacancies, nil
}

type douResponse struct {
	HTML string `json:"html"`
}

func parseDouResponse(res *http.Response) (*goquery.Document, error) {
	var data douResponse

	if err := json.NewDecoder(res.Body).Decode(&data); err != nil {
		return nil, err
	}

	return goquery.NewDocumentFromReader(strings.NewReader(data.HTML))
}

func (d *DouBoard) loadMore(csrf string, count int, keyword string) (*goquery.Document, error) {
	data := url.Values{}
	data.Set("csrfmiddlewaretoken", csrf)
	data.Set("count", fmt.Sprintf("%d", count))

	req, err := http.NewRequest("POST",
		fmt.Sprintf("%s/vacancies/xhr-load/?category=%s", douURL,
			keyword),
		strings.NewReader(data.Encode()),
	)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36")
	req.Header.Set("X-Requested-With", "XMLHttpRequest")
	req.Header.Set("Referer", fmt.Sprintf("%s/vacancies/?category=%s", douURL, keyword))
	req.Header.Set("Origin", douURL)

	res, err := d.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		return nil, fmt.Errorf("status code error: %d, %s", res.StatusCode, res.Status)
	}

	return parseDouResponse(res)
}

var csrfRe = regexp.MustCompile(`window\.CSRF_TOKEN\s*=\s*"([^"]+)"`)

func extractCSRF(doc *goquery.Document) (string, error) {
	var token string

	doc.Find("script").Each(func(_ int, s *goquery.Selection) {
		matches := csrfRe.FindStringSubmatch(s.Text())
		if len(matches) > 1 {
			token = matches[1]
		}
	})

	if token == "" {
		return "", fmt.Errorf("csrf token not found")
	}

	return token, nil
}

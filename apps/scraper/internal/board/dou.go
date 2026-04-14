package board

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"regexp"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

type Dou struct {
	httpClient
}

const douURL = "https://jobs.dou.ua"
const douMaxPages = 100

func NewDou() *Dou {
	return &Dou{httpClient: newHTTPClient()}
}

func (d *Dou) Name() string {
	return "dou"
}

func (d *Dou) Scrape(ctx context.Context, keyword string) ([]Vacancy, error) {
	var vacancies []Vacancy

	params := url.Values{}
	params.Set("search", keyword)
	doc, err := d.fetchPage(fmt.Sprintf("%s/vacancies/?%s", douURL, params.Encode()))
	if err != nil {
		return nil, err
	}

	csrf, err := extractCSRF(doc)
	if err != nil {
		return nil, err
	}

	for page := 1; page <= douMaxPages; page++ {
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

		jitter()
	}

	return vacancies, nil
}

func (d *Dou) loadMore(csrf string, count int, keyword string) (*goquery.Document, error) {
	params := url.Values{}
	params.Set("search", keyword)

	body := url.Values{}
	body.Set("csrfmiddlewaretoken", csrf)
	body.Set("count", fmt.Sprintf("%d", count))

	req, err := http.NewRequest("POST",
		fmt.Sprintf("%s/vacancies/xhr-load/?%s", douURL, params.Encode()),
		strings.NewReader(body.Encode()),
	)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
	req.Header.Set("X-Requested-With", "XMLHttpRequest")
	req.Header.Set("Referer", fmt.Sprintf("%s/vacancies/?%s", douURL, params.Encode()))
	req.Header.Set("Origin", douURL)

	res, err := d.execute(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	return parseDouResponse(res)
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

var csrfRe = regexp.MustCompile(`window\.CSRF_TOKEN\s*=\s*"([^"]+)"`)

func extractCSRF(doc *goquery.Document) (string, error) {
	var token string

	doc.Find("script").EachWithBreak(func(_ int, s *goquery.Selection) bool {
		matches := csrfRe.FindStringSubmatch(s.Text())
		if len(matches) > 1 {
			token = matches[1]
			return false
		}
		return true
	})

	if token == "" {
		return "", fmt.Errorf("csrf token not found")
	}

	return token, nil
}

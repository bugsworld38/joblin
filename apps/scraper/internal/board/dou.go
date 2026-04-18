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

const douBaseURL = "https://jobs.dou.ua"
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
	doc, err := d.fetchPage(ctx, fmt.Sprintf("%s/vacancies/?%s", douBaseURL, params.Encode()))
	if err != nil {
		return nil, err
	}

	csrf, err := extractCSRF(doc)
	if err != nil {
		return nil, err
	}

	for page := 1; page <= douMaxPages; page++ {
		more, err := d.loadMore(ctx, csrf, len(vacancies), keyword)
		if err != nil {
			return nil, err
		}

		items := parseDouItems(more)
		log.Printf("[dou][%s] page %d: found %d jobs", keyword, page, len(items))

		if len(items) == 0 {
			break
		}

		vacancies = append(vacancies, items...)

		jitter()
	}

	return vacancies, nil
}

func (d *Dou) loadMore(ctx context.Context, csrf string, count int, keyword string) (*goquery.Document, error) {
	params := url.Values{}
	params.Set("search", keyword)

	body := url.Values{}
	body.Set("csrfmiddlewaretoken", csrf)
	body.Set("count", fmt.Sprintf("%d", count))

	req, err := http.NewRequestWithContext(ctx, "POST",
		fmt.Sprintf("%s/vacancies/xhr-load/?%s", douBaseURL, params.Encode()),
		strings.NewReader(body.Encode()),
	)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
	req.Header.Set("X-Requested-With", "XMLHttpRequest")
	req.Header.Set("Referer", fmt.Sprintf("%s/vacancies/?%s", douBaseURL, params.Encode()))
	req.Header.Set("Origin", douBaseURL)

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

func parseDouItems(doc *goquery.Document) []Vacancy {
	var vacancies []Vacancy

	doc.Find("li.l-vacancy").Each(func(_ int, s *goquery.Selection) {
		href, exists := s.Find("a.vt").Attr("href")
		if !exists {
			return
		}

		vacancies = append(vacancies, Vacancy{
			Title:       strings.TrimSpace(s.Find("a.vt").Text()),
			Url:         href,
			CompanyName: strings.TrimSpace(s.Find("a.company").Text()),
		})
	})

	return vacancies
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

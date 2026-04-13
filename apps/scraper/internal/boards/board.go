package boards

import (
	"context"
	"fmt"
	"net/http"
	"net/http/cookiejar"
	"time"

	"github.com/PuerkitoBio/goquery"
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

type scraper struct {
	client *http.Client
}

func newScraper() scraper {
	jar, _ := cookiejar.New(nil)
	return scraper{
		client: &http.Client{
			Timeout: 10 * time.Second,
			Jar:     jar,
		},
	}
}

func (s *scraper) fetchPage(url string) (*goquery.Document, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

	res, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		return nil, fmt.Errorf("status code error: %d, %s", res.StatusCode, res.Status)
	}

	return goquery.NewDocumentFromReader(res.Body)
}

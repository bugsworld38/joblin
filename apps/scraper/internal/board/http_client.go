package board

import (
	"fmt"
	"math/rand"
	"net/http"
	"net/http/cookiejar"
	"time"

	"github.com/PuerkitoBio/goquery"
)

type httpClient struct {
	client *http.Client
}

const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

func newHTTPClient() httpClient {
	jar, err := cookiejar.New(nil)
	if err != nil {
		panic(err)
	}

	return httpClient{
		client: &http.Client{
			Timeout: 10 * time.Second,
			Jar:     jar,
		},
	}
}

func (h *httpClient) execute(req *http.Request) (*http.Response, error) {
	req.Header.Set("User-Agent", userAgent)

	res, err := h.client.Do(req)
	if err != nil {
		return nil, err
	}
	if res.StatusCode != 200 {
		res.Body.Close()
		return nil, fmt.Errorf("status code error: %d, %s", res.StatusCode, res.Status)
	}

	return res, nil
}

func (h *httpClient) fetchPage(url string) (*goquery.Document, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	res, err := h.execute(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	return goquery.NewDocumentFromReader(res.Body)
}

func jitter() {
	time.Sleep(time.Duration(1000+rand.Intn(2000)) * time.Millisecond)
}

package board

import (
	"math/rand"
	"time"
)

func jitter() {
	time.Sleep(time.Duration(1000+rand.Intn(2000)) * time.Millisecond)
}

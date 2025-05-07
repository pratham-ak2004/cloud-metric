package logger

import (
	"net/http"
	"time"
)

var logger = Logger
var colors = Colors

func Timer(method string, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		next(w, r)

		end := time.Since(start).Microseconds()
		var timeColor string
		if end < 1000 {
			timeColor = colors["green"]
		} else if end < 10000 {
			timeColor = colors["yellow"]
		} else {
			timeColor = colors["red"]
		}

		logger.Printf("%s %d%s %s %s", timeColor, end, "µs", method, colors["reset"]+r.URL.Path)
	}
}

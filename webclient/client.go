package webclient

import (
	"fmt"
	"net/http"
	"strconv"
)

func handler(w http.ResponseWriter, r *http.Request) {
	key := CreateCookie()
	keyStr := strconv.Itoa(key)
	fmt.Fprintf(w, keyStr, r.URL.Path[1:])
}

func main() {
	http.HandleFunc("/", handler)
	http.ListenAndServe(":8080", nil)

}

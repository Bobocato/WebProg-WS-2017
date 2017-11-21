package webclient

import (
	"WebProg/database"
	"fmt"
	"net/http"
	"strconv"
)

func main() {
	http.HandleFunc("/", handler)
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/register", registerHandler)
	http.ListenAndServe(":8080", nil)
}

func handler(w http.ResponseWriter, r *http.Request) {
	key := CreateCookie()
	keyStr := strconv.Itoa(key)
	fmt.Fprintf(w, keyStr, r.URL.Path[1:])
}

func loginHandler(w http.ResponseWriter, r *http.Request){
	//Is he trying to "GET" the page, or request a login?
	if r.Method == "POST"{
		r.ParseForm()
		username := r.Form["username_login"]
		password := r.Form["password_login"]
		user := database.LoginUser(username, password)
		if user.UserID == -1 {
			//No user with this name and pw
		} else {
			//Log user in
		}
	} else {
		//TODO Show login Page
	}
	SetCookie(w ResponseWriter, cookie *Cookie)
}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	//Is he trying to "GET" the page, or request a registration?
	if r.Method == "POST"{
		r.ParseForm()
		username := r.Form["username_register"]
		password := r.Form["password_register"]
		user := database.RegisterUser(username, password)
		if user.UserID == -1 {
			//User can't be registerd Name is used
		} else {
			//User was created and should be logged in 
		}
	} else {
		//TODO Show login Page
	}
}
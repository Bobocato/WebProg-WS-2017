package webclient

import (
	"WebProg/database"
	"fmt"
	"net/http"
	"strconv"
	"text/template"
)

//InitWS starts the Webservers for the home UI
func InitWS() {
	//Handle functions and css+js injection for the diffrent pages
	http.HandleFunc("/", handler)

	//http.Handle("/login", http.StripPrefix("/login", http.FileServer(http.Dir("webclient/css"))))
	//http.Handle("/login", http.FileServer(http.Dir("webclient/html/")))
	//http.Handle("/login", http.FileServer(http.Dir("webclient/js/")))
	http.HandleFunc("/login", loginHandler)

	http.HandleFunc("/register", registerHandler)

	http.ListenAndServe(":8080", nil)
}

func handler(w http.ResponseWriter, r *http.Request) {
	key := database.CreateCookie()
	keyStr := strconv.Itoa(key)
	fmt.Fprintf(w, keyStr, r.URL.Path[1:])
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	//Is he trying to "GET" the page, or request a login?
	if r.Method == "POST" {
		r.ParseForm()
		username := r.Form["username_login"][0]
		password := r.Form["password_login"][0]
		user := database.LoginUser(username, password)
		if user.UserID == -1 {
			//No user with this name and pw
		} else {
			//Log user in
		}
	} else {
		//TODO Show login Page
		t := template.New("loginTemplate")
		t, _ = t.ParseFiles("html/login.html", nil)
		t.Execute()
	}
	//SetCookie(w ResponseWriter, cookie *Cookie)
}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	//Is he trying to "GET" the page, or request a registration?
	if r.Method == "POST" {
		r.ParseForm()
		username := r.Form["username_register"][0]
		password := r.Form["password_register"][0]
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

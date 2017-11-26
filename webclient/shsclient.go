package webclient

import (
	"WebProg/database"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"text/template"
	"time"
)

type header struct {
	Title string
}

//Create a global uservariable with the standart id of -1
//TODO change this, every User will be logged in with this account variable is serverwide....
var currentUser = database.User{
	UserID:       -1,
	Username:     "nil",
	Password:     "nil",
	HouseID:      -1,
	Lastregister: time.Now(),
	Cookie:       make([]int, 0),
}

//InitWS starts the Webservers for the home UI. This is called from main.go
func InitWS() {
	//Create a fileserver and uplaod the CSS and JS files. These will be loaded through the templates.
	http.Handle("/CSS/", http.StripPrefix("/CSS/", http.FileServer(http.Dir("../webclient/CSS"))))
	http.Handle("/JS/", http.StripPrefix("/JS/", http.FileServer(http.Dir("../webclient/JS"))))
	//Hanlde diffrent pages.
	http.HandleFunc("/", handler)
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/register", registerHandler)
	http.HandleFunc("/shs", mainPageHandler)
	//Handle ajax requests
	http.HandleFunc("/api/lamp", lampHandler)
	http.HandleFunc("/api/shutter", shutterHandler)
	http.HandleFunc("/api/scene", sceneHandler)
	http.HandleFunc("/api/logout", logoutHandler)
	//Start listening on port 8080
	http.ListenAndServe(":8080", nil)
}

//--------------------------------
//----------Ajax Handler----------
//--------------------------------
func logoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		r.ParseForm()
		username := r.Form["username_login"][0]
		database.DeleteCookieUser(username)
		http.Redirect(w, r, "/login?error=goodbye", 301)
	}
}

func lampHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		decoder := json.NewDecoder(r.Body)
		defer r.Body.Close()
		var lamp database.Lamp
		err := decoder.Decode(&lamp)
		if err != nil {
			//Rip decoder
			panic(err)
		}
		database.Pushlamp(lamp)
	} else if r.Method == "GET" {
		//lamps := database.Getlamps()

	} else if r.Method == "DELETE" {

	}
}

func shutterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {

	} else if r.Method == "GET" {

	} else if r.Method == "DELETE" {

	}
}

func sceneHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {

	} else if r.Method == "GET" {

	} else if r.Method == "DELETE" {

	}
}

func roomHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {

	} else if r.Method == "GET" {

	} else if r.Method == "DELETE" {

	}
}

//--------------------------------
//----------Page Handler----------
//--------------------------------
//Index Page => forwarding and automatic login
func handler(w http.ResponseWriter, r *http.Request) {
	//TODO get cookie and try to log in user
	key := database.CreateCookie()
	keyStr := strconv.Itoa(key)
	fmt.Fprintf(w, keyStr, r.URL.Path[1:])
	fmt.Fprintf(w, currentUser.Username, r.URL.Path[1:])
}

//Load the main page
func mainPageHandler(w http.ResponseWriter, r *http.Request) {
	if currentUser.UserID != -1 {
		//There is a logged in user
		//Show main page
		header := header{
			Title: "Your to:Huus",
		}
		t := template.Must(template.ParseFiles("../webclient/html/shs/header.html", "../webclient/html/shs/shs.html"))
		t.ExecuteTemplate(w, "header", header)
		t.ExecuteTemplate(w, "shs", nil)
		//t.ExecuteTemplate(w, "ending", nil)
	} else {
		//There is no logged in User
		http.Redirect(w, r, "/login?error=notLoggedin", 301)
	}

}

//Loginpage POST Handler for login requests and else for loading the page
func loginHandler(w http.ResponseWriter, r *http.Request) {
	//Is he trying to "GET" the page, or request a login?
	if r.Method == "POST" {
		r.ParseForm()
		username := r.Form["username_login"][0]
		password := r.Form["password_login"][0]
		user := database.LoginUser(username, password)
		if user.UserID == -1 {
			//No user with this name and pw
			http.Redirect(w, r, "/login?error=wrongUser", 301)

		} else {
			//Log user in
			//TODO set cookie
			currentUser = user
			http.Redirect(w, r, "/shs", 301)
		}
	} else {
		// Show login Page
		header := header{
			Title: "Login to:Huus",
		}
		t := template.Must(template.ParseFiles("../webclient/html/login/header.html", "../webclient/html/login/login.html"))
		t.ExecuteTemplate(w, "header", header)
		t.ExecuteTemplate(w, "login", nil)
		//t.ExecuteTemplate(w, "ending", nil)
	}
	//SetCookie(w ResponseWriter, cookie *Cookie)
}

//Registerhandler POST for new registrations and else for html gets
func registerHandler(w http.ResponseWriter, r *http.Request) {
	//Is he trying to "GET" the page, or request a registration?
	if r.Method == "POST" {
		r.ParseForm()
		username := r.Form["username_register"][0]
		password := r.Form["password_register"][0]
		user := database.RegisterUser(username, password)
		if user.UserID == -1 {
			//User can't be registerd Name is used
			//Name already taken
			http.Redirect(w, r, "/login?error=usernameTaken", 301)
		} else {
			//User was created and should be logged in
			//TODO set cookie
			currentUser = user
			http.Redirect(w, r, "/shs", 301)
		}
	} else {
		//Show register page
		header := header{
			Title: "Register to:Huus",
		}
		t := template.Must(template.ParseFiles("../webclient/html/login/header.html", "../webclient/html/login/register.html"))
		t.ExecuteTemplate(w, "header", header)
		t.ExecuteTemplate(w, "register", nil)
		//t.ExecuteTemplate(w, "ending", nil)
	}
}

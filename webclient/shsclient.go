package webclient

import (
	"WebProg/database"
	"encoding/json"
	"net/http"
	"strconv"
	"text/template"
	"time"
)

type header struct {
	Title string
}

type userData struct {
	Data string
}

type updateRoom struct {
	Name      string
	RoomId    int
	Lamps     []database.Lamp
	Shutters  []database.Shutter
	Radiators []database.Radiator
}

//Create a global uservariable with the standart id of -1
//TODO change this, every User will be logged in with this account variable is serverwide....
/*var currentUser = database.User{
	UserID:       -1,
	Username:     "nil",
	Password:     "nil",
	HouseID:      -1,
	Lastregister: time.Now(),
	Cookie:       make([]int, 0),
}*/

//InitWS starts the Webservers for the home UI. This is called from main.go
func InitWS() {
	//Create a fileserver and uplaod the CSS and JS files. These will be loaded through the templates.
	http.Handle("/CSS/", http.StripPrefix("/CSS/", http.FileServer(http.Dir("../webclient/CSS"))))
	http.Handle("/JS/", http.StripPrefix("/JS/", http.FileServer(http.Dir("../webclient/JS"))))
	http.Handle("/ICON/", http.StripPrefix("/ICON/", http.FileServer(http.Dir("../webclient/ICON"))))
	//Hanlde diffrent pages.
	http.HandleFunc("/", handler)
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/register", registerHandler)
	http.HandleFunc("/shs", mainPageHandler)
	//Handle ajax requests
	http.HandleFunc("/api/lamp", lampHandler)
	http.HandleFunc("/api/shutter", shutterHandler)
	http.HandleFunc("/api/radiator", radiatorHandler)
	http.HandleFunc("/api/scene", sceneHandler)
	http.HandleFunc("/api/logout", logoutHandler)
	http.HandleFunc("/api/room", roomHandler)
	http.HandleFunc("/api/settings", settingsHandler)
	//Start listening on port 8080
	http.ListenAndServe(":8080", nil)
}

//--------------------------------
//----------Ajax Handler----------
//--------------------------------
//TODO Write update handlers
func settingsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "DELETE" {
		for _, cookie := range r.Cookies() {
			cookieValue, _ := strconv.Atoi(cookie.Value)
			database.DeleteUser(cookieValue)
		}

	}
}

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
		var lamp database.Lamp
		err := decoder.Decode(&lamp)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		success := database.Pushlamp(lamp)
		response, _ := json.Marshal(success)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	} else if r.Method == "GET" {
		lamps := database.Getlamps()
		response, _ := json.Marshal(lamps)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	} else if r.Method == "DELETE" {
		decoder := json.NewDecoder(r.Body)
		var lamp database.Lamp
		err := decoder.Decode(&lamp)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		database.Deletelamp(lamp.LampID)
		response, _ := json.Marshal(true)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	} else if r.Method == "UPDATE" {
		decoder := json.NewDecoder(r.Body)
		var lamp database.Lamp
		err := decoder.Decode(&lamp)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		database.UpdateLamp(lamp)
		response, _ := json.Marshal(true)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	}
}

func shutterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		decoder := json.NewDecoder(r.Body)
		var shutter database.Shutter
		err := decoder.Decode(&shutter)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		success := database.Pushshutter(shutter)
		response, _ := json.Marshal(success)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	} else if r.Method == "GET" {
		shutters := database.Getshutter()
		response, _ := json.Marshal(shutters)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	} else if r.Method == "DELETE" {
		decoder := json.NewDecoder(r.Body)
		var shutter database.Shutter
		err := decoder.Decode(&shutter)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		database.Deleteshutter(shutter.ShutterID)
		response, _ := json.Marshal(true)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	} else if r.Method == "UPDATE" {
		decoder := json.NewDecoder(r.Body)
		var shutter database.Shutter
		err := decoder.Decode(&shutter)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		database.UpdateShutter(shutter)
		response, _ := json.Marshal(true)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	}
}

func radiatorHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		decoder := json.NewDecoder(r.Body)
		var radiator database.Radiator
		err := decoder.Decode(&radiator)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		success := database.Pushradiator(radiator)
		response, _ := json.Marshal(success)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	} else if r.Method == "GET" {
		radiator := database.Getradiators()
		response, _ := json.Marshal(radiator)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)

	} else if r.Method == "DELETE" {
		decoder := json.NewDecoder(r.Body)
		var radiator database.Radiator
		err := decoder.Decode(&radiator)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		database.Deleteradiator(radiator.RadiatorID)
		response, _ := json.Marshal(true)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	} else if r.Method == "UPDATE" {
		decoder := json.NewDecoder(r.Body)
		var radiator database.Radiator
		err := decoder.Decode(&radiator)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		database.UpdateRadiator(radiator)
		response, _ := json.Marshal(true)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	}
}

func sceneHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		decoder := json.NewDecoder(r.Body)
		var scene database.Scene
		err := decoder.Decode(&scene)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		success := database.Pushscene(scene)
		response, _ := json.Marshal(success)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	} else if r.Method == "GET" {
		scenes := database.Getsences()
		response, _ := json.Marshal(scenes)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	} else if r.Method == "DELETE" {
		decoder := json.NewDecoder(r.Body)
		var scene database.Scene
		err := decoder.Decode(&scene)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		database.Deletescene(scene.SceneID)
		response, _ := json.Marshal(true)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	} else if r.Method == "UPDATE" {
		decoder := json.NewDecoder(r.Body)
		var scene database.Scene
		err := decoder.Decode(&scene)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		database.UpdateScene(scene)
		response, _ := json.Marshal(true)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	} else if r.Method == "PUT" {
		decoder := json.NewDecoder(r.Body)
		var scene database.Scene
		err := decoder.Decode(&scene)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		success := database.Startscene(scene)
		response, _ := json.Marshal(success)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	}
}

func roomHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		decoder := json.NewDecoder(r.Body)
		var room database.Room
		err := decoder.Decode(&room)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		success := database.Pushroom(room)
		response, _ := json.Marshal(success)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)

	} else if r.Method == "GET" {
		rooms := database.Getrooms()
		response, _ := json.Marshal(rooms)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)

	} else if r.Method == "DELETE" {
		decoder := json.NewDecoder(r.Body)
		var deleteRoom updateRoom
		err := decoder.Decode(&deleteRoom)
		if err != nil {
			panic(err)
		}
		database.DeleteAllRoom(deleteRoom.RoomId)
		response, _ := json.Marshal(true)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	} else if r.Method == "UPDATE" {
		decoder := json.NewDecoder(r.Body)
		var upRoom updateRoom
		err := decoder.Decode(&upRoom)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		//Change Room Name
		room := database.Room{
			RoomID: upRoom.RoomId,
			Name:   upRoom.Name,
		}
		database.DeleteAllRoom(room.RoomID)
		database.Pushroom(room)
		//Change Lamps
		for _, lamp := range upRoom.Lamps {
			database.Pushlamp(lamp)
		}
		//Change Shutter
		for _, shutter := range upRoom.Shutters {
			database.Pushshutter(shutter)
		}
		//Change Radiators
		for _, radiator := range upRoom.Radiators {
			database.Pushradiator(radiator)
		}
		response, _ := json.Marshal(true)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	}
}

//--------------------------------
//----------Page Handler----------
//--------------------------------
//Index Page => forwarding and automatic login
func handler(w http.ResponseWriter, r *http.Request) {
	//get cookie and try to log in user
	user := cookieLogin(r)
	//fmt.Println(user)
	if user.UserID == -1 {
		//No User in the cookies
		http.Redirect(w, r, "/login", 301)
	} else {
		//User with cookie authenticated, send user to main page
		http.Redirect(w, r, "/shs", 301)
	}
}

//Load the main page
func mainPageHandler(w http.ResponseWriter, r *http.Request) {
	user := cookieLogin(r)
	if user.UserID != -1 {
		//There is a logged in user
		//Show main page
		header := header{
			Title: "Your to:Huus",
		}
		data, _ := json.Marshal(user)
		userData := userData{
			Data: string(data),
		}
		t := template.Must(template.ParseFiles("../webclient/html/shs/header.html", "../webclient/html/shs/shs.html"))
		t.ExecuteTemplate(w, "header", header)
		t.ExecuteTemplate(w, "shs", userData)
		//t.ExecuteTemplate(w, "ending", nil)
	} else {
		//There is no logged in User
		http.Redirect(w, r, "/login?error=notLoggedin", 301)
	}

}

//Loginpage POST Handler for login requests and else for loading the page
func loginHandler(w http.ResponseWriter, r *http.Request) {
	//Try to log the cookie user in
	user := cookieLogin(r)
	//fmt.Println(user)
	if user.UserID != -1 {
		http.Redirect(w, r, "/shs", 301)
	}
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
			cookieValue := database.CreateCookie()
			database.SetCookie(username, cookieValue)
			cookieValueStr := strconv.Itoa(cookieValue)
			cookie := http.Cookie{
				Name:   username,
				Value:  cookieValueStr,
				MaxAge: 0,
			}
			http.SetCookie(w, &cookie)
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
}

//Registerhandler POST for new registrations and else for html gets
func registerHandler(w http.ResponseWriter, r *http.Request) {
	//Try to log the cookie user in
	user := cookieLogin(r)
	if user.UserID != -1 {
		http.Redirect(w, r, "/shs", 301)
	}
	//Is he trying to "GET" the page, or request a registration?
	if r.Method == "POST" {
		r.ParseForm()
		username := r.Form["username_register"][0]
		password := r.Form["password_register"][0]
		user := database.RegisterUser(username, password)
		if user.UserID == -1 {
			//User can't be registerd Name is used
			//Name already taken
			//TODO make js and html for this! (register site error message)
			http.Redirect(w, r, "/register?error=usernameTaken", 301)
		} else {
			//User was created and should be logged in
			cookieValue := database.CreateCookie()
			database.SetCookie(username, cookieValue)
			cookieValueStr := strconv.Itoa(cookieValue)
			cookie := http.Cookie{
				Name:   username,
				Value:  cookieValueStr,
				MaxAge: 0,
			}
			http.SetCookie(w, &cookie)
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
		//The ending seems to automatic, at least the documents got an end
		//t.ExecuteTemplate(w, "ending", nil)
	}
}

func cookieLogin(r *http.Request) (user database.User) {
	//fmt.Println("cookieLogin")
	user = database.User{
		UserID:       -1,
		Username:     "nil",
		Password:     "nil",
		HouseID:      -1,
		Lastregister: time.Now(),
		Cookie:       make([]int, 0),
	}
	for _, cookie := range r.Cookies() {
		str, _ := strconv.Atoi(cookie.Value)
		//fmt.Println(cookie)
		user := database.CheckCookie(str)
		if user.UserID != -1 {
			return user
		}
	}
	return user
}

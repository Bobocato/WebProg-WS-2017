package simulator

import (
	"html/template"
	"net/http"
)

type header struct {
	Title string
}

//InitSim initializes the simulater UI
func InitSim() {
	//Create a fileserver and uplaod the CSS and JS files. These will be loaded through the templates.
	http.Handle("/CSS/", http.StripPrefix("/CSS/", http.FileServer(http.Dir("../simulator/CSS"))))
	http.Handle("/JS/", http.StripPrefix("/JS/", http.FileServer(http.Dir("../simulator/JS"))))
	//http.Handle("/ICON/", http.StripPrefix("/ICON/", http.FileServer(http.Dir("../simulator/ICON"))))
	//Hanlde diffrent pages.
	http.HandleFunc("/", handler)
	//Handle ajax calls
	http.HandleFunc("/startstop", startStopHandler)
	http.HandleFunc("/timeJump", timeJumpHandler)
	http.HandleFunc("/zoom", zoomHandler)
	http.HandleFunc("/simTime", simTime)
	//Start listening on port 8080
	http.ListenAndServe(":9090", nil)
}

func handler(w http.ResponseWriter, r *http.Request) {
	//Show simulator page
	header := header{
		Title: "Simulator to:Huus",
	}
	t := template.Must(template.ParseFiles("../simulator/html/header.html", "../simulator/html/sim.html"))
	t.ExecuteTemplate(w, "header", header)
	t.ExecuteTemplate(w, "simulator", nil)
}

func startStopHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {

	}
}

func timeJumpHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {

	}
}

func zoomHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {

	}
}

func simTime(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {

	}
}

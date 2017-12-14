package simulator

import (
	"WebProg/database"
	"encoding/json"
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
	http.HandleFunc("/simcon", simcon)
	//Start listening on port 8080
	http.ListenAndServe(":9090", nil)
}

func handler(w http.ResponseWriter, r *http.Request) {
	//Show simulator page
	database.InitSimColl()
	header := header{
		Title: "Simulator to:Huus",
	}
	t := template.Must(template.ParseFiles("../simulator/html/header.html", "../simulator/html/sim.html"))
	t.ExecuteTemplate(w, "header", header)
	t.ExecuteTemplate(w, "simulator", nil)
}

func startStopHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		res := database.ToggleRunning()
		response, _ := json.Marshal(res)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	}
}

func timeJumpHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		decoder := json.NewDecoder(r.Body)
		var simcon database.SimulatorControl
		err := decoder.Decode(&simcon)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		res := database.ChangeFutureTime(simcon.FutureSimDayTime, true)
		response, _ := json.Marshal(res)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	}
}

func zoomHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		decoder := json.NewDecoder(r.Body)
		var simcon database.SimulatorControl
		err := decoder.Decode(&simcon)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()
		res := database.SetZoom(simcon.Zoom)
		response, _ := json.Marshal(res)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	}
}

func simcon(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		res := database.GetSimCon()
		response, _ := json.Marshal(res)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	}
}

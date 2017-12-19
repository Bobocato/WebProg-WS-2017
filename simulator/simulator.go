package simulator

import (
	"WebProg/database"
	"encoding/json"
	"encoding/xml"
	"html/template"
	"net/http"
)

type header struct {
	Title string
}

type link struct {
	Address string
}

//InitSim initializes the simulater UI
func InitSim() {
	//Create a fileserver and uplaod the CSS and JS files. These will be loaded through the templates.
	http.Handle("/CSS/", http.StripPrefix("/CSS/", http.FileServer(http.Dir("../simulator/CSS"))))
	http.Handle("/JS/", http.StripPrefix("/JS/", http.FileServer(http.Dir("../simulator/JS"))))
	http.Handle("/XML/", http.StripPrefix("/XML/", http.FileServer(http.Dir("../simulator/XML"))))
	//Hanlde diffrent pages.
	http.HandleFunc("/", handler)
	//Handle ajax calls
	http.HandleFunc("/startstop", startStopHandler)
	http.HandleFunc("/timeJump", timeJumpHandler)
	http.HandleFunc("/zoom", zoomHandler)
	http.HandleFunc("/simcon", simcon)
	http.HandleFunc("/xmldb", databasexml)
	//Start listening on port 8080
	http.ListenAndServe(":9090", nil)
}

//Handle the xml DB stuff
func databasexml(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		//Send link to db
		link := link{
			Address: database.DBinXML(),
		}
		response, _ := json.Marshal(link)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)

	} else if r.Method == "POST" {
		var dbData database.DBXML
		xmldecoder := xml.NewDecoder(r.Body)
		xmldecoder.Decode(&dbData)
		defer r.Body.Close()
		//fmt.Println(dbData)
		database.XMLtoDB(dbData)
		response, _ := json.Marshal(true)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	}
}

//Start simulator on load
func handler(w http.ResponseWriter, r *http.Request) {
	//Show simulator page
	database.InitSimColl()
	header := header{
		Title: "Simulator to:Huus",
	}
	t := template.Must(template.ParseFiles("../simulator/html/header.html", "../simulator/html/sim.html"))
	t.ExecuteTemplate(w, "header", header)
	t.ExecuteTemplate(w, "simulator", nil)
	StartTicker()
}

//handle simulator running
func startStopHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		res := database.ToggleRunning()
		response, _ := json.Marshal(res)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	}
}

//Sets new time in point
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

//set the zoom for the simulation
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

//retrun the simcon
func simcon(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		res := database.GetSimCon()
		response, _ := json.Marshal(res)
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
	}
}

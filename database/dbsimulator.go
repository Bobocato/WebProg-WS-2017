package database

import (
	"encoding/xml"
	"io"
	"os"
	"time"

	"gopkg.in/mgo.v2/bson"
)

//SimulatorControl struct for the DB
type SimulatorControl struct {
	CurrentSimDayTime     int64
	FutureSimDayTime      int64
	FutureTimeDateChanged bool
	SunsetTimestamp       int64
	SunriseTimestamp      int64
	Zoom                  int64
	IsRunning             bool
}

//DBXML struct
type DBXML struct {
	Users     []User           `xml:"users"`
	Rooms     []Room           `xml:"rooms"`
	Scenes    []Scene          `xml:"scenes"`
	Lamps     []Lamp           `xml:"lamps"`
	Radiators []Radiator       `xml:"radiators"`
	Shutters  []Shutter        `xml:"shutters"`
	Simulator SimulatorControl `xml:"simulator"`
}

//InitSimColl removes old simcollections and pastes a new "empty" one
func InitSimColl() {
	session := connectDB()
	defer session.Close()
	simcoll := session.DB("HA17DB_jesse_arff_590245").C("simulatorControl")
	simCon := SimulatorControl{
		CurrentSimDayTime:     time.Now().Unix(),
		FutureSimDayTime:      time.Now().Unix(),
		FutureTimeDateChanged: false,
		Zoom:      1,
		IsRunning: true,
	}
	_ = simcoll.DropCollection()

	simcoll.Insert(simCon)
}

//GetSimCon returns the current db entry for the simulation
func GetSimCon() SimulatorControl {
	session := connectDB()
	defer session.Close()
	simcoll := session.DB("HA17DB_jesse_arff_590245").C("simulatorControl")
	simcon := SimulatorControl{}
	_ = simcoll.Find(nil).One(&simcon)
	return simcon
}

//ChangeFutureTime sets the FutureTime
func ChangeFutureTime(time int64, change bool) bool {
	session := connectDB()
	defer session.Close()
	simcoll := session.DB("HA17DB_jesse_arff_590245").C("simulatorControl")
	err := simcoll.Update(nil, bson.M{"$set": bson.M{"futuretimedatechanged": change, "futuresimdaytime": time}})
	if err != nil {
		panic(err)
	}
	return true
}

//SetZoom sets the Zoom in the DB
func SetZoom(zoom int64) bool {
	session := connectDB()
	defer session.Close()
	simcoll := session.DB("HA17DB_jesse_arff_590245").C("simulatorControl")
	err := simcoll.Update(nil, bson.M{"$set": bson.M{"zoom": zoom}})
	if err != nil {
		panic(err)
	}
	return true
}

//ToggleRunning sets the isRunning variable to its inverted form
func ToggleRunning() bool {
	session := connectDB()
	defer session.Close()
	simcoll := session.DB("HA17DB_jesse_arff_590245").C("simulatorControl")
	simcon := SimulatorControl{}
	_ = simcoll.Find(nil).One(&simcon)
	simcon.IsRunning = !simcon.IsRunning
	_ = simcoll.Update(nil, bson.M{"$set": bson.M{"isrunning": simcon.IsRunning}})
	return true
}

//SetSimTime sets the simulatortime
func SetSimTime(time int64) {
	session := connectDB()
	defer session.Close()
	simcoll := session.DB("HA17DB_jesse_arff_590245").C("simulatorControl")
	err := simcoll.Update(nil, bson.M{"$set": bson.M{"currentsimdaytime": time}})
	if err != nil {
		panic(err)
	}
}

//SetSunTimes sets sunset and sunrise
func SetSunTimes(sunset int64, sunrise int64) {
	session := connectDB()
	defer session.Close()
	simcoll := session.DB("HA17DB_jesse_arff_590245").C("simulatorControl")
	err := simcoll.Update(nil, bson.M{"$set": bson.M{"sunsettimestamp": sunset, "sunrisetimestamp": sunrise}})
	if err != nil {
		panic(err)
	}
}

//DBinXML returns a link to the xml db file
func DBinXML() (link string) {
	session := connectDB()
	defer session.Close()

	file, _ := os.Create("../simulator/XML/db.xml")
	xmlWriter := io.Writer(file)
	tempUser := User{
		UserID: -1,
	}
	xmldb := DBXML{
		Users:     getUser(),
		Rooms:     Getrooms(),
		Scenes:    Getsences(tempUser),
		Lamps:     Getlamps(),
		Radiators: Getradiators(),
		Shutters:  Getshutter(),
		Simulator: GetSimCon(),
	}
	enc := xml.NewEncoder(xmlWriter)
	enc.Indent("  ", "    ")
	_, err := xmlWriter.Write([]byte(xml.Header))
	//err := enc.Encode(xml.Header)
	err = enc.Encode(xmldb)
	//xmldb = []byte(xml.Header + string(xmldb))
	if err != nil {
		panic(err)
	}

	return "http://localhost:9090/XML/db.xml"

}

//XMLtoDB overrides the DB with a DBXML struct
func XMLtoDB(db DBXML) {
	session := connectDB()
	defer session.Close()
	usercoll := session.DB("HA17DB_jesse_arff_590245").C("users")
	roomcoll := session.DB("HA17DB_jesse_arff_590245").C("rooms")
	lampcoll := session.DB("HA17DB_jesse_arff_590245").C("lamps")
	shuttercoll := session.DB("HA17DB_jesse_arff_590245").C("shutters")
	radiatorcoll := session.DB("HA17DB_jesse_arff_590245").C("radiators")
	scenecoll := session.DB("HA17DB_jesse_arff_590245").C("scenes")
	simcoll := session.DB("HA17DB_jesse_arff_590245").C("simulatorControl")

	//Drop the collections before loading the new Data
	_ = usercoll.DropCollection()
	_ = roomcoll.DropCollection()
	_ = lampcoll.DropCollection()
	_ = shuttercoll.DropCollection()
	_ = radiatorcoll.DropCollection()
	_ = scenecoll.DropCollection()
	_ = simcoll.DropCollection()

	//Post the Data in the collectioon
	for _, user := range db.Users {
		usercoll.Insert(user)
	}
	for _, room := range db.Rooms {
		roomcoll.Insert(room)
	}
	for _, lamp := range db.Lamps {
		lampcoll.Insert(lamp)
	}
	for _, shutter := range db.Shutters {
		shuttercoll.Insert(shutter)
	}
	for _, radiator := range db.Radiators {
		radiatorcoll.Insert(radiator)
	}
	for _, scene := range db.Scenes {
		scenecoll.Insert(scene)
	}
	simcoll.Insert(db.Simulator)

}

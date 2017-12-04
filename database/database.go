package database

import (
	"fmt"
	"time"

	mgo "gopkg.in/mgo.v2"
)

//--------------------------------------------------------------------
// This class will give structs and small functions for the database
//--------------------------------------------------------------------

//User struct for the DB
type User struct {
	UserID       int
	Username     string
	Password     string
	HouseID      int
	Lastregister time.Time
	Cookie       []int
}

//House struct for the DB
type House struct {
	HouseID int
	Name    string
}

//Room struct for the DB in a real world this would have a houseID
type Room struct {
	RoomID int
	Name   string
}

//Lamp struct for the DB
type Lamp struct {
	LampID int
	Name   string
	Status int
	RoomID int
}

//Shutter struct for the DB
type Shutter struct {
	ShutterID int
	Name      string
	Status    int
	RoomID    int
}

//Radiator struct for the DB
type Radiator struct {
	RadiatorID int
	Name       string
	Status     int
	RoomID     int
}

//Scene struct for the DB
type Scene struct {
	SceneID   int
	Name      string
	Active    bool
	Time      string
	Sunset    bool
	Sunrise   bool
	Posoffset int
	Negoffset int
	Lamps     []Lamp
	Shutters  []Shutter
	Radiators []Radiator
}

//SimulatorControl struct for the DB
type SimulatorControl struct {
	CurrentDayTime string
	FutureDayTime  string
	Zoom           int
}

func connectDB() (session *mgo.Session) {
	//connect to DB
	session, err := mgo.Dial("localhost:27017")
	if err != nil {
		//defer will be called but function will be stopped
		panic(err)
	}
	//defer is a call after the functions return/end
	//defer session.Close()
	//Set mode
	session.SetMode(mgo.Monotonic, true)
	//session.SetSafe(&mgo.Safe{})
	return
}

//InitDB creates a small DB
func InitDB() {
	//connect to DB
	session := connectDB()
	//Check if DB is empty
	maindb := session.DB("web_prog")
	collectionNames, err := maindb.CollectionNames()
	if err != nil {
		//chill
	}
	usercoll := session.DB("web_prog").C("users")
	housecoll := session.DB("web_prog").C("houses")
	roomcoll := session.DB("web_prog").C("rooms")
	lampcoll := session.DB("web_prog").C("lamps")
	shuttercoll := session.DB("web_prog").C("shutters")
	radiatorcoll := session.DB("web_prog").C("radiators")
	scenecoll := session.DB("web_prog").C("scenes")
	simcoll := session.DB("web_prog").C("simulatorControl")

	if len(collectionNames) == 0 {
		//MongoDB will create the collections automaticly when used
	} else {
		//Drop the collections before instanting them
		err = usercoll.DropCollection()
		err = housecoll.DropCollection()
		err = roomcoll.DropCollection()
		err = lampcoll.DropCollection()
		err = shuttercoll.DropCollection()
		err = radiatorcoll.DropCollection()
		err = scenecoll.DropCollection()
		err = simcoll.DropCollection()
	}
	//Load Test Data
	//Userdata {userID, username, password, houseID, lastregister}
	err = usercoll.Insert(
		&User{1, "jesse", "password", 1, time.Now(), make([]int, 1)},
		&User{2, "test", "test", 1, time.Now(), make([]int, 1)})
	//Housedata {houseID, name}
	err = housecoll.Insert(
		&House{1, "myHouse"})
	//Roomdata {roomID, name}
	err = roomcoll.Insert(
		&Room{1, "bedroom"})
	//Lamdata {lampID, name, status, roomID}
	err = lampcoll.Insert(
		&Lamp{1, "nightlamp", 1, 1})
	//Shutterdata {shutterID, name, status, roomID}
	err = shuttercoll.Insert(
		&Shutter{1, "bedroomshutter", 60, 1})
	//Radiatordata
	err = radiatorcoll.Insert(
		&Radiator{1, "Wohnzimmer Heizung", 21, 1})
	//Scenedata {sceneID, name, time, sunset, sunrise, posoffset, negoffset, lamps, shutters, entity}
	err = scenecoll.Insert(
		&Scene{1, "eveningscene", true, "19:43", false, false, 0, 15, make([]Lamp, 1), make([]Shutter, 1), make([]Radiator, 1)})
	//SimController Data {CurrentDayTime, FutureDayTime, Zoom}
	err = simcoll.Insert(
		&SimulatorControl{"18.11.2017_12:23", "18.11.2018_12:23", 400})

	fmt.Println("Finished filling the DB")
}

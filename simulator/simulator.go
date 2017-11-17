package main

import (
	"fmt"

	mgo "gopkg.in/mgo.v2"
)

func main() {
	initDB()
}

//User struct for the DB
type User struct {
	UserID    int
	Username  string
	Password  string
	HouseID   int
	LastLogin string
	Cookie    string
}

//House struct for the DB
type House struct {
	HouseID int
	Name    string
}

//Room struct for the DB
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

//Scene struct for the DB
type Scene struct {
	SceneID   int
	Name      string
	Time      string
	Sunset    bool
	Sunrise   bool
	Posoffset int
	Negoffset int
	Devices   []int
}

func initDB() {
	//connect to DB
	session, err := mgo.Dial("localhost:27017")
	if err != nil {
		//defer will be called but function will be stopped
		panic(err)
	}
	//defer is a call after the functions return/end
	defer session.Close()
	//Set mode
	session.SetMode(mgo.Monotonic, true)
	//session.SetSafe(&mgo.Safe{})
	//Check if DB is empty
	maindb := session.DB("web_prog")
	collectionNames, err := maindb.CollectionNames()

	usercoll := session.DB("web_prog").C("users")
	housecoll := session.DB("web_prog").C("houses")
	roomcoll := session.DB("web_prog").C("rooms")
	lampcoll := session.DB("web_prog").C("lamps")
	shuttercoll := session.DB("web_prog").C("shutter")
	scenecoll := session.DB("web_prog").C("scenes")

	if len(collectionNames) == 0 {
		//MongoDB will create the collections automaticly when used
	} else {
		//Drop the collections before instanting them
		err = usercoll.DropCollection()
		err = housecoll.DropCollection()
		err = roomcoll.DropCollection()
		err = lampcoll.DropCollection()
		err = shuttercoll.DropCollection()
		err = scenecoll.DropCollection()
	}
	//Load Test Data
	//Userdata {userID, username, password, houseID, lastLogin}
	err = usercoll.Insert(
		&User{1, "jesse", "password", 1, "17.11.2017_15:58", "123456789123456789"},
		&User{2, "test", "test", 1, "17.11.2017_09:42", "987654321987654321"})
	fmt.Println(err)
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
	//Scenedata {sceneID, name, time, sunset, sunrise, posoffset, negoffset, devices}
	chosenDevices := []int{1}
	err = scenecoll.Insert(
		&Scene{1, "eveningscene", "19:43", false, false, 0, 15, chosenDevices})

	fmt.Println("Finished")
}

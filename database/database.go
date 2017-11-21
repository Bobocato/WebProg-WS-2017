package database

import (
	"fmt"
	"time"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func main() {
	initDB()
}

//User struct for the DB
type User struct {
	UserID       int
	Username     string
	Password     string
	HouseID      int
	Lastregister time.Time
	Cookie       int
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

//SimulatorControl struct for the DB
type SimulatorControl struct {
	CurrentDayTime string
	FutureDayTime  string
	Zoom           int
}

//LoginUser takes the username and passwort and returns a matching user if exists, if not the user will have the id -1
func LoginUser(username string, password string) (user User) {
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
	usercoll := session.DB("web_prog").C("users")
	user = User{
		UserID:       -1,
		Username:     "nil",
		Password:     "nil",
		HouseID:      -1,
		Lastregister: time.Now(),
		Cookie:       -1,
	}
	err = usercoll.Find(bson.M{"username": username, "password": password}).One(&user)
	if err != nil {
		user = User{
			UserID:       -1,
			Username:     "nil",
			Password:     "nil",
			HouseID:      -1,
			Lastregister: time.Now(),
			Cookie:       -1,
		}
	}
	return user
}

//RegisterUser takes the username and passwort and returns a new user if the username is unused,
//if not the returned user will have the id -1
func RegisterUser(username string, password string) (newUser User) {
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
	usercoll := session.DB("web_prog").C("users")
	newUser = User{
		UserID:       -1,
		Username:     "nil",
		Password:     "nil",
		HouseID:      -1,
		Lastregister: time.Now(),
		Cookie:       -1,
	}
	err = usercoll.Find(bson.M{"username": username}).One(&newUser)
	if err != nil {
		//No user uses the username => create new User
		//create new cookie
		cookie := CreateCookie()
		//get new id
		id, _ := usercoll.Count()
		id++
		err = usercoll.Insert(
			&User{id, username, password, 1, time.Now(), cookie})

		newUser = User{
			UserID:       id,
			Username:     username,
			Password:     password,
			HouseID:      1,
			Lastregister: time.Now(),
			Cookie:       cookie,
		}
	} else {
		//Name in use return empty user with id -1
		newUser = User{
			UserID:       -1,
			Username:     "nil",
			Password:     "nil",
			HouseID:      -1,
			Lastregister: time.Now(),
			Cookie:       -1,
		}
	}
	return newUser
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
		err = scenecoll.DropCollection()
		err = simcoll.DropCollection()
	}
	//Load Test Data
	//Userdata {userID, username, password, houseID, lastregister}
	err = usercoll.Insert(
		&User{1, "jesse", "password", 1, time.Now(), 123456789123456789},
		&User{2, "test", "test", 1, time.Now(), 987654321987654321})
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
	//SimController Data {CurrentDayTime, FutureDayTime, Zoom}
	err = simcoll.Insert(
		&SimulatorControl{"18.11.2017_12:23", "18.11.2018_12:23", 400})

	fmt.Println("Finished filling the DB")
}

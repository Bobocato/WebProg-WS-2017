package database

import (
	"log"
	"math/rand"
	"time"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

//CreateCookie creates a unique cookie and return it
func CreateCookie() (key int) {
	//TODO make random int check in DB if exists...
	//Startup a pseudorandom generator and create the first key
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	//Connect to the DB
	session := connectDB()
	defer session.Close()
	usercoll := session.DB("web_prog").C("users")
	result := User{}
	//Loop until unused int is found
	uniqueCookie := false
	for !uniqueCookie {
		key = r.Int()
		err := usercoll.Find(bson.M{"Cookie": r}).One(&result)
		if err != nil {
			uniqueCookie = true
			//log.Fatal(err)
		} else {
			uniqueCookie = false
		}
	}
	//Naked return for the key
	return
}

//SetCookie sets a cookie for a user
func SetCookie(username string) {
	//TODO set cookie for User in DB
	//get Cookie
	cookie := CreateCookie()
	//Connect to the DB
	session := connectDB()
	defer session.Close()
	usercoll := session.DB("web_prog").C("users")
	colQuerier := bson.M{"username": username}
	change := bson.M{"$set": bson.M{"cookie": cookie}}
	err := usercoll.Update(colQuerier, change)
	if err != nil {
		log.Fatal(err)
	}
}

//DeleteCookieUser deletes all cookies a user has in the DB
func DeleteCookieUser(username string) {
	//TODO delete cookies for user
	//Connect to the DB
	session := connectDB()
	defer session.Close()
	usercoll := session.DB("web_prog").C("users")
	colQuerier := bson.M{"username": username}
	change := bson.M{"$set": bson.M{"cookie": 0}}
	err := usercoll.Update(colQuerier, change)
	if err != nil {
		log.Fatal(err)
	}
}

//DeleteCookieCookie deletes a specific cookie
func DeleteCookieCookie(cookie int) {
	//TODO delete specific cookie
	session := connectDB()
	defer session.Close()
	usercoll := session.DB("web_prog").C("users")
	colQuerier := bson.M{"cookie": cookie}
	change := bson.M{"$set": bson.M{"cookie": 0}}
	err := usercoll.Update(colQuerier, change)
	if err != nil {
		log.Fatal(err)
	}
}

//CheckCookie checks if the cookie is listed for a user and sends back the Userdata
func CheckCookie(cookie int) (user User) {
	//TODO check if cookie is valid and send user back
	session := connectDB()
	defer session.Close()
	usercoll := session.DB("web_prog").C("users")
	result := User{
		UserID:       -1,
		Username:     "nil",
		Password:     "nil",
		HouseID:      -1,
		Lastregister: time.Now(),
		Cookie:       -1,
	}
	err := usercoll.Find(bson.M{"cookie": cookie}).One(&result)
	if err != nil {
		//do nothing
	}
	return result
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

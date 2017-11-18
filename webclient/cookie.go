package cookie

import (
	"fmt"
	"log"
	"math/rand"
	"time"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

//User struct for the DB
type User struct {
	UserID       int
	Username     string
	Password     string
	HouseID      int
	Lastregister string
	Cookie       int
}

func CreateCookie() (key int) {
	//TODO make random int check in DB if exists...
	//Startup a pseudorandom generator and create the first key
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	key = r.Int()
	session := connectDB()
	defer session.Close()
	usercoll := session.DB("web_prog").C("users")
	result := User{}
	err := usercoll.Find(bson.M{"Cookie": r}).One(&result)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(result)

	return
}

func SetCookie(username string) {
	//TODO set cookie for User in DB
}

func DeleteCookieUser(username string) {
	//TODO delete cookie for user
}

func DeleteCookieCookie(cookie int) {
	//TODO delete specific cookie
}

func CheckCookie(cookie int) (username string) {
	//TODO check if cookie is valid and send user back
	return
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

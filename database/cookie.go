package database

import (
	"log"
	"math/rand"
	"time"

	"gopkg.in/mgo.v2/bson"
)

//CreateCookie creates a unique cookie and return it
func CreateCookie() (key int) {
	//Startup a pseudorandom generator and create the first key
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	//Connect to the DB
	session := connectDB()
	defer session.Close()
	usercoll := session.DB("HA17DB_jesse_arff_590245").C("users")
	result := User{}
	//Loop until unused int is found
	uniqueCookie := false
	for !uniqueCookie {
		key = r.Int()
		err := usercoll.Find(bson.M{"cookie": r}).One(&result)
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
func SetCookie(username string, cookie int) {
	//Set cookie for User in DB
	//Connect to the DB
	session := connectDB()
	defer session.Close()
	usercoll := session.DB("HA17DB_jesse_arff_590245").C("users")
	colQuerier := bson.M{"username": username}
	//Get the current cookies
	Result := User{}
	usercoll.Find(bson.M{"Username": username}).One(&Result)
	cookies := Result.Cookie
	cookies = append(cookies, cookie)
	change := bson.M{"$set": bson.M{"cookie": cookies}}
	err := usercoll.Update(colQuerier, change)
	if err != nil {
		log.Fatal(err)
	}
}

//DeleteCookieUser deletes all cookies a user has in the DB
func DeleteCookieUser(username string) {
	//Connect to the DB
	session := connectDB()
	defer session.Close()
	usercoll := session.DB("HA17DB_jesse_arff_590245").C("users")
	colQuerier := bson.M{"username": username}
	change := bson.M{"$set": bson.M{"cookie": make([]int, 0)}}
	err := usercoll.Update(colQuerier, change)
	if err != nil {
		log.Fatal(err)
	}
}

//DeleteCookieCookie deletes a specific cookie
func DeleteCookieCookie(cookie int) {
	session := connectDB()
	defer session.Close()
	usercoll := session.DB("HA17DB_jesse_arff_590245").C("users")
	colQuerier := bson.M{"cookie": cookie}
	change := bson.M{"$set": bson.M{"cookie": make([]int, 0)}}
	err := usercoll.Update(colQuerier, change)
	if err != nil {
		log.Fatal(err)
	}
}

//CheckCookie checks if the cookie is listed for a user and sends back the Userdata
func CheckCookie(cookie int) (user User) {
	session := connectDB()
	defer session.Close()
	usercoll := session.DB("HA17DB_jesse_arff_590245").C("users")
	result := User{
		UserID:       -1,
		Username:     "nil",
		Password:     "nil",
		HouseID:      -1,
		Lastregister: time.Now(),
		Cookie:       make([]int, 0),
	}
	err := usercoll.Find(bson.M{"cookie": cookie}).One(&result)
	if err != nil {
		//do nothing
	}
	return result
}

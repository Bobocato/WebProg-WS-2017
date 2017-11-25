package database

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

//LoginUser takes the username and passwort and returns a matching user if exists, if not the user will have the id -1
func LoginUser(username string, password string) (user User) {
	//connect to DB
	session := connectDB()
	usercoll := session.DB("web_prog").C("users")
	user = User{
		UserID:       -1,
		Username:     "nil",
		Password:     "nil",
		HouseID:      -1,
		Lastregister: time.Now(),
		Cookie:       make([]int, 0),
	}
	err := usercoll.Find(bson.M{"username": username, "password": password}).One(&user)
	if err != nil {
		user = User{
			UserID:       -1,
			Username:     "nil",
			Password:     "nil",
			HouseID:      -1,
			Lastregister: time.Now(),
			Cookie:       make([]int, 0),
		}
	}
	return user
}

//RegisterUser takes the username and passwort and returns a new user if the username is unused,
//if not the returned user will have the id -1
func RegisterUser(username string, password string) (newUser User) {
	//connect to DB
	session := connectDB()
	usercoll := session.DB("web_prog").C("users")
	newUser = User{
		UserID:       -1,
		Username:     "nil",
		Password:     "nil",
		HouseID:      -1,
		Lastregister: time.Now(),
		Cookie:       make([]int, 0),
	}
	err := usercoll.Find(bson.M{"username": username}).One(&newUser)
	if err != nil {
		//No user uses the username => create new User
		//create new cookie
		cookie := CreateCookie()
		//get new id
		id, _ := usercoll.Count()
		id++
		err = usercoll.Insert(
			&User{id, username, password, 1, time.Now(), make([]int, cookie)})

		newUser = User{
			UserID:       id,
			Username:     username,
			Password:     password,
			HouseID:      1,
			Lastregister: time.Now(),
			Cookie:       make([]int, 0),
		}
	} else {
		//Name in use return empty user with id -1
		newUser = User{
			UserID:       -1,
			Username:     "nil",
			Password:     "nil",
			HouseID:      -1,
			Lastregister: time.Now(),
			Cookie:       make([]int, 0),
		}
	}
	return newUser
}

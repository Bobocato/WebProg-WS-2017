package database

import "gopkg.in/mgo.v2/bson"

//---------------------------------------------------
//----Functions for getting database collections-----
//---------------------------------------------------

//Getrooms gives an slice of all rooms back to the requesting person
func Getrooms() []Room {
	session := connectDB()
	defer session.Close()
	roomcoll := session.DB("web_prog").C("rooms")
	var rooms []Room
	err := roomcoll.Find(nil).All(&rooms)
	if err != nil {
		//No rooms
	} else {
		//there are rooms
	}
	return rooms
}

//Getlamps gives an slice of all lamps back to the requesting person
func Getlamps() []Lamp {
	session := connectDB()
	defer session.Close()
	lampcoll := session.DB("web_prog").C("lamps")
	var lamps []Lamp
	err := lampcoll.Find(nil).All(&lamps)
	if err != nil {
		//No Lamps
	} else {
		//there are lamps
	}
	return lamps
}

//Getshutter gives an slice of all shutter back to the requesting person
func Getshutter() []Shutter {
	session := connectDB()
	defer session.Close()
	shuttercoll := session.DB("web_prog").C("shutters")
	var shutter []Shutter
	err := shuttercoll.Find(nil).All(&shutter)
	if err != nil {
		//No shutter
	} else {
		//there are shutter
	}
	return shutter
}

//Getsences gives an slice of all shutter back to the requesting person
func Getsences() []Scene {
	session := connectDB()
	defer session.Close()
	scenecoll := session.DB("web_prog").C("scenes")
	var scene []Scene
	err := scenecoll.Find(nil).All(&scene)
	if err != nil {
		//No scene
	} else {
		//there are scene
	}
	return scene
}

//-----------------------------------------------------
//----Functions for inserting database collections-----
//-----------------------------------------------------

//Pushroom will put an new room in the collection
func Pushroom(room Room) {
	session := connectDB()
	defer session.Close()
	roomcoll := session.DB("web_prog").C("rooms")
	err := roomcoll.Insert(room)
	if err != nil {

	} else {

	}
}

//Pushlamp will put an new lamp in the collection
func Pushlamp(lamp Lamp) {
	session := connectDB()
	defer session.Close()
	lampcoll := session.DB("web_prog").C("lamps")
	err := lampcoll.Insert(lamp)
	if err != nil {

	} else {

	}
}

//Pushshutter will put an new shutter in the collection
func Pushshutter(shutter Shutter) {
	session := connectDB()
	defer session.Close()
	shuttercoll := session.DB("web_prog").C("shutters")
	err := shuttercoll.Insert(shutter)
	if err != nil {

	} else {

	}
}

//Pushscene will put an new scene in the collection
func Pushscene(scene Scene) {
	session := connectDB()
	defer session.Close()
	scenecoll := session.DB("web_prog").C("scenes")
	err := scenecoll.Insert(scene)
	if err != nil {

	} else {

	}
}

//---------------------------------------------------
//------Functions for removing database items--------
//---------------------------------------------------

//Deleteroom removes a room with the given ID
func Deleteroom(roomID int) {
	session := connectDB()
	defer session.Close()
	roomcoll := session.DB("web_prog").C("rooms")
	err := roomcoll.Remove(bson.M{"roomid": roomID})
	if err != nil {

	}
}

//Deletelamp removes a lamp with the given ID
func Deletelamp(lampID int) {
	session := connectDB()
	defer session.Close()
	lampcoll := session.DB("web_prog").C("lamps")
	err := lampcoll.Remove(bson.M{"lampid": lampID})
	if err != nil {

	}
}

//Deleteshutter removes a lamp with the given ID
func Deleteshutter(shutterID int) {
	session := connectDB()
	defer session.Close()
	shuttercoll := session.DB("web_prog").C("shutters")
	err := shuttercoll.Remove(bson.M{"shutterid": shutterID})
	if err != nil {

	}
}

//Deletescene removes a scene with the given ID
func Deletescene(sceneID int) {
	session := connectDB()
	defer session.Close()
	scenecoll := session.DB("web_prog").C("scene")
	err := scenecoll.Remove(bson.M{"sceneid": sceneID})
	if err != nil {

	}
}

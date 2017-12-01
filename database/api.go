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

//Getradiators gives a slice of all radiators back to the requesting person
func Getradiators() []Radiator {
	session := connectDB()
	defer session.Close()
	radiatorcoll := session.DB("web_prog").C("radiators")
	var radiators []Radiator
	err := radiatorcoll.Find(nil).All(&radiators)
	if err != nil {
		//No shutter
	} else {
		//there are shutter
	}
	return radiators
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
func Pushroom(room Room) bool {
	session := connectDB()
	defer session.Close()
	roomcoll := session.DB("web_prog").C("rooms")
	id, _ := roomcoll.Count()
	id++
	room.RoomID = id
	err := roomcoll.Insert(room)
	success := false
	if err != nil {
	} else {
		success = true
	}
	return success
}

//Pushlamp will put an new lamp in the collection
func Pushlamp(lamp Lamp) bool {
	session := connectDB()
	defer session.Close()
	lampcoll := session.DB("web_prog").C("lamps")
	id, _ := lampcoll.Count()
	id++
	lamp.LampID = id
	err := lampcoll.Insert(lamp)
	if err != nil {
		return false
	}
	return true
}

//Pushshutter will put an new shutter in the collection
func Pushshutter(shutter Shutter) bool {
	session := connectDB()
	defer session.Close()
	shuttercoll := session.DB("web_prog").C("shutters")
	id, _ := shuttercoll.Count()
	id++
	shutter.ShutterID = id
	err := shuttercoll.Insert(shutter)
	if err != nil {
		return false
	}
	return true
}

//Pushradiator will put an new radiator in the collection
func Pushradiator(radiator Radiator) bool {
	session := connectDB()
	defer session.Close()
	radiatorcoll := session.DB("web_prog").C("radiators")
	id, _ := radiatorcoll.Count()
	id++
	radiator.RadiatorID = id
	err := radiatorcoll.Insert(radiator)
	if err != nil {
		return false
	}
	return true
}

//Pushscene will put an new scene in the collection
func Pushscene(scene Scene) bool {
	session := connectDB()
	defer session.Close()
	scenecoll := session.DB("web_prog").C("scenes")
	id, _ := scenecoll.Count()
	id++
	scene.SceneID = id
	err := scenecoll.Insert(scene)
	if err != nil {
		return false
	}
	return true
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

//Deleteshutter removes a shutter with the given ID
func Deleteshutter(shutterID int) {
	session := connectDB()
	defer session.Close()
	shuttercoll := session.DB("web_prog").C("shutters")
	err := shuttercoll.Remove(bson.M{"shutterid": shutterID})
	if err != nil {

	}
}

//Deleteradiator removes a radiator with the given ID
func Deleteradiator(radiatorID int) {
	session := connectDB()
	defer session.Close()
	radiatorcoll := session.DB("web_prog").C("radiators")
	err := radiatorcoll.Remove(bson.M{"radiatorid": radiatorID})
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

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
	//When rooms are deleted, there will be a problem with ids beeing used multiple times
	result := room
	id := 0
	uniqueID := false
	for !uniqueID {
		err := roomcoll.Find(bson.M{"roomid": id}).One(&result)
		if err != nil {
			uniqueID = true
		} else {
			id++
			uniqueID = false
		}
	}
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
	//When lamps are deleted, there will be a problem with ids beeing used multiple times
	result := lamp
	id := 0
	uniqueID := false
	for !uniqueID {
		err := lampcoll.Find(bson.M{"lampid": id}).One(&result)
		if err != nil {
			uniqueID = true
		} else {
			id++
			uniqueID = false
		}
	}
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
	//When shutters are deleted, there will be a problem with ids beeing used multiple times
	result := shutter
	id := 0
	uniqueID := false
	for !uniqueID {
		err := shuttercoll.Find(bson.M{"shutterid": id}).One(&result)
		if err != nil {
			uniqueID = true
		} else {
			id++
			uniqueID = false
		}
	}
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
	//When radiators are deleted, there will be a problem with ids beeing used multiple times
	result := radiator
	id := 0
	uniqueID := false
	for !uniqueID {
		err := radiatorcoll.Find(bson.M{"radiatorid": id}).One(&result)
		if err != nil {
			uniqueID = true
		} else {
			id++
			uniqueID = false
		}
	}
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
	//When scenes are deleted, there will be a problem with ids beeing used multiple times
	result := scene
	id := 0
	uniqueID := false
	for !uniqueID {
		err := scenecoll.Find(bson.M{"sceneid": id}).One(&result)
		if err != nil {
			uniqueID = true
		} else {
			id++
			uniqueID = false
		}
	}
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

//DeleteAllRoom will remove all items out of the DB with the given RoomID
func DeleteAllRoom(roomID int) {
	session := connectDB()
	defer session.Close()
	roomcoll := session.DB("web_prog").C("rooms")
	roomcoll.RemoveAll(bson.M{"roomid": roomID})
	lampcoll := session.DB("web_prog").C("lamps")
	lampcoll.RemoveAll(bson.M{"roomid": roomID})
	shuttercoll := session.DB("web_prog").C("shutters")
	shuttercoll.RemoveAll(bson.M{"roomid": roomID})
	radiatorcoll := session.DB("web_prog").C("radiators")
	radiatorcoll.RemoveAll(bson.M{"roomid": roomID})
}

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
	scenecoll := session.DB("web_prog").C("scenes")
	err := scenecoll.Remove(bson.M{"sceneid": sceneID})
	if err != nil {

	}
}

//---------------------------------------------------
//------Functions for updating database items--------
//---------------------------------------------------

//UpdateLamp changes the lamp in the Database to the new one
func UpdateLamp(lamp Lamp) {
	session := connectDB()
	defer session.Close()
	lampcoll := session.DB("web_prog").C("lamps")
	err := lampcoll.Update(bson.M{"lampid": lamp.LampID}, lamp)
	if err != nil {

	}
}

//UpdateShutter changes the shutter in the Database to the new one
func UpdateShutter(shutter Shutter) {
	session := connectDB()
	defer session.Close()
	shuttercoll := session.DB("web_prog").C("shutters")
	err := shuttercoll.Update(bson.M{"shutterid": shutter.ShutterID}, shutter)
	if err != nil {

	}
}

//UpdateRadiator changes the radiator in the Database to the new one
func UpdateRadiator(radiator Radiator) {
	session := connectDB()
	defer session.Close()
	radiatorcoll := session.DB("web_prog").C("radiators")
	err := radiatorcoll.Update(bson.M{"radiatorid": radiator.RadiatorID}, radiator)
	if err != nil {

	}
}

//UpdateRoom changes the room in the Database to the new one
func UpdateRoom(room Room) {
	session := connectDB()
	defer session.Close()
	roomcoll := session.DB("web_prog").C("rooms")
	err := roomcoll.Update(bson.M{"roomid": room.RoomID}, room)
	if err != nil {

	}
}

//UpdateScene changes the scene in the Database to the new one
func UpdateScene(scene Scene) {
	session := connectDB()
	defer session.Close()
	scenecoll := session.DB("web_prog").C("scenes")
	err := scenecoll.Update(bson.M{"sceneId": scene.SceneID}, scene)
	if err != nil {

	}
}

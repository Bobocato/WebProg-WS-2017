package database

import (
	"fmt"
	"time"

	"gopkg.in/mgo.v2/bson"
)

//---------------------------------------------------
//----------Functions for starting a scene-----------
//---------------------------------------------------

//Startscene processes one scene and returns true
func Startscene(scene Scene) (success bool) {
	session := connectDB()
	defer session.Close()
	for _, lamp := range scene.Lamps {
		//Check if Lamp with RoomId exits
		lampcoll := session.DB("web_prog").C("lamps")
		var dbLamp Lamp
		err := lampcoll.Find(bson.M{"lampid": lamp.LampID}).One(&dbLamp)
		if err != nil {
			//No Lamps
		} else {
			//there are lamps
			if dbLamp.RoomID == lamp.RoomID {
				UpdateLamp(lamp)
			}
		}
	}
	for _, shutter := range scene.Shutters {
		//Check if Shutter with RoomId exits
		shuttercoll := session.DB("web_prog").C("shutters")
		var dbShutter Shutter
		err := shuttercoll.Find(bson.M{"shutterid": shutter.ShutterID, "roomid": shutter.RoomID}).One(&dbShutter)
		if err != nil {
			//No Shutter
			//panic(err)
		} else {
			//there are Shutter
			if dbShutter.RoomID == shutter.RoomID {
				UpdateShutter(shutter)
			}
		}
	}
	for _, radiator := range scene.Radiators {
		//Check if radiator with RoomId exits
		radiatorcoll := session.DB("web_prog").C("radiators")
		var dbRadiator Radiator
		err := radiatorcoll.Find(bson.M{"radiatorid": radiator.RadiatorID, "roomid": radiator.RoomID}).One(&dbRadiator)
		if err != nil {
			//No Radiators
			//panic(err)
		} else {
			//there are Radiators
			if dbRadiator.RoomID == radiator.RoomID {
				UpdateRadiator(radiator)
			}
		}
	}
	UpdateTime()
	return true
}

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
func Getsences(user User) []Scene {
	session := connectDB()
	defer session.Close()
	scenecoll := session.DB("web_prog").C("scenes")
	var scene []Scene
	if user.UserID == -1 {
		err := scenecoll.Find(nil).All(&scene)
		if err != nil {
			//No scene
		} else {
			//there are scene
		}
	} else {
		err := scenecoll.Find(bson.M{"userid": user.UserID}).All(&scene)
		if err != nil {
			//No scene
		} else {
			//there are scene
		}
	}

	return scene
}

//Gettimestamp returns the timestamp that is storde in the db
func Gettimestamp() DatabaseChanged {
	session := connectDB()
	defer session.Close()
	timecoll := session.DB("web_prog").C("timestamp")
	var time DatabaseChanged
	timecoll.Find(nil).One(&time)
	return time
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
	UpdateTime()
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
	UpdateTime()
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
	UpdateTime()
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
	UpdateTime()
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
	fmt.Println(scene)
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
	UpdateTime()
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
	scenecoll := session.DB("web_prog").C("scenes")
	scenecoll.RemoveAll(bson.M{"lamps.roomid": roomID})
	scenecoll.RemoveAll(bson.M{"shutters.roomid": roomID})
	scenecoll.RemoveAll(bson.M{"radiators.roomid": roomID})
	UpdateTime()
}

//Deleteroom removes a room with the given ID
func Deleteroom(roomID int) {
	session := connectDB()
	defer session.Close()
	roomcoll := session.DB("web_prog").C("rooms")
	err := roomcoll.Remove(bson.M{"roomid": roomID})
	if err != nil {

	}
	UpdateTime()
}

//Deletelamp removes a lamp with the given ID
func Deletelamp(lampID int) {
	session := connectDB()
	defer session.Close()
	lampcoll := session.DB("web_prog").C("lamps")
	err := lampcoll.Remove(bson.M{"lampid": lampID})
	if err != nil {

	}
	//scenecoll := session.DB("web_prog").C("scenes")
	//scenecoll.RemoveAll(bson.M{"lamps.lampid": lampID})
	user := User{
		UserID: -1,
	}
	scenes := Getsences(user)
	scenecoll := session.DB("web_prog").C("scenes")
	for _, scene := range scenes {
		for _, sceneLamp := range scene.Lamps {
			if sceneLamp.LampID == lampID {
				query := bson.M{"sceneid": scene.SceneID}
				updater := bson.M{"$pull": bson.M{"lamps": bson.M{"lampid": lampID}}}
				err := scenecoll.Update(query, updater)
				if err != nil {
					panic(err)
				}
			}
		}
	}
	UpdateTime()
}

//Deleteshutter removes a shutter with the given ID
func Deleteshutter(shutterID int) {
	session := connectDB()
	defer session.Close()
	shuttercoll := session.DB("web_prog").C("shutters")
	err := shuttercoll.Remove(bson.M{"shutterid": shutterID})
	if err != nil {

	}
	//scenecoll := session.DB("web_prog").C("scenes")
	//scenecoll.RemoveAll(bson.M{"shutters.shutterid": shutterID})
	user := User{
		UserID: -1,
	}
	scenes := Getsences(user)
	scenecoll := session.DB("web_prog").C("scenes")
	for _, scene := range scenes {
		for _, sceneShutter := range scene.Shutters {
			if sceneShutter.ShutterID == shutterID {
				query := bson.M{"sceneid": scene.SceneID}
				updater := bson.M{"$pull": bson.M{"shutters": bson.M{"shutterid": shutterID}}}
				err := scenecoll.Update(query, updater)
				if err != nil {
					panic(err)
				}
			}
		}
	}
	UpdateTime()
}

//Deleteradiator removes a radiator with the given ID
func Deleteradiator(radiatorID int) {
	session := connectDB()
	defer session.Close()
	radiatorcoll := session.DB("web_prog").C("radiators")
	err := radiatorcoll.Remove(bson.M{"radiatorid": radiatorID})
	if err != nil {

	}
	//scenecoll := session.DB("web_prog").C("scenes")
	//scenecoll.RemoveAll(bson.M{"radiators.radiatorid": radiatorID})
	user := User{
		UserID: -1,
	}
	scenes := Getsences(user)
	scenecoll := session.DB("web_prog").C("scenes")
	for _, scene := range scenes {
		for _, sceneRadiator := range scene.Radiators {
			if sceneRadiator.RadiatorID == radiatorID {
				query := bson.M{"sceneid": scene.SceneID}
				updater := bson.M{"$pull": bson.M{"radiators": bson.M{"radiatorid": radiatorID}}}
				err := scenecoll.Update(query, updater)
				if err != nil {
					panic(err)
				}
			}
		}
	}
	UpdateTime()
}

//Deletescene removes a scene with the given ID
func Deletescene(sceneID int) {
	session := connectDB()
	defer session.Close()
	scenecoll := session.DB("web_prog").C("scenes")
	err := scenecoll.Remove(bson.M{"sceneid": sceneID})
	if err != nil {
	}
	UpdateTime()
}

//---------------------------------------------------
//------Functions for updating database items--------
//---------------------------------------------------

//UpdateLamp changes the lamp in the Database to the new one
func UpdateLamp(lamp Lamp) {
	session := connectDB()
	defer session.Close()
	lampcoll := session.DB("web_prog").C("lamps")
	err := lampcoll.Update(bson.M{"lampid": lamp.LampID}, bson.M{"$set": bson.M{"name": lamp.Name, "status": lamp.Status, "roomid": lamp.RoomID}})
	//err := lampcoll.Remove(bson.M{"lampid": lamp.LampID})
	//err = lampcoll.Insert(lamp)
	if err != nil {

	}
	user := User{
		UserID: -1,
	}
	scenes := Getsences(user)
	scenecoll := session.DB("web_prog").C("scenes")
	for _, scene := range scenes {
		for _, sceneLamp := range scene.Lamps {
			if sceneLamp.LampID == lamp.LampID {
				scenecoll.Update(bson.M{"sceneid": scene.SceneID, "lamps.lampid": sceneLamp.LampID}, bson.M{"$set": bson.M{"lamps.$.name": lamp.Name, "lamps.$.roomid": lamp.RoomID}})
			}
		}
	}
	UpdateTime()
}

//UpdateShutter changes the shutter in the Database to the new one
func UpdateShutter(shutter Shutter) {
	session := connectDB()
	defer session.Close()
	shuttercoll := session.DB("web_prog").C("shutters")
	err := shuttercoll.Update(bson.M{"shutterid": shutter.ShutterID}, bson.M{"$set": bson.M{"name": shutter.Name, "status": shutter.Status, "roomid": shutter.RoomID}})
	//err := shuttercoll.Remove(bson.M{"shutterid": shutter.ShutterID})
	//err = shuttercoll.Insert(shutter)
	if err != nil {
		panic(err)
	}
	user := User{
		UserID: -1,
	}
	scenes := Getsences(user)
	scenecoll := session.DB("web_prog").C("scenes")
	for _, scene := range scenes {
		for _, sceneShutter := range scene.Shutters {
			if sceneShutter.ShutterID == shutter.ShutterID {
				scenecoll.Update(bson.M{"sceneid": scene.SceneID, "shutters.shutterid": sceneShutter.ShutterID}, bson.M{"$set": bson.M{"shutters.$.name": shutter.Name, "shutter.$.roomid": shutter.RoomID}})
			}
		}
	}
	UpdateTime()
}

//UpdateRadiator changes the radiator in the Database to the new one
func UpdateRadiator(radiator Radiator) {
	session := connectDB()
	defer session.Close()
	radiatorcoll := session.DB("web_prog").C("radiators")
	err := radiatorcoll.Update(bson.M{"radiatorid": radiator.RadiatorID}, bson.M{"$set": bson.M{"name": radiator.Name, "status": radiator.Status, "roomid": radiator.RoomID}})
	//err := radiatorcoll.Remove(bson.M{"radiatorid": radiator.RadiatorID})
	//err = radiatorcoll.Insert(radiator)
	if err != nil {
	}
	user := User{
		UserID: -1,
	}
	scenes := Getsences(user)
	scenecoll := session.DB("web_prog").C("scenes")
	for _, scene := range scenes {
		for _, sceneRadiator := range scene.Radiators {
			if sceneRadiator.RadiatorID == radiator.RadiatorID {
				scenecoll.Update(bson.M{"sceneid": scene.SceneID, "radiators.radiatorid": sceneRadiator.RadiatorID}, bson.M{"$set": bson.M{"radiators.$.name": radiator.Name, "radiators.$.roomid": radiator.RoomID}})
			}
		}
	}
	UpdateTime()
}

//UpdateRoom changes the room in the Database to the new one
func UpdateRoom(room Room) {
	session := connectDB()
	defer session.Close()
	roomcoll := session.DB("web_prog").C("rooms")
	err := roomcoll.Update(bson.M{"roomid": room.RoomID}, bson.M{"$set": bson.M{"name": room.Name}})
	//err := roomcoll.Remove(bson.M{"roomid": room.RoomID})
	//err = roomcoll.Insert(room)
	if err != nil {
	}
	UpdateTime()
}

//UpdateScene changes the scene in the Database to the new one
func UpdateScene(scene Scene) {
	session := connectDB()
	defer session.Close()
	scenecoll := session.DB("web_prog").C("scenes")
	//Delete and reinsert (Update would not work)
	err := scenecoll.Update(bson.M{"sceneid": scene.SceneID}, bson.M{"$set": bson.M{"name": scene.Name, "active": scene.Active, "time": scene.Time, "sunset": scene.Sunset, "sunrise": scene.Sunrise, "posoffset": scene.Posoffset, "negoffset": scene.Negoffset, "lamps": scene.Lamps, "shutters": scene.Shutters, "radiators": scene.Radiators}})
	//err := scenecoll.Remove(bson.M{"sceneid": scene.SceneID})
	//err = scenecoll.Insert(scene)
	if err != nil {
		panic(err)
	}
	UpdateTime()
}

//UpdateTime sets the time in the db to a new one
func UpdateTime() {
	session := connectDB()
	defer session.Close()
	timestamp := time.Now().Unix()
	timecoll := session.DB("web_prog").C("timestamp")
	timecoll.Upsert(nil, bson.M{"$set": bson.M{"timestamp": timestamp}})
}

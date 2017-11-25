package database

import "gopkg.in/mgo.v2/bson"

//---------------------------------------------------
//----Functions for getting database collections-----
//---------------------------------------------------

//Getlamps gives an slice of all lamps back to the requesting person
func Getlamps() []Lamp {
	session := connectDB()
	lampcoll := session.DB("web_prog").C("Lamps")
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
	shuttercoll := session.DB("web_prog").C("Shutter")
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
	scenecoll := session.DB("web_prog").C("Scene")
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

//Pushlamp will put an new lamp in the collection
func Pushlamp(lamp Lamp) {
	session := connectDB()
	lampcoll := session.DB("web_prog").C("Lamps")
	err := lampcoll.Insert(lamp)
	if err != nil {

	} else {

	}
}

//Pushshutter will put an new shutter in the collection
func Pushshutter(shutter Shutter) {
	session := connectDB()
	shuttercoll := session.DB("web_prog").C("Shutter")
	err := shuttercoll.Insert(shutter)
	if err != nil {

	} else {

	}
}

//Pushscene will put an new scene in the collection
func Pushscene(scene Scene) {
	session := connectDB()
	scenecoll := session.DB("web_prog").C("Scene")
	err := scenecoll.Insert(scene)
	if err != nil {

	} else {

	}
}

//---------------------------------------------------
//------Functions for removing database items--------
//---------------------------------------------------

//Deletelamp removes a lamp with the given ID
func Deletelamp(lampID int) {
	session := connectDB()
	lampcoll := session.DB("web_prog").C("Lamps")
	err := lampcoll.Remove(bson.M{"LampID": lampID})
	if err != nil {

	}
}

//Deleteshutter removes a lamp with the given ID
func Deleteshutter(shutterID int) {
	session := connectDB()
	shuttercoll := session.DB("web_prog").C("Shutter")
	err := shuttercoll.Remove(bson.M{"ShutterID": shutterID})
	if err != nil {

	}
}

//Deletescene removes a scene with the given ID
func Deletescene(sceneID int) {
	session := connectDB()
	scenecoll := session.DB("web_prog").C("Scene")
	err := scenecoll.Remove(bson.M{"SceneID": sceneID})
	if err != nil {

	}
}

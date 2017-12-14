package database

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

//SimulatorControl struct for the DB
type SimulatorControl struct {
	CurrentSimDayTime     int64
	FutureSimDayTime      int64
	FutureTimeDateChanged bool
	Zoom                  int
	IsRunning             bool
}

//InitSimColl removes old simcollections and pastes a new "empty" one
func InitSimColl() {
	session := connectDB()
	defer session.Close()
	simcoll := session.DB("web_prog").C("simulatorControl")
	simCon := SimulatorControl{
		CurrentSimDayTime:     time.Now().Unix(),
		FutureSimDayTime:      time.Now().Unix(),
		FutureTimeDateChanged: false,
		Zoom:      1,
		IsRunning: true,
	}
	_ = simcoll.DropCollection()

	simcoll.Insert(simCon)
}

//GetSimCon returns the current time of the simulation
func GetSimCon() SimulatorControl {
	session := connectDB()
	defer session.Close()
	simcoll := session.DB("web_prog").C("simulatorControl")
	simcon := SimulatorControl{}
	_ = simcoll.Find(nil).One(&simcon)
	return simcon
}

//ChangeFutureTime sets the FutureTime
func ChangeFutureTime(time int64) bool {
	session := connectDB()
	defer session.Close()
	simcoll := session.DB("web_prog").C("simulatorControl")
	err := simcoll.Update(nil, bson.M{"$set": bson.M{"futuretimedatechanged": true, "futuresimdaytime": time}})
	if err != nil {
		panic(err)
	}
	return true
}

//SetZoom sets the Zoom in the DB
func SetZoom(zoom int) bool {
	session := connectDB()
	defer session.Close()
	simcoll := session.DB("web_prog").C("simulatorControl")
	err := simcoll.Update(nil, bson.M{"$set": bson.M{"zoom": zoom}})
	if err != nil {
		panic(err)
	}
	return true
}

//ToggleRunning sets the isRunning variable to its inverted form
func ToggleRunning() bool {
	session := connectDB()
	defer session.Close()
	simcoll := session.DB("web_prog").C("simulatorControl")
	simcon := SimulatorControl{}
	_ = simcoll.Find(nil).One(&simcon)
	simcon.IsRunning = !simcon.IsRunning
	_ = simcoll.Update(nil, bson.M{"$set": bson.M{"isrunning": simcon.IsRunning}})
	return true
}

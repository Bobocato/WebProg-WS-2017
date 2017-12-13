package database

import (
	"time"
)

//SimulatorControl struct for the DB
type SimulatorControl struct {
	CurrentSimDayTime     time.Time
	FutureSimDayTime      time.Time
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
		CurrentSimDayTime:     time.Now(),
		FutureSimDayTime:      time.Now(),
		FutureTimeDateChanged: false,
		Zoom:      1,
		IsRunning: true,
	}
	err := simcoll.DropCollection()
	simcoll.Insert(simCon)
}

//ChangeFutureTime sets the FutureTime
func ChangeFutureTime(time time.Time) {
	session := connectDB()
	defer session.Close()
	simcoll := session.DB("web_prog").C("simulatorControl")
}

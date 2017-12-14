package simulator

import (
	"WebProg/database"
	"math/rand"
	"strconv"
	"strings"
	"time"
)

var ticker *time.Ticker

var isRunninf = make(chan bool)

var day = 1000 * 60 * 60 * 24

var outerTick = 1000

var innerTime = time.Now().Unix()
var zoomFactor int64 = 1

func simFunc() {

	for _ = range ticker.C {
		simCon := database.GetSimCon()
		if simCon.IsRunning {
			//Set zoomFaktor
			zoomFactor = simCon.Zoom
			//Set Timestamp to new Value
			innerTime += innerTime + zoomFactor
			//Check if futuretime was set
			if simCon.FutureTimeDateChanged {
				innerTime = simCon.FutureSimDayTime
				//Get current Day at 00:00 o Clock for Reference!
				futYear, futMonth, futDay := time.Unix(innerTime, 0).Date()
				futureDayBeg := time.Date(futYear, futMonth, futDay, 0, 0, 0, 0, time.Unix(innerTime, 0).Location()).Unix()
				//Set all scenes status from 00:00 o Clock
				scenes := database.Getsences()
				for _, scene := range scenes {
					database.Startscene(scene)
				}
				//Set all scenes to the coosen point in time
				hour, min, _ := time.Unix(simCon.FutureSimDayTime, 0).Clock()
				timeInSeconds := (hour * 60 * 60) + (min * 60)
				sceneTimeInSeconds := int64(timeInSeconds)
				for _, scene := range scenes {
					if innerTime > futureDayBeg+sceneTimeInSeconds {
						database.Startscene(scene)
					}
				}
				//Set FutureTimeDateChanged to false
				database.ChangeFutureTime(innerTime, false)

			}
			//Get current Day at 00:00 o Clock for Reference!
			year, month, day := time.Unix(innerTime, 0).Date()
			currentDayBeg := time.Date(year, month, day, 0, 0, 0, 0, time.Unix(innerTime, 0).Location()).Unix()
			//Check if a scene has to be set
			//Get Scenes
			scenes := database.Getsences()
			for _, scene := range scenes {
				//TODO add sunset and sunrise feature
				//TODO add Pos and Neg Offset
				//Calculate offset
				var posOffset int64
				var negOffset int64
				if scene.Posoffset != 0 {
					posOffset = rand.Int63n(int64(scene.Posoffset)) * 60
				}
				if scene.Negoffset != 0 {
					negOffset = rand.Int63n(int64(scene.Negoffset)) * 60
				}

				if scene.Sunrise {

				} else if scene.Sunset {

				} else {
					//Get time in seconds
					setTimeStr := strings.Split(scene.Time, ":")
					var setTimeInt = []int64{}
					setTimeInt[0], _ = strconv.ParseInt(setTimeStr[0], 10, 64)
					setTimeInt[1], _ = strconv.ParseInt(setTimeStr[1], 10, 64)
					setTimeInt[0] = setTimeInt[0] * 60 * 60
					setTimeInt[1] = setTimeInt[1] * 60
					sceneTimeInSec := setTimeInt[0] + setTimeInt[1]
					//Check if scene schould be executed
					if innerTime-(currentDayBeg+sceneTimeInSec) <= zoomFactor {
						database.Startscene(scene)
					}
				}
			}
		}

		//Get Sunset and sunrise
		// Ort (HS-Flensburg, A-210), Zeitzone und Datum definieren
		//(Koordinaten mit http://www.gpsies.com/coordinate.do ermittelt):
		/*
			ortTzoneDat := sunrisesunset.Parameters{
				Latitude:  54.774727032665766,
				Longitude: 9.447391927242279,
				UtcOffset: 1.0, // CET ist UTC + 1h
				Date:      time.Now(),
			}
		*/
		// Sonnenaufgang und Sonnenuntergang berechnen:
		//sa, su, err := ortTzoneDat.GetSunriseSunset()

	}
}

//StartTicker starts the simulation
func StartTicker() {
	ticker = time.NewTicker(time.Millisecond * time.Duration(outerTick))

	go simFunc()

}

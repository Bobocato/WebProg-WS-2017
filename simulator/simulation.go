package simulator

import (
	"WebProg/database"
	"fmt"
	"math"
	"math/rand"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/kelvins/sunrisesunset"
)

var ticker *time.Ticker

var isRunninf = make(chan bool)

var day = 1000 * 60 * 60 * 24
var thisDay time.Time

var outerTick = 1000

var innerTime = time.Now().Unix()
var zoomFactor int64 = 1

type sceneOffset struct {
	sceneID int
	offset  int
}

var user = database.User{
	UserID: -1,
}

var offsets []sceneOffset

var ortTzoneDat sunrisesunset.Parameters
var sunset int64
var sunrise int64

func simFunc() {

	for _ = range ticker.C {
		simCon := database.GetSimCon()
		if simCon.IsRunning {
			//Set zoomFaktor
			zoomFactor = simCon.Zoom
			//Set Timestamp to new Value
			innerTime += zoomFactor
			//Get current Day at 00:00 o Clock for Reference!
			year, month, day := time.Unix(innerTime, 0).Date()
			currentDayBeg := time.Date(year, month, day, 0, 0, 0, 0, time.Unix(innerTime, 0).Location()).Unix()
			//Check if futuretime was set
			if simCon.FutureTimeDateChanged {
				fmt.Println("TO THE FUTURE")
				innerTime = simCon.FutureSimDayTime
				//Get current Day at 00:00 o Clock for Reference!
				futYear, futMonth, futDay := time.Unix(innerTime, 0).Date()
				futureDayBeg := time.Date(futYear, futMonth, futDay, 0, 0, 0, 0, time.Unix(innerTime, 0).Location()).Unix()
				//Get Scenes
				scenes := database.Getsences(user)
				//Sort over time
				sort.Slice(scenes, func(i, j int) bool {
					return scenes[i].Time < scenes[j].Time
				})
				//Start all scenes once, to get the status afetr onw full day
				for _, scene := range scenes {
					database.Startscene(scene)
				}
				//Set all scenes to the choosen point in time
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
			//Check if a scene has to be set
			//Get Scenes
			scenes := database.Getsences(user)
			//Check is offsets have to be calculated
			//Check if a new Day has begon
			if innerTime < currentDayBeg+zoomFactor {
				fmt.Println("New Day")
				//Offsets
				offsets = offsets[:0]
				calculateOffsets(scenes)
				//Sunset and sunrise
				sr, ss, _ := ortTzoneDat.GetSunriseSunset()
				sunrise = sr.Unix()
				sunset = ss.Unix()
			}
			//Start scenes when there time has come
			for _, scene := range scenes {
				var currentOffset sceneOffset
				for _, ele := range offsets {
					if ele.sceneID == scene.SceneID {
						currentOffset = ele
						break
					}
				}
				//TODO add sunset and sunrise feature
				if scene.Sunrise {
					if innerTime-sunrise <= zoomFactor {
						fmt.Println("Scene started")
						database.Startscene(scene)
					}
				} else if scene.Sunset {
					if innerTime-sunset <= zoomFactor {
						fmt.Println("Scene started")
						database.Startscene(scene)
					}
				} else {
					//Get time in seconds
					setTimeStr := strings.Split(scene.Time, ":")
					time1, _ := strconv.ParseInt(setTimeStr[0], 10, 64)
					time2, _ := strconv.ParseInt(setTimeStr[1], 10, 64)
					var setTimeInt = []int64{}
					setTimeInt = append(setTimeInt, time1)
					setTimeInt = append(setTimeInt, time2)
					setTimeInt[0] = setTimeInt[0] * 60 * 60
					setTimeInt[1] = setTimeInt[1] * 60
					sceneTimeInSec := setTimeInt[0] + setTimeInt[1] + int64(currentOffset.offset)
					//Check if scene schould be executed
					if int64(math.Abs(float64(innerTime-(currentDayBeg+sceneTimeInSec)))) <= zoomFactor {
						fmt.Print("InnerTime: ")
						fmt.Println(innerTime)
						fmt.Print("SceneTime: ")
						fmt.Println(currentDayBeg + sceneTimeInSec)
						fmt.Println("Scene started")
						database.Startscene(scene)
					}
				}
			}
			database.SetSimTime(innerTime)
			database.SetSunTimes(sunset, sunrise)
		}
	}
}

//StartTicker starts the simulation
func StartTicker() {
	ticker = time.NewTicker(time.Millisecond * time.Duration(outerTick))
	//Get Scenes
	scenes := database.Getsences(user)
	//Offsets
	offsets = offsets[:0]
	calculateOffsets(scenes)
	//Set sunrise and sunset paras
	// Ort (HS-Flensburg, A-210), Zeitzone und Datum definieren
	//(Koordinaten mit http://www.gpsies.com/coordinate.do ermittelt):
	ortTzoneDat = sunrisesunset.Parameters{
		Latitude:  54.774727032665766,
		Longitude: 9.447391927242279,
		UtcOffset: 1.0, // CET ist UTC + 1h
		Date:      time.Now(),
	}
	//Sunset and sunrise
	sr, ss, _ := ortTzoneDat.GetSunriseSunset()
	sunrise = sr.Unix()
	sunset = ss.Unix()
	go simFunc()

}

func calculateOffsets(scenes []database.Scene) {
	fmt.Println("Calculate offsets")
	if len(scenes) > 0 {
		for _, scene := range scenes {
			//Use pos or neg offset
			currentSceneOffset := sceneOffset{
				sceneID: scene.SceneID,
			}
			if rand.Intn(1) == 0 {
				currentSceneOffset.offset = rand.Intn(scene.Posoffset)
			} else {
				currentSceneOffset.offset = rand.Intn(scene.Negoffset) * (-1)
			}
			offsets = append(offsets, currentSceneOffset)
		}
	}
}

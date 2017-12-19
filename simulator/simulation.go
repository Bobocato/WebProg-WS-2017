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

//Declare Variables

var ticker *time.Ticker

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
var h, m, s = time.Now().Clock()
var checkSecond = h + m + s

var ortTzoneDat sunrisesunset.Parameters
var sunset int64
var sunrise int64

//Simulator is running in here
func simFunc() {
	for _ = range ticker.C {
		h, m, s = time.Now().Clock()
		if checkSecond != h+m+s {
			checkSecond = h + m + s
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
					//Get suntimes
					ortTzoneDat.Date = time.Unix(innerTime, 0)
					sr, ss, _ := ortTzoneDat.GetSunriseSunset()
					sunrise = time.Date(futYear, futMonth, futDay, sr.Hour(), sr.Minute(), sr.Second(), 0, time.Unix(innerTime, 0).Location()).Unix()
					sunset = time.Date(futYear, futMonth, futDay, ss.Hour(), ss.Minute(), ss.Second(), 0, time.Unix(innerTime, 0).Location()).Unix()
					//Sort over time !!!NOT WORKING!!! there needs sunset and sunrise need to be looked at
					sort.Slice(scenes, func(i, j int) bool {
						if scenes[i].Sunrise {
							if scenes[j].Sunrise {
								return true
							} else if scenes[j].Sunset {
								return false
							} else {
								temp := time.Unix(sunrise, 0).Hour()
								tempTimeStr := strings.Split(scenes[j].Time, ":")
								tempTime, _ := strconv.ParseInt(tempTimeStr[0], 10, 64)
								return int64(temp) < tempTime
							}
						} else if scenes[i].Sunset {
							if scenes[j].Sunrise {
								return false
							} else if scenes[j].Sunset {
								return true
							} else {
								temp := time.Unix(sunset, 0).Hour()
								tempTimeStr := strings.Split(scenes[j].Time, ":")
								tempTime, _ := strconv.ParseInt(tempTimeStr[0], 10, 64)
								return int64(temp) < tempTime
							}
						} else {
							if scenes[j].Sunrise {
								temp := time.Unix(sunrise, 0).Hour()
								tempTimeStr := strings.Split(scenes[j].Time, ":")
								tempTime, _ := strconv.ParseInt(tempTimeStr[0], 10, 64)
								return tempTime < int64(temp)
							} else if scenes[j].Sunset {
								temp := time.Unix(sunset, 0).Hour()
								tempTimeStr := strings.Split(scenes[j].Time, ":")
								tempTime, _ := strconv.ParseInt(tempTimeStr[0], 10, 64)
								return tempTime < int64(temp)
							} else {
								tempTimeStr0 := strings.Split(scenes[i].Time, ":")
								tempTime0, _ := strconv.ParseInt(tempTimeStr0[0], 10, 64)
								tempTimeStr := strings.Split(scenes[j].Time, ":")
								tempTime, _ := strconv.ParseInt(tempTimeStr[0], 10, 64)
								return tempTime < tempTime0
							}
						}
					})
					//Start all scenes once, to get the status after one full day
					for _, scene := range scenes {
						if scene.Active {
							database.Startscene(scene)
						}
					}

					for _, scene := range scenes {
						//Set all scenes till the choosen point in time
						if scene.Active {
							if scene.Sunrise {
								if innerTime > sunrise {
									database.Startscene(scene)
								}
							} else if scene.Sunset {
								if innerTime > sunset {
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
								sceneTimeInSec := setTimeInt[0] + setTimeInt[1] + futureDayBeg
								if sceneTimeInSec < innerTime {
									database.Startscene(scene)
								}
							}
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
					fmt.Println("Calculate Suntimes")
					ortTzoneDat.Date = time.Unix(innerTime, 0)
					sr, ss, _ := ortTzoneDat.GetSunriseSunset()
					sunrise = time.Date(year, month, day, sr.Hour(), sr.Minute(), sr.Second(), 0, time.Unix(innerTime, 0).Location()).Unix()
					sunset = time.Date(year, month, day, ss.Hour(), ss.Minute(), ss.Second(), 0, time.Unix(innerTime, 0).Location()).Unix()
				}
				//Start scenes when there time has come
				for _, scene := range scenes {
					if scene.Active {
						var currentOffset sceneOffset
						for _, ele := range offsets {
							if ele.sceneID == scene.SceneID {
								currentOffset = ele
								break
							}
						}
						//TODO add sunset and sunrise feature
						if scene.Sunrise {
							if int64(math.Abs(float64(innerTime-sunrise+int64(currentOffset.offset)))) <= zoomFactor {
								fmt.Println("SunriseScene started")
								database.Startscene(scene)
							}
						} else if scene.Sunset {
							if int64(math.Abs(float64(innerTime-sunset+int64(currentOffset.offset)))) <= zoomFactor {
								fmt.Println("SunsetScene started")
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
								fmt.Println("TimeScene started")
								database.Startscene(scene)
							}
						}
					}
				}
				database.SetSimTime(innerTime)
				database.SetSunTimes(sunset, sunrise)
			}
		}
	}
}

//StartTicker starts the simulation
func StartTicker() {
	ticker = time.NewTicker(time.Duration(outerTick) * time.Millisecond)
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
	year, month, day := time.Unix(innerTime, 0).Date()
	sunrise = time.Date(year, month, day, sr.Hour(), sr.Minute(), sr.Second(), 0, time.Unix(innerTime, 0).Location()).Unix()
	sunset = time.Date(year, month, day, ss.Hour(), ss.Minute(), ss.Second(), 0, time.Unix(innerTime, 0).Location()).Unix()
	go simFunc()

}

//Calculate pos and neg offset for the scenes for the day
func calculateOffsets(scenes []database.Scene) {
	fmt.Println("Calculate offsets")
	if len(scenes) > 0 {
		for _, scene := range scenes {
			//Use pos or neg offset
			currentSceneOffset := sceneOffset{
				sceneID: scene.SceneID,
			}
			if rand.Intn(1) == 0 {
				if scene.Posoffset != 0 {
					currentSceneOffset.offset = rand.Intn(scene.Posoffset)
				}
			} else {
				if scene.Negoffset != 0 {
					currentSceneOffset.offset = rand.Intn(scene.Negoffset) * (-1)
				}
			}
			offsets = append(offsets, currentSceneOffset)
		}
	}
}

package simulator

import (
	"WebProg/database"
	"time"

	"github.com/kelvins/sunrisesunset"
)

var ticker *time.Ticker

var isRunninf = make(chan bool)

var outerTick = 1000

var innerTime = time.Now().Unix()
var zoomFactor int64 = 1

func simFunc() {

	for _ = range ticker.C {
		innerTime += innerTime + (zoomFactor * 1000)
		//Get Sunset and sunrise
		// Ort (HS-Flensburg, A-210), Zeitzone und Datum definieren
		//(Koordinaten mit http://www.gpsies.com/coordinate.do ermittelt):
		ortTzoneDat := sunrisesunset.Parameters{
			Latitude:  54.774727032665766,
			Longitude: 9.447391927242279,
			UtcOffset: 1.0, // CET ist UTC + 1h
			Date:      time.Now(),
		}

		// Sonnenaufgang und Sonnenuntergang berechnen:
		sa, su, err := ortTzoneDat.GetSunriseSunset()
		//Get Scenes
		scenes := database.Getsences()
		//Create and check timestamps
		for _ scene = range scenes {

		}
	}
}

//StartTicker starts the simulation
func StartTicker() {
	ticker = time.NewTicker(time.Millisecond * time.Duration(outerTick))

	go simFunc()

	for {
		select {}
	}

}

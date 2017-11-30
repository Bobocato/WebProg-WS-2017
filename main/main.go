package main

import (
	"WebProg/database"
	"WebProg/webclient"
)

func main() {
	database.InitDB()
	webclient.InitWS()
}

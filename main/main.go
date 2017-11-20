package main

import(
	"fmt"
	"WebProg/webclient/cookie"
)

main(){
	key := CreateCookie()
	fmt.Fprintln(key)
}


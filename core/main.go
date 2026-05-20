package main

import (
	"syscall/js"
	"time"
)

// A global placeholder to keep track of our JavaScript listener
var jsListener js.Value
var game Game

func registerListener(this js.Value, args []js.Value) any {
	if len(args) < 1 || args[0].Type() != js.TypeFunction {
		return "Error: Expected a callback function"
	}
	jsListener = args[0]
	return nil
}

func createGame(this js.Value, args []js.Value) any {
	if len(args) == 2 &&
		args[0].Type() == js.TypeString &&
		args[1].Type() == js.TypeNumber {
		game = *newGame("Test game", 21)
		return toJsonString(game)
	}
	return "Wrong args"
}

func main() {
	// Register the "add" function to the global JavaScript scope
	js.Global().Set("onMessage", js.FuncOf(registerListener))
	js.Global().Set("createGame", js.FuncOf(createGame))

	go func() {
		time.Sleep(time.Second)
		jsListener.Invoke(toJsonString(game))
	}()

	// Keep the Go program alive
	keepalive := make(chan struct{})
	<-keepalive
}

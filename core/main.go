package main

import (
	"fmt"
	"time"
)

/*
import (
	"syscall/js"
)

func add(this js.Value, args []js.Value) any {
	if len(args) < 2 {
		return "Error: Two arguments required"
	}

	// Convert JavaScript numbers (which are float64)
	arg1 := args[0].Float()
	arg2 := args[1].Float()

	return arg1 + arg2
}

func main() {
	// Register the "add" function to the global JavaScript scope
	js.Global().Set("add", js.FuncOf(add))

	// Keep the Go program alive
	c := make(chan struct{})
	<-c
}
*/

func main() {
	/*
		var a = struct {
			b []int
		}{
			b: []int{6, 4},
		}

		fmt.Println(a)
		fmt.Println(a.b)

		cpy := &a.b
		fmt.Println(cpy)

		*cpy = []int{1, 2}
		fmt.Println(cpy)
		fmt.Println(a.b)
	*/

	var f func(a int) int
	f = func(a int) int {
		return a * a * a
	}

	fmt.Println(f(3))

	af := &f

	go func() {
		fmt.Println("Waiting 2 secs...")
		time.Sleep(2 * time.Second)
		fmt.Println("After 2 sec: ", (*af)(2))
	}()

	go func() {
		fmt.Println("Waiting 4 secs...")
		time.Sleep(4 * time.Second)
		fmt.Println("After 4 sec: ", (*af)(2))
	}()

	go func() {
		time.Sleep(3 * time.Second)
		(*af) = func(b int) int {
			return b - 3
		}
		fmt.Println("Waiting 3 secs and changing f in a goroutine")
	}()

	time.Sleep(5 * time.Second)

	fmt.Println(f(3))

}

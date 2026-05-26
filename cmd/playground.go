package main

import (
	"fmt"
	"sync"
	"time"
)

type MyType = []int

func main() {
	var mutex sync.Mutex
	tab := MyType{}

	i := 0
	for i < 1000 {
		go pushData(&tab, &mutex)
		i++
	}

	time.Sleep(2000 * time.Millisecond)
	fmt.Println(len(tab), cap(tab))
}

func pushData(tab *MyType, mutex *sync.Mutex) {
	i := 0
	for i < 1000 {
		mutex.Lock()
		(*tab) = append((*tab), 1, 2, 3, 4, 5, 6)
		mutex.Unlock()
		time.Sleep(1 * time.Millisecond)
		i++
	}
}

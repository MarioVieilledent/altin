package main

import (
	"testing"
)

func TestGameSimulation(t *testing.T) {
	g := Game{
		Map:     NewMap(21),
		Players: make([]Player, 1),
	}

	g.start()

	player1 := &g.Players[0]
	player1.Name = "Gaïa"
	player1.spawnUnit(*newVillager())

	player1.setResources(
		50, 0, 0, 0,
	)

	err := g.build(*player1, WoodenHouse, 10, 1)
	if err != nil {
		t.Errorf("Error building house: %s", err)
	}

}

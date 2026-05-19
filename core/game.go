package main

import (
	"time"
)

type Game struct {
	Map     Map      `json:"map"`
	Players []Player `json:"players"`
	Tick    uint64   `json:"tick"`
	Logs    []Log    `json:"logs"`
}

type Log struct {
	Timestamp time.Time `json:"timestamp"`
	Message   string    `json:"message"`
}

func (g *Game) log(message string) {
	g.Logs = append(g.Logs, Log{time.Now(), message})
}

func (g *Game) start() {
	g.log("Game started")

}

func (g Game) build(player Player, structure Structure, x int32, y int32) error {
	var err error

	err = g.Map.canBuildStructure(structure, x, y)
	if err != nil {
		return err
	}

	err = player.buy(structure)
	if err != nil {
		return err
	}

	err = g.Map.buildStructure(structure, x, y)
	if err != nil {
		return err
	}

	return nil
}

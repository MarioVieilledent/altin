package main

// Terrain
const WATER = 0
const GRASS = 1

type Tile struct {
	Terrain   int32      `json:"terrain"`
	Structure *Structure `json:"object"`
}

func (t *Tile) isEmpty() bool {
	return t.Structure == nil
}

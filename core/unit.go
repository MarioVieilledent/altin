package main

const VILLAGER = 0

type Unit struct {
	unitType int32
	canBuild bool
	speed    float64
}

func newVillager() *Unit {
	return &Unit{
		VILLAGER,
		true,
		1.0,
	}
}

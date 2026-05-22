package core

const VILLAGER = 0

type Unit struct {
	UnitType int32   `json:"unitType"`
	X        float64 `json:"x"`
	Y        float64 `json:"y"`
	CanBuild bool    `json:"canBuild"`
	Speed    float64 `json:"speed"`
}

func NewVillager() *Unit {
	return &Unit{
		VILLAGER,
		1.5,
		1.5,
		true,
		1.0,
	}
}

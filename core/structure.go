package core

// Materials
const WOOD = 0
const BRICKS = 1
const STONE = 2

// States
const PLANNED = 0
const BUILDING = 1
const BUILT = 2
const DAMAGED = 3
const DESTROYED = 4

type Structure struct {
	StructureId int32     `json:"structureId"`
	Name        string    `json:"Name"`
	Material    int32     `json:"material"`
	Cost        Resources `json:"cost"`
	State       int32     `json:"state"`
	Hp          int32     `json:"hp"`
}

var WoodenHouse = Structure{
	0, "Wooden house", WOOD, Resources{
		50, 0, 0, 0,
	}, 0, 100,
}

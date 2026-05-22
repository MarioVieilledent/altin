package core

import "fmt"

type Player struct {
	Name      string    `json:"name"`
	Resources Resources `json:"resources"`
	Units     []Unit    `json:"units"`
}

func NewPlayer(name string) *Player {
	return &Player{
		Name:      name,
		Resources: Resources{0, 0, 0, 0},
		Units:     make([]Unit, 0),
	}
}

func (p *Player) spawnUnit(unit Unit) {
	p.Units = append(p.Units, unit)
}

func (p *Player) setResources(wood, bricks, stone, food int32) {
	p.Resources.Wood = wood
	p.Resources.Bricks = bricks
	p.Resources.Stone = stone
	p.Resources.Food = food
}

func (p *Player) buy(structure Structure) error {
	if p.Resources.Wood >= structure.Cost.Wood &&
		p.Resources.Bricks >= structure.Cost.Bricks &&
		p.Resources.Stone >= structure.Cost.Stone &&
		p.Resources.Food >= structure.Cost.Food {
		p.Resources.Wood -= structure.Cost.Wood
		p.Resources.Bricks -= structure.Cost.Bricks
		p.Resources.Stone -= structure.Cost.Stone
		p.Resources.Food -= structure.Cost.Food
		return nil
	} else {
		return fmt.Errorf("player %s is missing resources to buy structure %s", p.Name, structure.Name)
	}
}

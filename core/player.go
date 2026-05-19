package main

import "fmt"

type Player struct {
	Name      string    `json:"name"`
	Resources Resources `json:"resources"`
	Units     []Unit    `json:"Units"`
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

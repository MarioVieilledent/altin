package main

import (
	"fmt"
	"math"
)

type Map struct {
	Size  int32  `json:"size"`
	Tiles []Tile `json:"tiles"`
}

func NewMap(size int32) Map {
	return Map{size, make([]Tile, size*size)}
}

func (m Map) getTile(x, y int32) (*Tile, error) {
	if x < 0 || y < 0 || x >= m.Size || y >= m.Size {
		return nil, fmt.Errorf("coordinates (%d, %d) out of bounds for map size %d", x, y, m.Size)
	} else {
		return &m.Tiles[x*m.Size+y], nil
	}
}

func (m Map) getTileIndex(x, y int32) (int32, error) {
	if x < 0 || y < 0 || x >= m.Size || y >= m.Size {
		return 0, fmt.Errorf("coordinates (%d, %d) out of bounds for map size %d", x, y, m.Size)
	} else {
		return x*m.Size + y, nil
	}
}

func (m Map) canBuildStructure(structure Structure, x, y int32) error {
	tile, err := m.getTile(x, y)
	if err != nil {
		return err
	} else {
		if tile.isEmpty() {
			return nil
		} else {
			return fmt.Errorf("there is already a structure on coordinates (%d, %d)", x, y)
		}
	}
}

func (m *Map) buildStructure(structure Structure, x, y int32) error {
	tileIndex, err := m.getTileIndex(x, y)
	if err != nil {
		return err
	}
	m.Tiles[tileIndex].Structure = &structure
	return nil
}

func (m Map) moveUnit(unit Unit, x, y float64) error {
	cielSize := math.Ceil(float64(m.Size))
	if x <= 0.0 || y <= 0.0 || x >= cielSize || y >= cielSize {
		return fmt.Errorf("cannot move unit coordinates (%f, %f) out of bounds for map size %d", x, y, m.Size)
	} else {
		return nil
	}
}

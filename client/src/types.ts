export interface Game {
  name: string;
  map: Map;
  players: Player[];
  tick: number;
  logs: any;
}

export interface Map {
  size: number;
  tiles: Tile[];
}

export interface Tile {
  terrain: number;
  object: Structure;
}

export interface Structure {
  structureId: number;
  Name: string;
  material: number;
  cost: Resources;
  state: number;
  hp: number;
}

export interface Player {
  name: string;
  resources: Resources;
  units: Unit[];
}

export interface Resources {
  wood: number;
  bricks: number;
  stone: number;
  food: number;
}

export interface Unit {
  unitType: number;
  x: number;
  y: number;
  canBuild: boolean;
  speed: number;
}

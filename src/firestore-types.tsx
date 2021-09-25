export type heroColor = "yellow" | "purple" | "green" | "orange"
export type heroName = "Barbarian" | "Mage" | "Elf" | "Dwarf"
export type heroWeapon = "sword" | "vial" | "bow" | "axe"
export type heroAbility = "disableSecurityCamera" | "revealExtraTile" | "weCanTalkAgain" | "iAmTiny"

export type playerNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null
export type direction = "up" | "right" | "down" | "left"
export type basicAbility = "explore" | "teleport" | "escalator"


// export interface SandTimer {
//   timeLimit: number,
//   pause: boolean,
//   flip: () => void,
//   swapActions: () => void
// }

export interface DBPawns {
  green: DBHeroPawn,
  yellow: DBHeroPawn,
  orange: DBHeroPawn,
  purple: DBHeroPawn,
}

export interface Room {
  // timerRunning: boolean
  // minutesLeft: number,
  // gameOver: boolean,
  gameStarted: boolean
  timeLeft: number,
  weaponsStolen: heroColor[],
  heroesEscaped: heroColor[],
  players: DBPlayer[],
  tiles: DBTile[],
  pawns: DBPawns,
}


export interface DBPlayer {
  name: string,
  number: playerNumber,
  playerDirections: direction[],
  playerAbilities: basicAbility[],
  pinged: boolean
}


export interface DBHeroPawn {
  color: heroColor,
  playerHeld: playerNumber | null,
  position: number[],
  gridPosition: number[],
  ability: string,
  canUseAbility: boolean,
}

export interface DBTile {
  id: string,
  gridPosition: number[],
  spaces: {
    0: DBSpace[],
    1: DBSpace[],
    2: DBSpace[],
    3: DBSpace[]
  },
  rotation?: number,
  placementDirection?: direction,
  entryDirection?: direction,
  entrySide?: direction
}

export interface DBSpace {
  type: SpaceTypeName,
  details?: (SpaceDetails | TimerSpace | TeleporterSpace | ExplorationSpace | SpecialSpace | WeaponSpace | ExitSpace),
}

interface SpaceDetails {
  sideWalls?: direction[],
  hasEscalator?: boolean,
  escalatorName?: string,
  isEntry?: boolean
}

type SpaceTypeName = "timer" | "teleporter" | "exploration" | "special" | "weapon" | "exit" | "blank" | "barrier"

export interface TimerSpace extends SpaceDetails {
  isDisabled: boolean
}

export interface TeleporterSpace extends SpaceDetails {
  color: heroColor,
}

export interface ExplorationSpace extends SpaceDetails {
  color: heroColor,
  hasLoudspeaker: boolean,
  exploreDirection: direction
}

interface SpecialSpace extends SpaceDetails {
  specialAbility: heroAbility,
}

export interface WeaponSpace extends SpaceDetails {
  weaponStolen: boolean,
  color: heroColor
}

export interface ExitSpace extends SpaceDetails {
  color: heroColor
}
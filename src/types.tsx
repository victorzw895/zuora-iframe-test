export type heroColor = "yellow" | "purple" | "green" | "orange"
export type heroName = "Barbarian" | "Mage" | "Elf" | "Dwarf"
export type heroWeapon = "sword" | "vial" | "bow" | "axe"
export type heroAbility = "disableSecurityCamera" | "revealExtraTile" | "weCanTalkAgain" | "iAmTiny"

export type playerNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null
export type direction = "up" | "right" | "down" | "left"
export type basicAbility = "explore" | "teleport" | "escalator"


export interface SandTimer {
  timeLimit: number,
  pause: boolean,
  flip: () => void,
  swapActions: () => void
}

export interface Game {
  roomId: string,
  timerRunning: boolean
  minutesLeft: number,
  secondsLeft: number,
  gameOver: boolean,
  // weaponsStolen: heroColor[],
  // heroesEscaped: heroColor[]
  // players: Player[],
  // gameStarted: boolean
}

export interface Escalator {
  position: number[] | null,
  gridPosition: number[] | null,
  escalatorName: string | null
}

export interface Player {
  // DB
  // name: string,
  // playerDirections: direction[],
  // playerAbilities: basicAbility[],
  // LOCAL
  number: playerNumber,
  showMovableDirections: direction[],
  showTeleportSpaces: heroColor | null,
  showEscalatorSpaces: Escalator[]
  // playerPawnHeld: heroColor | null, // unused
  // placeTile: () => void,
  // pingPlayer: ((number: playerNumber) => void) | null,
}

type BlockedPosition = {
  position: number[] | null;
  gridPosition: number[] | null;
}

export interface HeroPawn {
  heroName: heroName,
  color: heroColor,
  weapon: heroWeapon,
  width: number,
  height: number,
  blockedPositions: {
    up: BlockedPosition,
    down: BlockedPosition,
    left: BlockedPosition,
    right: BlockedPosition
  }
}

export interface TileInterface {
  id: string,
  // width: number,
  // height: number,
  rotation?: number,
  spaces?: {
    0: Space[],
    1: Space[],
    2: Space[],
    3: Space[]
  },
  gridPosition: number[],
  placementDirection?: direction,
  entryDirection?: direction,
  entrySide?: direction
}

export interface Space {
  type: SpaceTypeName,
  details?: (SpaceDetails | TimerSpace | TeleporterSpace | ExplorationSpace | SpecialSpace | WeaponSpace | ExitSpace),
}

interface SpaceDetails {
  isOccupied?: boolean,
  sideWalls?: direction[],
  hasEscalator?: boolean,
  // useEscalator?: () => void,
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
  name: heroWeapon,
  weaponStolen: boolean,
  color: heroColor
}

export interface ExitSpace extends SpaceDetails {
  color: heroColor
}
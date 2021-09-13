export type heroColor = "yellow" | "purple" | "green" | "orange"
export type heroName = "Barbarian" | "Mage" | "Elf" | "Dwarf"
export type heroWeapon = "sword" | "vial" | "bow" | "axe"
export type heroAbility = "disableSecurityCamera" | "revealExtraTile" | "weCanTalkAgain" | "iAmTiny"

export type playerNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type direction = "up" | "right" | "down" | "left"
type basicAbility = "reveal" | "teleport" | "escalator" | null


export interface SandTimer {
  timeLimit: number,
  pause: boolean,
  flip: () => void,
  swapActions: () => void
}

export interface Player {
  number: playerNumber,
  playerDirections: direction[],
  playerPawnHeld: heroColor | null,
  playerAbility: basicAbility,
  // placeTile: () => void,
  pingPlayer: (number: playerNumber) => void,
}

export interface HeroPawn {
  heroName: heroName,
  color: heroColor,
  weapon: heroWeapon,
  width: number,
  height: number,
  playerHeld: playerNumber | null,
  resetPlayerHeld: () => void,
  position: number[],
  gridPosition: number[],
  ability: string,
  canUseAbility: boolean,
  move: () => void,
  useAbility: () => void,
  stealWeapon: () => void,
  escape: () => boolean,
  blockedPositions: {
    up: number[] | undefined,
    down: number[] | undefined,
    left: number[] | undefined,
    right: number[] | undefined
  }
}

export interface TileInterface {
  id: string,
  // width: number,
  // height: number,
  rotation?: number,
  spaces?: Space[][],
  gridPosition: number[],
  placementDirection?: direction,
  entryDirection?: direction,
  entrySide?: direction
}

export interface Space {
  type: SpaceTypeName,
  details?: SpaceDetails | TimerSpace | TeleporterSpace | ExplorationSpace | SpecialSpace | WeaponSpace | ExitSpace,
}

interface SpaceDetails {
  isOccupied?: boolean,
  sideWalls?: direction[],
  hasEscalator?: boolean,
  useEscalator?: () => void,
  isEntry?: boolean
}

type SpaceTypeName = "timer" | "teleporter" | "exploration" | "special" | "weapon" | "exit" | "blank" | "barrier"

interface TimerSpace extends SpaceDetails {
  isDisabled: boolean
}

interface TeleporterSpace extends SpaceDetails {
  color: heroColor,
}

interface ExplorationSpace extends SpaceDetails {
  color: heroColor,
  hasLoudspeaker: boolean,
  exploreDirection: direction
}

interface SpecialSpace extends SpaceDetails {
  specialAbility: heroAbility,
}

interface WeaponSpace extends SpaceDetails {
  name: heroWeapon,
  weaponStolen: boolean,
  color: heroColor
}

interface ExitSpace extends SpaceDetails {
  color: heroColor
}
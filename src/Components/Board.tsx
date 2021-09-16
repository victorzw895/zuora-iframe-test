import React, { useEffect, useState } from 'react';
import Tile from './Tile';
import NewTileArea from './NewTileArea';
import Pawn from './Pieces/Pawn';
import PlayerArea from './PlayerArea';
import { TileInterface, direction, HeroPawn } from '../types';
import './Board.scss';
import { usePawn } from '../Contexts/PawnContext';
import { useTiles } from '../Contexts/TilesContext';
import { tile1a } from '../Data/tile1a';
import Draggable from 'react-draggable';
import { allTiles } from '../Data/all-tiles-data';


const startTiles = [
    {gridPosition: [8,7]},
    {gridPosition: [9,8]},
    {gridPosition: [8,9]},
    {gridPosition: [7,8]}
  ]

const Board = () => {

  const { tilesState, tilesDispatch } = useTiles();
  
  useEffect(() => {
    tilesDispatch({type: "initTile", value: tile1a as TileInterface})
  }, [])

  const { pawnState, pawnDispatch } = usePawn();
  const { yellow, green, purple, orange } = pawnState;

  const [availableArea, setAvailableArea] = useState<TileInterface[]>(startTiles as TileInterface[]);
  // const [availableArea, setAvailableArea] = useState<TileInterface[]>([]);

  const getExplorationTile = (pawnGridPosition: number[], pawnColIndex: number, pawnRowIndex: number) => {
    // const allTiles = [...availableArea];

    // CHECK EXPLORE TILE MATCHES PAWN COLOR!
    console.log("tilesState", tilesState);
    const currentTile = tilesState.find(tile => tile.gridPosition[0] === pawnGridPosition[0] && tile.gridPosition[1] === pawnGridPosition[1])
    console.log("currentTile", currentTile, pawnGridPosition)
    if (currentTile) {
      const pawnRow = currentTile.spaces!.filter((row, rowIndex) => rowIndex === pawnRowIndex).flat(1)
      const pawnSpace = pawnRow.find((col, colIndex) => colIndex === pawnColIndex)
      const spaceDetails = pawnSpace?.details as any
      if (pawnSpace && pawnSpace.type === "exploration") {
        console.log("currentTile has exploration type", currentTile, pawnGridPosition)

        if (spaceDetails.exploreDirection === "up") {
          const tileExists = tilesState.find(tile => tile.gridPosition[0] === currentTile.gridPosition[0] && tile.gridPosition[1] === currentTile.gridPosition[1] - 1)
          if (tileExists) return
          return {gridPosition: [currentTile.gridPosition[0], currentTile.gridPosition[1] - 1], placementDirection: spaceDetails.exploreDirection}
        }
        if (spaceDetails.exploreDirection === "down") {
          const tileExists = tilesState.find(tile => tile.gridPosition[0] === currentTile.gridPosition[0] && tile.gridPosition[1] === currentTile.gridPosition[1] + 1)
          if (tileExists) return
          return {gridPosition: [currentTile.gridPosition[0], currentTile.gridPosition[1] + 1], placementDirection: spaceDetails.exploreDirection}
        }
        if (spaceDetails.exploreDirection === "left") {
          const tileExists = tilesState.find(tile => tile.gridPosition[0] === currentTile.gridPosition[0] - 1 && tile.gridPosition[1] === currentTile.gridPosition[1])
          console.log("here", tileExists)
          if (tileExists) return
          return {gridPosition: [currentTile.gridPosition[0] - 1, currentTile.gridPosition[1]], placementDirection: spaceDetails.exploreDirection}
        }
        if (spaceDetails.exploreDirection === "right") {
          const tileExists = tilesState.find(tile => tile.gridPosition[0] === currentTile.gridPosition[0] + 1 && tile.gridPosition[1] === currentTile.gridPosition[1])
          if (tileExists) return
          return {gridPosition: [currentTile.gridPosition[0] + 1, currentTile.gridPosition[1]], placementDirection: spaceDetails.exploreDirection}
        }
      }
    }

    // return allTiles
  }


  const highlightNewTileArea = () => {
    const placeholderTiles = [...availableArea];
    console.log("higlight new tiles", placeholderTiles)

    const highlightAreas = Object.entries(pawnState).map(([color, pawn]) => {
      return getExplorationTile(pawn.gridPosition, pawn.position[0], pawn.position[1]) 
    }).filter(gridPos => gridPos) as TileInterface[]

    highlightAreas.forEach(newArea => {
      const tileIndex = placeholderTiles.findIndex(tile => tile.gridPosition[0] === newArea.gridPosition[0] && tile.gridPosition[1] === newArea.gridPosition[1]);
      if (tileIndex === -1) {
        placeholderTiles.push(newArea)
      }
      else {
        placeholderTiles[tileIndex] = newArea
      }
      console.log("new area highlight", newArea.gridPosition, tileIndex)
      // placeholderTiles.push(newArea)
    })

    console.log("****", highlightAreas, placeholderTiles)

    console.log("alltiles", placeholderTiles);
    // check if pawns on explore space
    // if pawn position on explore space
    // check pawn tile position
    // const highlightAreas = [[8, 7], [9, 8], [8, 9], [7, 8]]

    // const tiles: TileInterface[] = [
    //   {id: "4", gridPosition: [8,7], placementDirection: 'up'},
    //   {id: "7", gridPosition: [9,8], placementDirection: 'right'},
    //   {id: "6", gridPosition: [8,9], placementDirection: 'down'},
    //   {id: "5", gridPosition: [7,8], placementDirection: 'left'}
    // ]

    // highlight area
    setAvailableArea(placeholderTiles);
  }

  const addPlaceholders = (gridPosition: number[]) => {

    const extraPlaceholderTiles = [
      {gridPosition: [gridPosition[0] - 1, gridPosition[1]]},
      {gridPosition: [gridPosition[0], gridPosition[1] - 1]},
      {gridPosition: [gridPosition[0] + 1, gridPosition[1]]},
      {gridPosition: [gridPosition[0], gridPosition[1] + 1]},
    ] as TileInterface[]

    console.log("extraPlaceholders", gridPosition, extraPlaceholderTiles)
    return extraPlaceholderTiles;
  }

  const clearHighlightAreas = (gridPosition: number[]) => {
    const remainingAvailable = availableArea.filter(area => area.gridPosition[0] !== gridPosition[0] || area.gridPosition[1] !== gridPosition[1]);
    
    const resetAreas = remainingAvailable.map(area => {
      return {gridPosition: area.gridPosition}
    })

    if (gridPosition[0] === 8) {
      if (gridPosition[1] < 8) {
        resetAreas.push({gridPosition: [gridPosition[0], gridPosition[1] - 1]} as TileInterface) 
      }
      else if (gridPosition[1] > 8) {
        resetAreas.push({gridPosition: [gridPosition[0], gridPosition[1] + 1]} as TileInterface) 
      }
    }
    else if (gridPosition[1] === 8) {
      if (gridPosition[0] < 8) {
        resetAreas.push({gridPosition: [gridPosition[0] - 1, gridPosition[1]]} as TileInterface) 
      }
      else if (gridPosition[0] > 8) {
        resetAreas.push({gridPosition: [gridPosition[0] + 1, gridPosition[1]]} as TileInterface) 
      }
    }

    setAvailableArea(resetAreas as TileInterface[]);
  }

  return (
    <div className="Board">
      <Draggable
        defaultPosition={{x: 0, y: 0}}
        >
        <div className="playable-area">
          {availableArea.length > 0 && availableArea.map((newTileArea, i) => {
            return (
              <NewTileArea key={i} tile={newTileArea} clearHighlightAreas={clearHighlightAreas} />
            )
          })}
          {tilesState.length > 0 && tilesState.map((newTile, i) => {
            return (
              <Tile key={i} tileData={newTile}/>
            )
          })}
          {yellow.position && <Pawn color="yellow" position={yellow.position} />}
          {orange.position && <Pawn color="orange" position={orange.position} />}
          {green.position && <Pawn color="green" position={green.position} />}
          {purple.position && <Pawn color="purple" position={purple.position} />}
        </div>
      </Draggable>
      <PlayerArea highlightNewTileArea={highlightNewTileArea}/>
    </div>
  )
}

export default Board;
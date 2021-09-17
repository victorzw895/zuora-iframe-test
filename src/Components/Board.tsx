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

  const getExplorationTile = (pawn: HeroPawn, pawnColIndex: number, pawnRowIndex: number) => {
    const currentTile = tilesState.find(tile => tile.gridPosition[0] === pawn.gridPosition[0] && tile.gridPosition[1] === pawn.gridPosition[1])
    if (currentTile) {
      const pawnRow = currentTile.spaces!.filter((row, rowIndex) => rowIndex === pawnRowIndex).flat(1)
      const pawnSpace = pawnRow.find((col, colIndex) => colIndex === pawnColIndex)
      const spaceDetails = pawnSpace?.details as any
      if (pawnSpace && pawnSpace.type === "exploration" && spaceDetails.color === pawn.color) {
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
  }


  const highlightNewTileArea = () => {
    const placeholderTiles = [...availableArea];

    const highlightAreas = Object.entries(pawnState).map(([color, pawn]) => {
      return getExplorationTile(pawn, pawn.position[0], pawn.position[1]) 
    }).filter(gridPos => gridPos) as TileInterface[]

    highlightAreas.forEach(newArea => {
      const tileIndex = placeholderTiles.findIndex(tile => tile.gridPosition[0] === newArea.gridPosition[0] && tile.gridPosition[1] === newArea.gridPosition[1]);
      if (tileIndex === -1) {
        placeholderTiles.push(newArea)
      }
      else {
        placeholderTiles[tileIndex] = newArea
      }
    })

    setAvailableArea(placeholderTiles);
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
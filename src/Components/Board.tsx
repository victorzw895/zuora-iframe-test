import React, { useEffect, useRef, useState } from 'react';
import Tile from './Tile';
import NewTileArea from './NewTileArea';
import Pawn from './Pieces/Pawn';
import PlayerArea from './PlayerArea';
import { TileInterface, direction, HeroPawn } from '../types';
import './Board.scss';
import { usePawn, pawnsInitialState } from '../Contexts/PawnContext';
import { useTiles } from '../Contexts/TilesContext';
import { useGame } from '../Contexts/GameContext';
import { tile1a } from '../Data/tile1a';
import Draggable from 'react-draggable';
import { collection, getDoc, query, where, setDoc, doc, DocumentReference, DocumentData } from "firebase/firestore"; 
import { firestore } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'

const startTiles = [
    {gridPosition: [8,7]},
    {gridPosition: [9,8]},
    {gridPosition: [8,9]},
    {gridPosition: [7,8]}
  ]

const Board = () => {
  const draggableNodeRef = useRef(null);
  const { gameState, gameDispatch } = useGame();

  const gamesRef = firestore.collection('games')

  const [room] = useDocumentData(gamesRef.doc(gameState.roomId));



  const { tilesState, tilesDispatch } = useTiles();
  
  useEffect(() => {
    // tilesDispatch({type: "initTile", value: tile1a as TileInterface})
    // (async() => {
    //   const initTile = {
    //     ...tile1a,
    //     gridPosition: [8, 8]
    //   }
    //   await setDoc(
    //     gamesRef.doc(gameState.roomId), 
    //     {tiles: [initTile], pawns: pawnsInitialState},
    //     {merge: true}
    //   )
    // })()
  }, [room])

  const { pawnState, pawnDispatch } = usePawn();
  const { yellow, green, purple, orange } = pawnState;

  const [availableArea, setAvailableArea] = useState<TileInterface[]>(startTiles as TileInterface[]);

  const getExplorationTile = (pawn: HeroPawn, pawnColIndex: number, pawnRowIndex: number) => {
    const currentTile = room.tiles.find((tile: any) => tile.gridPosition[0] === pawn.gridPosition[0] && tile.gridPosition[1] === pawn.gridPosition[1])
    if (currentTile) {
      const pawnRow = Object.values(currentTile.spaces!).filter((row: any, rowIndex: number) => rowIndex === pawnRowIndex).flat(1)
      const pawnSpace = pawnRow.find((col: any, colIndex: number) => colIndex === pawnColIndex)
      const spaceDetails = (pawnSpace as any).details as any
      if (pawnSpace && (pawnSpace as any).type === "exploration" && spaceDetails.color === pawn.color) {
        if (spaceDetails.exploreDirection === "up") {
          const tileExists = room.tiles.find((tile: any) => tile.gridPosition[0] === currentTile.gridPosition[0] && tile.gridPosition[1] === currentTile.gridPosition[1] - 1)
          if (tileExists) return
          return {gridPosition: [currentTile.gridPosition[0], currentTile.gridPosition[1] - 1], placementDirection: spaceDetails.exploreDirection}
        }
        if (spaceDetails.exploreDirection === "down") {
          const tileExists = room.tiles.find((tile: any) => tile.gridPosition[0] === currentTile.gridPosition[0] && tile.gridPosition[1] === currentTile.gridPosition[1] + 1)
          if (tileExists) return
          return {gridPosition: [currentTile.gridPosition[0], currentTile.gridPosition[1] + 1], placementDirection: spaceDetails.exploreDirection}
        }
        if (spaceDetails.exploreDirection === "left") {
          const tileExists = room.tiles.find((tile: any) => tile.gridPosition[0] === currentTile.gridPosition[0] - 1 && tile.gridPosition[1] === currentTile.gridPosition[1])
          if (tileExists) return
          return {gridPosition: [currentTile.gridPosition[0] - 1, currentTile.gridPosition[1]], placementDirection: spaceDetails.exploreDirection}
        }
        if (spaceDetails.exploreDirection === "right") {
          const tileExists = room.tiles.find((tile: any) => tile.gridPosition[0] === currentTile.gridPosition[0] + 1 && tile.gridPosition[1] === currentTile.gridPosition[1])
          if (tileExists) return
          return {gridPosition: [currentTile.gridPosition[0] + 1, currentTile.gridPosition[1]], placementDirection: spaceDetails.exploreDirection}
        }
      }
    }
  }


  const highlightNewTileArea = () => {
    const placeholderTiles = [...availableArea];

    const highlightAreas = Object.values(room.pawns).map((pawn: any) => {
      return getExplorationTile(pawn, pawn.position[0], pawn.position[1]) 
    }).filter(gridPos => gridPos) as TileInterface[]

    // MIGHT NEED TO RETURN MORE NEW AREAS
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
        nodeRef={draggableNodeRef}
        defaultPosition={{x: 0, y: 0}}
        >
        <div ref={draggableNodeRef} className="playable-area">
          {availableArea.length > 0 && availableArea.map((newTileArea, i) => {
            return (
              <NewTileArea key={i} tile={newTileArea} clearHighlightAreas={clearHighlightAreas} />
            )
          })}
          {room?.tiles?.length > 0 && room?.tiles?.map((newTile: any, tileIndex: number) => {
            return (
              <Tile key={tileIndex} tileIndex={tileIndex}/>
            )
          })}
          <Pawn color="yellow" />
          <Pawn color="orange"/>
          <Pawn color="green"/>
          <Pawn color="purple"/>
        </div>
      </Draggable>
      <PlayerArea highlightNewTileArea={highlightNewTileArea}/>
    </div>
  )
}

export default Board;
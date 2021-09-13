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

const Board = () => {

  const { tilesState, tilesDispatch } = useTiles();
  
  useEffect(() => {
    tilesDispatch({type: "initTile", value: tile1a as TileInterface})
  }, [])

  const { pawnState, pawnDispatch } = usePawn();
  const { yellow, green, purple, orange } = pawnState;


  const [availableArea, setAvailableArea] = useState<TileInterface[]>([]);

  const highlightNewTileArea = () => {
    // check if pawns on explore space
    // if pawn position on explore space
    // check pawn tile position
    const highlightAreas = [[8, 7], [9, 8], [8, 9], [7, 8]]
    const tiles: TileInterface[] = [
      {id: "4", gridPosition: [8,7], placementDirection: 'up'},
      {id: "7", gridPosition: [9,8], placementDirection: 'right'},
      {id: "6", gridPosition: [8,9], placementDirection: 'down'},
      {id: "5", gridPosition: [7,8], placementDirection: 'left'}
    ]

    // highlight area
    setAvailableArea(tiles);
  }

  const clearHighlightAreas = () => {
    setAvailableArea([]);
  }

  return (
    <div className="Board">
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
      <PlayerArea highlightNewTileArea={highlightNewTileArea}/>
    </div>
  )
}

export default Board;
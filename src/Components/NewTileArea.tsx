import React, { MouseEvent, useState } from 'react';
import { TileInterface, direction } from '../types';
import { tileWallSize, spaceSize } from '../constants';
import { tile4 } from '../Data/tile4';
import { tile5 } from '../Data/tile5';
import { useTiles } from '../Contexts/TilesContext';

interface NewTileAreaProps {
  tile: TileInterface,
  clearHighlightAreas: () => void,
}

const NewTileArea = ({tile, clearHighlightAreas}: NewTileAreaProps) => {
  const { gridPosition, placementDirection } = tile;

  const { tilesState, tilesDispatch } = useTiles();

  const addNewTile = (newTile: TileInterface) => {
    tilesDispatch({type: "addTile", value: newTile})
  }

  const placeNewTile = (e: MouseEvent<HTMLDivElement>) => {
    if (placementDirection) {
      addNewTile({gridPosition, placementDirection} as TileInterface);
    }
    // clearHighlightAreas();
  }

  const getDisplacementValue = (positionValue: number) => {
    console.log(positionValue);
    return tileWallSize - ((Math.abs(8 - positionValue) * 2) * spaceSize)
  }

  return (
    <div className={`tile new-tile-area ${placementDirection ? placementDirection : "placeholder"}`}
      onClick={(e) => placeNewTile(e)}
      style={
        {
          gridColumnStart: gridPosition[0], 
          gridRowStart: gridPosition[1],
          marginTop: gridPosition[0] < 8 ? getDisplacementValue(gridPosition[0]) : tileWallSize,
          marginBottom: gridPosition[0] > 8 ? getDisplacementValue(gridPosition[0]) : tileWallSize,
          marginLeft: gridPosition[1] > 8 ? getDisplacementValue(gridPosition[1]) : tileWallSize,
          marginRight: gridPosition[1] < 8 ? getDisplacementValue(gridPosition[1]) : tileWallSize,
          placeSelf: "center"
        }
      }>
    </div>
  )
}

export default NewTileArea;
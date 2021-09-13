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
    let entryDirection;

    switch (placementDirection) {
      case "right":
        entryDirection = "left";
        break;
      case "left":
        entryDirection = "right";
        break;
      // case "up":
      //   entryDirection = "down";
      //   break;
      // case "down":
      //   entryDirection = "up";
      //   break;
      default:
        entryDirection = placementDirection
        break;
    }

    addNewTile({id: tile.id, gridPosition, placementDirection} as TileInterface);
    clearHighlightAreas();
  }

  return (
    <div className={`tile new-tile-area ${placementDirection}`}
      onClick={(e) => placeNewTile(e)}
      style={
        {
          gridColumnStart: gridPosition[0], 
          gridRowStart: gridPosition[1],
          marginTop: placementDirection && placementDirection === "left" ? (tileWallSize - (1 * spaceSize)) : tileWallSize,
          marginBottom: placementDirection && placementDirection === "right" ? (tileWallSize - (1 * spaceSize)) : tileWallSize,
          alignSelf: placementDirection && placementDirection === "right" ? "end" : "auto",
          marginLeft: placementDirection && placementDirection === "down" ? (tileWallSize - (1 * spaceSize)) : tileWallSize,
          marginRight: placementDirection && placementDirection === "up" ? (tileWallSize - (1 * spaceSize)) : tileWallSize,
          justifySelf: placementDirection && placementDirection === "up" ? "end" : "baseline"
        }
      }>
    </div>
  )
}

export default NewTileArea;
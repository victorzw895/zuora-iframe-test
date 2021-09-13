import React, { useEffect, useState, useMemo, useLayoutEffect } from 'react';
import Space from './Space';
import { direction, HeroPawn, TileInterface, Space as SpaceType } from '../types';
import { tileWallSize, spaceSize } from '../constants';
import { usePawn } from '../Contexts/PawnContext';
import { usePlayer } from '../Contexts/PlayerContext';
import { useTiles } from '../Contexts/TilesContext';

const TileFactory = (id: number) => {
  return {
    id,
    width: 225,
    height: 225,
  }
}

interface tileProps {
  startTile?: boolean | undefined,
  id?: string,
  tileData: TileInterface,
}

const Tile = ({startTile, id, tileData}: tileProps) => {
  const [showMovableDirections, setShowMovableDirections] = useState<direction[]>([]);

  const { playerState, playerDispatch } = usePlayer();
  const { pawnState, pawnDispatch } = usePawn();
  const { tilesState, tilesDispatch } = useTiles();
  const { yellow, green, purple, orange } = pawnState;

  // const test = (direction: direction) => {
  //   let same
  //   let diff
  //   let diffValue

  //   // for Tile
  //   switch (direction) {
  //     case "up":
  //       same = "col";
  //       diff = "row";
  //       diffValue = "+1"
  //       break;
  //     case "right":
  //       same = "row";
  //       diff = "col";
  //       diffValue = "-1"
  //       break;
  //     case "down":
  //       same = "col";
  //       diff = "row";
  //       diffValue = "-1"
  //       break;
  //     case "left":
  //       same = "row";
  //       diff = "col";
  //       diffValue = "+1"
  //       break;
  //     default:
  //       break;
  //   }
  // }

  const directionPositionValue = {
    "up": -1,
    "right": 1,
    "down": 1,
    "left": -1
  }

  const getExtraDirectionalSpaces = (tileFound: TileInterface, pawn: HeroPawn, direction: direction) => {
    let extraSpaces;
    if (direction === "up" || direction === "down") {
      extraSpaces = tileFound.spaces?.map((row) => row.filter((col, colIndex) => colIndex === pawn.position[0] + directionPositionValue[direction])).flat(1)
    }
    else if (direction === "left" || direction === "right") {
      extraSpaces = tileFound.spaces?.filter((row, rowIndex) => rowIndex === pawn.position[1] - directionPositionValue[direction]).flat(1)
    }
    return extraSpaces
  }


  const findDirectionAdjacentTile = (pawn: HeroPawn, alignmentPositionConstant: "row" | "col", direction: direction) => {
    const positionConstantValue = alignmentPositionConstant === "col" ? 0 : 1;
    const positionVariantValue = alignmentPositionConstant === "col" ? 1 : 0;
    if (tilesState.length > 1) {
      const tileFound = tilesState.find(tile => 
        tile.gridPosition[positionConstantValue] === pawn.gridPosition[positionConstantValue] &&
        tile.gridPosition[positionVariantValue] - directionPositionValue[direction] === pawn.gridPosition[positionVariantValue]
      )
      return tileFound
    }
    return;
  }

  const filterRowsOfTargetDirection = (currentTile: TileInterface, pawn: HeroPawn, direction: direction) => {
    let remainingRows

    if (direction === "left" || direction === "right") {
      remainingRows = currentTile.spaces?.filter((row, rowIndex) => rowIndex === pawn.position[1])
    }
    else if (direction === "up") {
      remainingRows = currentTile.spaces?.filter((row, rowIndex) => rowIndex < pawn.position[1])
    }
    else if (direction === "down") {
      remainingRows = currentTile.spaces?.filter((row, rowIndex) => rowIndex > pawn.position[1])
    }
    
    if (remainingRows) {
      return remainingRows;
    }
  }

  const filterSpacesFromRows = (rows: SpaceType[][], pawn: HeroPawn, direction: direction) => {
    if (!rows) return;

    let remainingSpaces

    if (direction === "up" || direction === "down") {
      remainingSpaces = rows.map((row, rowIndex) => row.filter((col, colIndex) => colIndex === pawn.position[0]))
    }
    else if (direction === "right") {
      remainingSpaces = rows.map((row, rowIndex) => row.filter((col, colIndex) => colIndex > pawn.position[0]))
    }
    else if (direction === "left") {
      remainingSpaces = rows.map((row, rowIndex) => row.filter((col, colIndex) => colIndex < pawn.position[0]))
    }
    
    if (remainingSpaces) {
      return remainingSpaces.flat(1);
    }
  }

  const getAllDirectionalSpaces = (pawn: HeroPawn, direction: direction) => {
    const directionalSpaces = [];
    const currentTile = tilesState.find(tile => tile.gridPosition[0] === pawn.gridPosition[0] && tile.gridPosition[1] === pawn.gridPosition[1]);
    const rows = filterRowsOfTargetDirection(currentTile!, pawn, direction) || [];
    const spaces = filterSpacesFromRows(rows, pawn, direction) || [];

    let adjacentTileFound;
    let extraSpaces = [];
    
    if (
      (direction === "up" && pawn.position[0] === 2) ||
      (direction === "down" && pawn.position[0] === 1)
    ) {
      adjacentTileFound = findDirectionAdjacentTile(pawn, "col", direction);
    }
    else if (
      (direction === "left" && pawn.position[1] === 1) ||
      (direction === "right" && pawn.position[1] === 2)
    ) {
      adjacentTileFound = findDirectionAdjacentTile(pawn, "row", direction);
    }

    if (adjacentTileFound) {
      extraSpaces.push(...getExtraDirectionalSpaces(adjacentTileFound, pawn, direction) || []);
    }


    if (direction === "right" || direction === "down") {
      directionalSpaces.push(...spaces, ...extraSpaces);
    }
    else if (direction === "up" || direction === "left") {
      directionalSpaces.push(...extraSpaces, ...spaces);
    }
    console.log("directionalSpaces", direction, directionalSpaces)
    return directionalSpaces;
  }

  const isSpaceOccupied = (tileGridPosition: number[], colIndex: number, rowIndex: number) => {
    return Object.entries(pawnState).some(([color, pawn]) => {
      if (pawn.gridPosition[0] !== tileGridPosition[0] || pawn.gridPosition[1] !== tileGridPosition[1]) {
        return false;
      }
      return pawn.position[0] === colIndex && pawn.position[1] === rowIndex;
    })
  }


  const getFirstBlockedSpace = (pawn: HeroPawn, direction: direction) => {
    const pawnPosition = pawn.position;
    const startCol = pawnPosition[0];
    const startRow = pawnPosition[1];

    const allSpaces = getAllDirectionalSpaces(pawn, direction);

    let firstBlockedSpacePosition;
    let blockedSpaceGridPosition

    if (direction === "up") {
      for (let i = allSpaces.length - 1; i >= 0; i--) {
        const rowIndex = i <= 3 ? i : i - 4;
        // const colStart = pawn.position[0] - 1;
        // const colIndex = i < colStart ? Math.abs(i - colStart) : i - colStart;
        // const colIndex = i <= 3 ? i : i - 4;
        // if (allSpaces.length - i >= 1) {
        const rowStart = pawn.position[1] - 1;
        if (i <= 3) {
          if (allSpaces[i].details?.sideWalls?.includes("down") || allSpaces[i].type === "barrier") {
            firstBlockedSpacePosition = [pawn.position[0] - 1, rowIndex]
            blockedSpaceGridPosition = [pawn.gridPosition[0], pawn.gridPosition[1] - 1];
            break;
          }
          else if (isSpaceOccupied([8, 7], rowIndex, pawn.position[1])) {
            firstBlockedSpacePosition = [pawn.position[0] - 1, rowIndex]
            blockedSpaceGridPosition = [pawn.gridPosition[0], pawn.gridPosition[1] - 1];
            break;
          }
        }
        else if (allSpaces[i].details?.sideWalls?.includes("down") || allSpaces[i].type === "barrier") {
          firstBlockedSpacePosition = [pawn.position[0], rowIndex];
          break;
        }
        else if (isSpaceOccupied(pawn.gridPosition, pawn.position[0], rowIndex)) {
          firstBlockedSpacePosition = [pawn.position[0], rowIndex]
          break;
        }
      }
    }
    else if (direction === "right") {
      for (let i = 0; i <= allSpaces.length - 1; i++) {
        const colStart = pawn.position[0] + 1;
        // const colIndex = i + colStart <= 3 ? i + colStart : i - (3 - colStart);
        const colIndex = i < allSpaces.length - 4 ? i + colStart : i - (allSpaces.length - 4);
        // const colIndex = i <= 3 ? i : i - 4
        // const colIndex = i < allSpaces.length - 4 ? i + colStart : i - colStart
        // if (i <= 3) {
        if (i >= allSpaces.length - 4) {
          if (allSpaces[i].details?.sideWalls?.includes("left") || allSpaces[i].type === "barrier") {
            firstBlockedSpacePosition = [colIndex, pawn.position[1] - 1]
            blockedSpaceGridPosition = [pawn.gridPosition[0] + 1, pawn.gridPosition[1]];
            break;
          }
          else if (isSpaceOccupied([9, 8], colIndex, pawn.position[1])) {
            firstBlockedSpacePosition = [colIndex, pawn.position[1] - 1]
            blockedSpaceGridPosition = [pawn.gridPosition[0] + 1, pawn.gridPosition[1]];
            break;
          }
        }
        else if (allSpaces[i].details?.sideWalls?.includes("left") || allSpaces[i].type === "barrier") {
          firstBlockedSpacePosition = [colIndex, pawn.position[1]]
          break;
        }
        else if (isSpaceOccupied(pawn.gridPosition, colIndex, pawn.position[1])) {
          firstBlockedSpacePosition = [colIndex, pawn.position[1]]
          break;
        }
      }
    }
    else if (direction === "down") {
      for (let i = 0; i <= allSpaces.length - 1; i++) {
        const rowStart = pawn.position[1] + 1;
        // const rowIndex = i + rowStart <= 3 ? i + rowStart : i - (3 - rowStart);
        const rowIndex = i < allSpaces.length - 4 ? i + rowStart : i - (allSpaces.length - 4);
        // const colIndex = i < allSpaces.length - 4 ? i + colStart : i - (allSpaces.length - 4);
        if (i >= allSpaces.length - 4) {
          if (allSpaces[i].details?.sideWalls?.includes("up") || allSpaces[i].type === "barrier") {
            firstBlockedSpacePosition = [pawn.position[0] + 1, rowIndex]
            blockedSpaceGridPosition = [pawn.gridPosition[0], pawn.gridPosition[1] + 1];
            break;
          }
          else if (isSpaceOccupied([7, 8], rowIndex, pawn.position[1])) {
            firstBlockedSpacePosition = [pawn.position[0] + 1, rowIndex]
            blockedSpaceGridPosition = [pawn.gridPosition[0], pawn.gridPosition[1] + 1];
            break;
          }
        }
        else if (allSpaces[i].details?.sideWalls?.includes("up") || allSpaces[i].type === "barrier") {
          firstBlockedSpacePosition = [pawn.position[0], rowIndex]
          break;
        }
        else if (isSpaceOccupied(pawn.gridPosition, pawn.position[0], rowIndex)) {
          firstBlockedSpacePosition = [pawn.position[0], rowIndex]
          break;
        }
      }
    }
    else if (direction === "left") {
      for (let i = allSpaces.length - 1; i >= 0; i--) {
        const colStart = pawn.position[0] - 1;
        // const colIndex = i < colStart ? Math.abs(i - colStart) : i - colStart;
        const colIndex = i <= 3 ? i : i - 4;
        if (i <= 3) {
          if (allSpaces[i].details?.sideWalls?.includes("right") || allSpaces[i].type === "barrier") {
            firstBlockedSpacePosition = [colIndex, pawn.position[1] + 1]
            blockedSpaceGridPosition = [pawn.gridPosition[0] - 1, pawn.gridPosition[1]];
            break;
          }
          else if (isSpaceOccupied([7, 8], colIndex, pawn.position[1])) {
            firstBlockedSpacePosition = [colIndex, pawn.position[1] + 1]
            blockedSpaceGridPosition = [pawn.gridPosition[0] - 1, pawn.gridPosition[1]];
            break;
          }
        }
        else if (allSpaces[i].details?.sideWalls?.includes("right") || allSpaces[i].type === "barrier") {
          firstBlockedSpacePosition = [colIndex, pawn.position[1]]
          break;
        }
        else if (isSpaceOccupied(pawn.gridPosition, colIndex, pawn.position[1])) {
          firstBlockedSpacePosition = [colIndex, pawn.position[1]]
          break;
        }
      }
    }

    const firstBlocked = {
      position: firstBlockedSpacePosition,
      gridPosition: blockedSpaceGridPosition
    }

    console.log("first Blocked" , firstBlocked)
    console.log("direction blocked space", direction, firstBlockedSpacePosition)

    return firstBlockedSpacePosition;
  }

  useLayoutEffect(() => {
    if (yellow.playerHeld) {
      if (tileData.gridPosition[0] === yellow.gridPosition[0] && tileData.gridPosition[1] === yellow.gridPosition[1]) {
        // get pawn position
        const pawnPosition = yellow.position;
        const playerDirections = playerState.playerDirections;
        // get player direction
        // showArea for spaces in player direction from pawn position

        const blockedDirections = {
          up: getFirstBlockedSpace(yellow, "up"),
          right: getFirstBlockedSpace(yellow, "right"),
          left: getFirstBlockedSpace(yellow, "left"),
          down: getFirstBlockedSpace(yellow, "down"),
        }

        pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color: "yellow"})
        setShowMovableDirections(playerDirections);
      }
    }
  }, [yellow.playerHeld])

  useLayoutEffect(() => {
    if (orange.playerHeld) {
      if (tileData.gridPosition[0] === orange.gridPosition[0] && tileData.gridPosition[1] === orange.gridPosition[1]) {
        // get pawn position
        const pawnPosition = orange.position;
        const playerDirections = playerState.playerDirections;
        // get player direction
        // showArea for spaces in player direction from pawn position

        const blockedDirections = {
          up: getFirstBlockedSpace(orange, "up"),
          right: getFirstBlockedSpace(orange, "right"),
          left: getFirstBlockedSpace(orange, "left"),
          down: getFirstBlockedSpace(orange, "down"),
        }

        pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color: "orange"})
        setShowMovableDirections(playerDirections);
      }
    }

  }, [orange.playerHeld])

  useLayoutEffect(() => {
    if (green.playerHeld) {
      if (tileData.gridPosition[0] === green.gridPosition[0] && tileData.gridPosition[1] === green.gridPosition[1]) {
        // get pawn position
        const pawnPosition = green.position;
        const playerDirections = playerState.playerDirections;
        // get player direction
        // showArea for spaces in player direction from pawn position

        const blockedDirections = {
          up: getFirstBlockedSpace(green, "up"),
          right: getFirstBlockedSpace(green, "right"),
          left: getFirstBlockedSpace(green, "left"),
          down: getFirstBlockedSpace(green, "down"),
        }

        pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color: "green"})
        setShowMovableDirections(playerDirections);
      }
    }
  }, [green.playerHeld])

  useLayoutEffect(() => {
    if (purple.playerHeld) {
      if (tileData.gridPosition[0] === purple.gridPosition[0] && tileData.gridPosition[1] === purple.gridPosition[1]) {
        // get pawn position
        const pawnPosition = purple.position;
        // get player direction from live player session? firebase?
        const playerDirections = playerState.playerDirections;
        // get player direction
        // showArea for spaces in player direction from pawn position
        const blockedDirections = {
          up: getFirstBlockedSpace(purple, "up"),
          right: getFirstBlockedSpace(purple, "right"),
          left: getFirstBlockedSpace(purple, "left"),
          down: getFirstBlockedSpace(purple, "down"),
        }

        pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color: "purple"})

        setShowMovableDirections(playerDirections);
      }
    }
  }, [purple.playerHeld])

  let colBlocked = false;
  
  return (
    <div className={`tile ${id === '1a' ? "start-tile" : ""}`} 
      style={
        {
          gridColumnStart: tileData.gridPosition[0],
          gridRowStart: tileData.gridPosition[1],
          marginTop: tileData.placementDirection && tileData.placementDirection === "left" ? (tileWallSize - (1 * spaceSize)) : tileWallSize,
          marginBottom: tileData.placementDirection && tileData.placementDirection === "right" ? (tileWallSize - (1 * spaceSize)) : tileWallSize,
          alignSelf: tileData.placementDirection && tileData.placementDirection === "right" ? "end" : "auto",
          marginLeft: tileData.placementDirection && tileData.placementDirection === "down" ? (tileWallSize - (1 * spaceSize)) : tileWallSize,
          marginRight: tileData.placementDirection && tileData.placementDirection === "up" ? (tileWallSize - (1 * spaceSize)) : tileWallSize,
          transform: `rotate(${tileData.rotation}deg)`,
          justifySelf: tileData.placementDirection && tileData.placementDirection === "up" ? "end" : "baseline"
        }
      }>
      {tileData.spaces && tileData.spaces.map((row, rowIndex) => {
        let rowBlocked = false;
        return (
          <div className="row" key={`row${rowIndex}`}>
            {row.map((space, colIndex) => {
              let highlightSpace = false;
              let colorHeld: HeroPawn | undefined;

              if (yellow.playerHeld) colorHeld = yellow;
              if (orange.playerHeld) colorHeld = orange;
              if (green.playerHeld) colorHeld = green;
              if (purple.playerHeld) colorHeld = purple;

              if (colorHeld) {
                if (showMovableDirections.includes("right")) {
                  if (colorHeld.position[1] === rowIndex && colIndex > colorHeld.position[0]) {
                    if (colorHeld.blockedPositions.right && colorHeld.blockedPositions.right.length) {
                      if (colIndex < colorHeld.blockedPositions.right[0]) {
                        rowBlocked = false;
                      }
                      else if (colIndex >= colorHeld.blockedPositions.right[0]) {
                        rowBlocked = true;
                      }
                    }
                    else {
                      rowBlocked = false;
                    }
                    highlightSpace = !rowBlocked;
                  }
                }
                if (showMovableDirections.includes("left")) {
                  if (colorHeld.position[1] === rowIndex && colIndex < colorHeld.position[0]) {
                    if (colorHeld.blockedPositions.left && colorHeld.blockedPositions.left.length) {
                      if (colIndex <= colorHeld.blockedPositions.left[0]) {
                        rowBlocked = true;
                      }
                      else if (colIndex > colorHeld.blockedPositions.left[0]) {
                        rowBlocked = false;
                      }
                    }
                    highlightSpace = !rowBlocked;
                  }
                }
                if (showMovableDirections.includes("down") && !colBlocked) {
                  if (colorHeld.position[0] === colIndex && rowIndex > colorHeld.position[1]) {
                    if (colorHeld.blockedPositions.down && colorHeld.blockedPositions.down.length) {
                      if (rowIndex < colorHeld.blockedPositions.down[1]) {
                        rowBlocked = false;
                      }
                      else if (rowIndex >= colorHeld.blockedPositions.down[1]) {
                        rowBlocked = true;
                      }
                    }
                    else {
                      rowBlocked = false;
                    }
                    highlightSpace = !rowBlocked;
                  }
                }
                if (showMovableDirections.includes("up") && !colBlocked) {
                  if (colorHeld.position[0] === colIndex && rowIndex < colorHeld.position[1]) {
                    if (colorHeld.blockedPositions.up && colorHeld.blockedPositions.up.length) {
                      if (rowIndex <= colorHeld.blockedPositions.up[1]) {
                        rowBlocked = true;
                      }
                      else if (rowIndex > colorHeld.blockedPositions.up[1]) {
                        rowBlocked = false;
                      }
                    }
                    highlightSpace = !rowBlocked;
                  }
                }
              }

              // HERE need to check how far to show Area
                  // stop if walls, or pawns
              // HERE need to continue to other tiles

              return (
                <Space 
                  key={`space${rowIndex}-${colIndex}`} 
                  spaceData={space} 
                  showMovableArea={highlightSpace} 
                  colorSelected={colorHeld ? colorHeld.color : null}
                  spacePosition={[colIndex, rowIndex]} 
                />
              )
            })}
          </div>
        )
      })}
      <img src={`/${tileData.id}.jpg`} alt={`tile-${tileData.id}`}></img>
    </div>
  )
}

export default Tile;
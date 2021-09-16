import React, { useEffect, useState, useMemo, useLayoutEffect } from 'react';
import Space from './Space';
import { direction, HeroPawn, TileInterface, Space as SpaceType } from '../types';
import { tileWallSize, spaceSize } from '../constants';
import { usePawn } from '../Contexts/PawnContext';
import { usePlayer } from '../Contexts/PlayerContext';
import { useTiles } from '../Contexts/TilesContext';
import { cp } from 'fs';

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
      directionalSpaces.push(...spaces.reverse(), ...extraSpaces.reverse());
    }
    // console.log("directionalSpaces", direction, directionalSpaces)
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
    let blockedSpaceGridPosition;

    const spacesInCurrentTile = allSpaces.length < 4 ? allSpaces.length : allSpaces.length - 4;
    
    let startIndexAlignment = 0;
    let changeInRow = false;
    let readArrayBackwards = false;
    let wallDirection: direction = "up"

    if (direction === "up") {
      startIndexAlignment = startRow - 1;
      readArrayBackwards = true;
      changeInRow = true;
      wallDirection = "down"
    }
    else if (direction === "down") {
      startIndexAlignment = startRow + 1;
      changeInRow = true;
      wallDirection = "up"
    }
    else if (direction === "right") {
      startIndexAlignment = startCol + 1;
      wallDirection = "left"
    }
    else if (direction === "left") {
      startIndexAlignment = startCol - 1;
      readArrayBackwards = true;
      wallDirection = "right"
    }

    for (let i = 0; i <= allSpaces.length - 1; i++) {
      const indexInCurrentTile = readArrayBackwards ? startIndexAlignment - i : startIndexAlignment + i;
      const indexInAdjacentTile = readArrayBackwards ? allSpaces.length - 1 - i : i - spacesInCurrentTile;

      const changeIndex = i < spacesInCurrentTile ? indexInCurrentTile : indexInAdjacentTile; // col for left
      let colIndex = changeInRow ? pawn.position[0] : changeIndex;
      let rowIndex = changeInRow ? changeIndex : pawn.position[1];

      let gridChangeIndex = 0 // 0 option for current tile
      let gridColIndex = pawn.gridPosition[0];
      let gridRowIndex = pawn.gridPosition[1];

      if (i >= spacesInCurrentTile) {
        gridChangeIndex = readArrayBackwards ? -1 : 1;        
        if (changeInRow) {
          colIndex = colIndex + gridChangeIndex;
          gridRowIndex = pawn.gridPosition[1] + gridChangeIndex;
        }
        else {
          rowIndex = rowIndex - gridChangeIndex;
          gridColIndex = pawn.gridPosition[0] + gridChangeIndex;
        }
      }
      
      if (allSpaces[i].details?.sideWalls?.includes(wallDirection) || allSpaces[i].type === "barrier") {
        firstBlockedSpacePosition = [colIndex , rowIndex];
        blockedSpaceGridPosition = [gridColIndex, gridRowIndex];
        break;
      }
      else if (isSpaceOccupied([gridColIndex, gridRowIndex], colIndex, rowIndex)) { // NOTE colIndex and rowIndex need to change
        firstBlockedSpacePosition = [colIndex, rowIndex];
        blockedSpaceGridPosition = [gridColIndex, gridRowIndex];
        break;
      }
    }

    const firstBlocked = {
      position: firstBlockedSpacePosition,
      gridPosition: blockedSpaceGridPosition
    }

    if (pawn.color === "green" && direction === "down") {
      console.log("here", pawn.gridPosition, firstBlocked)
    }

    return firstBlocked;
  }

  useLayoutEffect(() => {
    if (yellow.playerHeld) {
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
  }, [yellow.playerHeld])

  useLayoutEffect(() => {
    if (orange.playerHeld) {
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

  }, [orange.playerHeld])

  useLayoutEffect(() => {
    if (green.playerHeld) {
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
  }, [green.playerHeld])

  useLayoutEffect(() => {
    if (purple.playerHeld) {
      // get pawn position
      const pawnPosition = purple.position;
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
  }, [purple.playerHeld])

  const tileHasBlockedSpace = (tileData: TileInterface, direction: direction, pawnHeld: HeroPawn) => {
    if (showMovableDirections.includes(direction)) {
      if (pawnHeld.blockedPositions[direction].gridPosition && pawnHeld.blockedPositions[direction].position) {
        if (tileData.gridPosition[0] === pawnHeld.blockedPositions[direction].gridPosition![0] &&
            tileData.gridPosition[1] === pawnHeld.blockedPositions[direction].gridPosition![1]) {
              return true;
            }
      }
    }
    return false;
  }

  const getDisplacementValue = (positionValue: number) => {
    return tileWallSize - ((Math.abs(8 - positionValue) * 2) * spaceSize)
  }

  
  return (
    <div className={`tile ${id === '1a' ? "start-tile" : ""}`} 
      style={
        {
          gridColumnStart: tileData.gridPosition[0],
          gridRowStart: tileData.gridPosition[1],
          marginTop: tileData.gridPosition[0] < 8 ? getDisplacementValue(tileData.gridPosition[0]) : tileWallSize,
          marginBottom: tileData.gridPosition[0] > 8 ? getDisplacementValue(tileData.gridPosition[0]) : tileWallSize,
          marginLeft: tileData.gridPosition[1] > 8 ? getDisplacementValue(tileData.gridPosition[1]) : tileWallSize,
          marginRight: tileData.gridPosition[1] < 8 ? getDisplacementValue(tileData.gridPosition[1]) : tileWallSize,
          placeSelf: "center"
        }
      }>
      {tileData.spaces && tileData.spaces.map((row, rowIndex) => {
        // let rowBlocked = true;
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
                if (tileData.gridPosition[0] !== colorHeld.gridPosition[0] || tileData.gridPosition[1] !== colorHeld.gridPosition[1]) {
                  let rowBlocked = true;
                  
                  if (tileData.gridPosition[0] === colorHeld.gridPosition[0] && 
                    tileData.gridPosition[1] === colorHeld.gridPosition[1] - 1) {
                    if (tileHasBlockedSpace(tileData, "up", colorHeld)) {
                      if (colIndex === colorHeld.blockedPositions.up.position![0]) {
                        if (rowIndex <= colorHeld.blockedPositions.up.position![1]) {
                          rowBlocked = true;
                        }
                        else if (rowIndex > colorHeld.blockedPositions.up.position![1]) {
                          rowBlocked = false;
                        }
                      }
                    }
                    else {
                      if (colIndex === colorHeld.position[0] - 1 && colorHeld.position[0] === 2) {
                        if (!colorHeld.blockedPositions.up.gridPosition) {
                          rowBlocked = false;
                        }
                      }
                    }
                  // else if (tileData.gridPosition[0] === colorHeld.gridPosition[0] && 
                  //           tileData.gridPosition[1] === colorHeld.gridPosition[1] - 1) {
                  //             // if no blocked
                  //             if (colIndex === colorHeld.position[0] - 1 && colorHeld.position[0] === 2) {
                  //               if (!colorHeld.blockedPositions.down.gridPosition) {
                  //                 if (!isSpaceOccupied(tileData.gridPosition, colIndex, rowIndex)) {
                  //                   rowBlocked = false;
                  //                   if (colorHeld.color === "yellow") {
                  //                     console.log("hersjflkds", tileData.gridPosition, colIndex, rowIndex, rowBlocked)
                  //                   }
                  //                 }
                  //               }
                  //             }
                  //             // else rowBlocked = true
                            }
                  if (tileHasBlockedSpace(tileData, "left", colorHeld)) {
                    if (rowIndex === colorHeld.blockedPositions.left.position![1]) {
                      if (colIndex <= colorHeld.blockedPositions.left.position![0]) {
                        rowBlocked = true;
                      }
                      else if (colIndex > colorHeld.blockedPositions.left.position![0]) {
                        rowBlocked = false;
                      }
                    }
                  }
                  else if (tileData.gridPosition[0] === colorHeld.gridPosition[0] + 1 && 
                          tileData.gridPosition[1] === colorHeld.gridPosition[1]) {
                            // // if no blocked
                            if (rowIndex === colorHeld.position[1] - 1 && colorHeld.position[1] === 2) {
                              if (!colorHeld.blockedPositions.right.gridPosition) {
                                if (!isSpaceOccupied(tileData.gridPosition, colIndex, rowIndex)) {
                                  rowBlocked = false;
                                }
                              }
                            }

                            // if (!colorHeld.blockedPositions.right.gridPosition) {
                              
                            //   if (!colorHeld.blockedPositions.left.gridPosition) {
                            //     if (rowIndex === colorHeld.position[1] - 1 && colorHeld.position[1] === 2) {
                            //       if (!isSpaceOccupied(tileData.gridPosition, colIndex, rowIndex)) {
                            //         rowBlocked = false;
                            //       }
                            //     }
                            //   }
                            //   else if (rowIndex === colorHeld.position[1] - 1 && colorHeld.position[1] === 2) {
                            //     if (!isSpaceOccupied(tileData.gridPosition, colIndex, rowIndex)) {
                            //       rowBlocked = false;
                            //     }
                            //   }
                            // }
                            // else rowBlocked = true
                          }
                  
                  if (tileHasBlockedSpace(tileData, "right", colorHeld)) {
                    if (rowIndex === colorHeld.blockedPositions.right.position![1]) {
                      if (colIndex >= colorHeld.blockedPositions.right.position![0]) {
                        rowBlocked = true;
                      }
                      else if (colIndex < colorHeld.blockedPositions.right.position![0]) {
                        rowBlocked = false;
                      }
                    }
                  }
                  else if (tileData.gridPosition[0] === colorHeld.gridPosition[0] - 1 && 
                          tileData.gridPosition[1] === colorHeld.gridPosition[1]) {
                            if (rowIndex === colorHeld.position[1] + 1 && colorHeld.position[1] === 1) {
                              if (!colorHeld.blockedPositions.left.gridPosition) {
                                if (!isSpaceOccupied(tileData.gridPosition, colIndex, rowIndex)) {
                                  rowBlocked = false;
                                }
                              }
                            }
                          }

                  if (tileHasBlockedSpace(tileData, "down", colorHeld)) {
                    if (colIndex === colorHeld.blockedPositions.down.position![0]) {
                      if (rowIndex >= colorHeld.blockedPositions.down.position![1]) {
                        rowBlocked = true;
                      }
                      else if (rowIndex < colorHeld.blockedPositions.down.position![1]) {
                        rowBlocked = false;
                      }
                    }
                  }
                  else if (tileData.gridPosition[0] === colorHeld.gridPosition[0] && 
                          tileData.gridPosition[1] === colorHeld.gridPosition[1] + 1) {
                            if (colIndex === colorHeld.position[0] + 1 && colorHeld.position[0] === 1) {
                              if (!colorHeld.blockedPositions.up.gridPosition) {
                                if (!isSpaceOccupied(tileData.gridPosition, colIndex, rowIndex)) {
                                  rowBlocked = false;
                                }
                              }
                            }
                          }

                  

                  highlightSpace = !rowBlocked
                }
                else if (tileData.gridPosition[0] === colorHeld.gridPosition[0] && tileData.gridPosition[1] === colorHeld.gridPosition[1]) {
                  let rowBlocked = true;
                  
                  // column directly above from pawn (up movement)
                  if (rowIndex < colorHeld.position[1] && colIndex === colorHeld.position[0]) {
                    if (tileHasBlockedSpace(tileData, "up", colorHeld)) {
                      if (colIndex === colorHeld.blockedPositions.up.position![0]) {
                        if (rowIndex <= colorHeld.blockedPositions.up.position![1]) {
                          rowBlocked = true;
                        }
                        else if (rowIndex > colorHeld.blockedPositions.up.position![1]) {
                          rowBlocked = false;
                        }
                      }
                    }
                    else {
                      rowBlocked = false;
                    }
                  }
                  else if (colIndex < colorHeld.position[0] && rowIndex === colorHeld.position[1]) {
                    if (tileHasBlockedSpace(tileData, "left", colorHeld)) {
                      if (rowIndex === colorHeld.blockedPositions.left.position![1]) {
                        if (colIndex <= colorHeld.blockedPositions.left.position![0]) {
                          rowBlocked = true;
                        }
                        else if (colIndex > colorHeld.blockedPositions.left.position![0]) {
                          
                          rowBlocked = false;
                        }
                      }
                    }
                    else {
                      
                      rowBlocked = false;
                    }
                  }
                  else if (colIndex > colorHeld.position[0] && rowIndex === colorHeld.position[1]) {
                    if (tileHasBlockedSpace(tileData, "right", colorHeld)) {
                      if (rowIndex === colorHeld.blockedPositions.right.position![1]) {
                        if (colIndex >= colorHeld.blockedPositions.right.position![0]) {
                          rowBlocked = true;
                        }
                        else if (colIndex < colorHeld.blockedPositions.right.position![0]) {
                          rowBlocked = false;
                        }
                      }
                    }
                    else {
                      rowBlocked = false;
                    }
                  }
                  else if (rowIndex > colorHeld.position[1] && colIndex === colorHeld.position[0]) {
                    if (tileHasBlockedSpace(tileData, "down", colorHeld)) {
                      if (colIndex === colorHeld.blockedPositions.down.position![0]) {
                        if (rowIndex >= colorHeld.blockedPositions.down.position![1]) {
                          rowBlocked = true;
                        }
                        else if (rowIndex < colorHeld.blockedPositions.down.position![1]) {
                          rowBlocked = false;
                        }
                      }
                    }
                    else {
                      rowBlocked = false;
                    }
                  }


                  highlightSpace = !rowBlocked
                }
              }

              return (
                <Space 
                  key={`space${rowIndex}-${colIndex} ${highlightSpace ? "highlight" : ""}`} 
                  spaceData={space} 
                  showMovableArea={highlightSpace} 
                  colorSelected={colorHeld ? colorHeld.color : null}
                  spacePosition={[colIndex, rowIndex]} 
                  gridPosition={[...tileData.gridPosition]}
                />
              )
            })}
          </div>
        )
      })}
      <img 
        draggable={false}
        src={`/${tileData.id}.jpg`} alt={`tile-${tileData.id}`}
        style={{
          transform: `rotate(${tileData.rotation}deg)`,
        }}>
      </img>
    </div>
  )
}

export default Tile;
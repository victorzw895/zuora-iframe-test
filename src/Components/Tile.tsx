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

      // let gridChangeIndex = readArrayBackwards ? -1 : 1; // 0 option for current tile
      // const gridColIndex = changeInRow ? pawn.gridPosition[0] : pawn.gridPosition[0] + gridChangeIndex;
      // const gridRowIndex = changeInRow ? pawn.gridPosition[1] + gridChangeIndex : pawn.gridPosition[1];

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
      // else {
      //   console.log("no blocked position", firstBlockedSpacePosition, blockedSpaceGridPosition);
      // }

      // if (i >= spacesInCurrentTile) {
      //   if (allSpaces[i].details?.sideWalls?.includes(wallDirection) || allSpaces[i].type === "barrier") {
      //     firstBlockedSpacePosition = changeInRow ? [colIndex + gridChangeIndex, rowIndex] : [colIndex, rowIndex - gridChangeIndex]
      //     blockedSpaceGridPosition = [gridColIndex, gridRowIndex];
      //     break;
      //   }
      //   else if (isSpaceOccupied([gridColIndex, gridRowIndex], colIndex, rowIndex)) { // NOTE colIndex and rowIndex need to change
      //     firstBlockedSpacePosition = changeInRow ? [colIndex + gridChangeIndex, rowIndex] : [colIndex, rowIndex - gridChangeIndex]
      //     blockedSpaceGridPosition = [gridColIndex, gridRowIndex];
      //     break;
      //   }
      // }
      // else if (i < spacesInCurrentTile) {
      //   if (allSpaces[i].details?.sideWalls?.includes(wallDirection) || allSpaces[i].type === "barrier") {
      //     firstBlockedSpacePosition = [colIndex, rowIndex]; // up // for left -> [colIndex, pawn.position[1]]
      //     break;
      //   }
      //   else if (isSpaceOccupied(pawn.gridPosition, colIndex, rowIndex)) {
      //     firstBlockedSpacePosition = [colIndex, rowIndex] // up // for left -> [colIndex, pawn.position[1]]
      //     break;
      //   }
      // }
    }

    const firstBlocked = {
      position: firstBlockedSpacePosition,
      gridPosition: blockedSpaceGridPosition
    }

    // console.log("first Blocked" , firstBlocked)
    // console.log("direction blocked space", direction, firstBlockedSpacePosition)

    return firstBlocked;
  }

  // const getFirstBlockedSpace = (pawn: HeroPawn, direction: direction) => {
  //   const pawnPosition = pawn.position;
  //   const startCol = pawnPosition[0];
  //   const startRow = pawnPosition[1];

  //   const allSpaces = getAllDirectionalSpaces(pawn, direction);

  //   let firstBlockedSpacePosition;
  //   let blockedSpaceGridPosition

  //   if (direction === "up") {
  //     for (let i = allSpaces.length - 1; i >= 0; i--) {
  //       const rowIndex = i <= 3 ? i : i - 4;
  //       const rowStart = pawn.position[1] - 1;
  //       console.log("up", allSpaces)
  //       if (i <= 3 && allSpaces.length > 4) {
  //         if (allSpaces[i].details?.sideWalls?.includes("down") || allSpaces[i].type === "barrier") {
  //           firstBlockedSpacePosition = [pawn.position[0] - 1, rowIndex]
  //           blockedSpaceGridPosition = [pawn.gridPosition[0], pawn.gridPosition[1] - 1];
  //           break;
  //         }
  //         else if (isSpaceOccupied([pawn.gridPosition[0], pawn.gridPosition[1] - 1], rowIndex, pawn.position[1])) {
  //           firstBlockedSpacePosition = [pawn.position[0] - 1, rowIndex]
  //           blockedSpaceGridPosition = [pawn.gridPosition[0], pawn.gridPosition[1] - 1];
  //           break;
  //         }
  //       }
  //       else if (allSpaces[i].details?.sideWalls?.includes("down") || allSpaces[i].type === "barrier") {
  //         firstBlockedSpacePosition = [pawn.position[0], rowIndex];
  //         break;
  //       }
  //       else if (isSpaceOccupied(pawn.gridPosition, pawn.position[0], rowIndex)) {
  //         firstBlockedSpacePosition = [pawn.position[0], rowIndex]
  //         break;
  //       }
  //     }
  //   }
  //   else if (direction === "right") {
  //       console.log("right", allSpaces)
  //       for (let i = 0; i <= allSpaces.length - 1; i++) {
  //       const colStart = pawn.position[0] + 1;
  //       const colIndex = i < allSpaces.length - 4 ? i + colStart : i - (allSpaces.length - 4);
  //       if (i >= allSpaces.length - 4 && allSpaces.length > 4) {
  //         if (allSpaces[i].details?.sideWalls?.includes("left") || allSpaces[i].type === "barrier") {
  //           firstBlockedSpacePosition = [colIndex, pawn.position[1] - 1]
  //           blockedSpaceGridPosition = [pawn.gridPosition[0] + 1, pawn.gridPosition[1]];
  //           break;
  //         }
  //         else if (isSpaceOccupied([pawn.gridPosition[0] + 1, pawn.gridPosition[1]], colIndex, pawn.position[1])) {
  //           firstBlockedSpacePosition = [colIndex, pawn.position[1] - 1]
  //           blockedSpaceGridPosition = [pawn.gridPosition[0] + 1, pawn.gridPosition[1]];
  //           break;
  //         }
  //       }
  //       else if (allSpaces[i].details?.sideWalls?.includes("left") || allSpaces[i].type === "barrier") {
  //         firstBlockedSpacePosition = [colIndex, pawn.position[1]]
  //         break;
  //       }
  //       else if (isSpaceOccupied(pawn.gridPosition, colIndex, pawn.position[1])) {
  //         firstBlockedSpacePosition = [colIndex, pawn.position[1]]
  //         break;
  //       }
  //     }
  //   }
  //   else if (direction === "down") {
  //     console.log("down", allSpaces)
  //     for (let i = 0; i <= allSpaces.length - 1; i++) {
  //       const rowStart = pawn.position[1] + 1;
  //       const rowIndex = i < allSpaces.length - 4 ? i + rowStart : i - (allSpaces.length - 4);
  //       if (i >= allSpaces.length - 4 && allSpaces.length > 4) {
  //         if (allSpaces[i].details?.sideWalls?.includes("up") || allSpaces[i].type === "barrier") {
  //           firstBlockedSpacePosition = [pawn.position[0] + 1, rowIndex]
  //           blockedSpaceGridPosition = [pawn.gridPosition[0], pawn.gridPosition[1] + 1];
  //           break;
  //         }
  //         else if (isSpaceOccupied([pawn.gridPosition[0], pawn.gridPosition[1] + 1], rowIndex, pawn.position[1])) {
  //           firstBlockedSpacePosition = [pawn.position[0] + 1, rowIndex]
  //           blockedSpaceGridPosition = [pawn.gridPosition[0], pawn.gridPosition[1] + 1];
  //           break;
  //         }
  //       }
  //       else if (allSpaces[i].details?.sideWalls?.includes("up") || allSpaces[i].type === "barrier") {
  //         firstBlockedSpacePosition = [pawn.position[0], rowIndex]
  //         break;
  //       }
  //       else if (isSpaceOccupied(pawn.gridPosition, pawn.position[0], rowIndex)) {
  //         firstBlockedSpacePosition = [pawn.position[0], rowIndex]
  //         break;
  //       }
  //     }
  //   }
  //   else if (direction === "left") {
  //       console.log("left", allSpaces)
  //       for (let i = allSpaces.length - 1; i >= 0; i--) {
  //       const colStart = pawn.position[0] - 1;
  //       const colIndex = i <= 3 ? i : i - 4;
  //       if (i <= 3 && allSpaces.length > 4) {
  //         if (allSpaces[i].details?.sideWalls?.includes("right") || allSpaces[i].type === "barrier") {
  //           firstBlockedSpacePosition = [colIndex, pawn.position[1] + 1]
  //           blockedSpaceGridPosition = [pawn.gridPosition[0] - 1, pawn.gridPosition[1]];
  //           break;
  //         }
  //         else if (isSpaceOccupied([pawn.gridPosition[0] - 1, pawn.gridPosition[1]], colIndex, pawn.position[1])) {
  //           firstBlockedSpacePosition = [colIndex, pawn.position[1] + 1]
  //           blockedSpaceGridPosition = [pawn.gridPosition[0] - 1, pawn.gridPosition[1]];
  //           break;
  //         }
  //       }
  //       else if (allSpaces[i].details?.sideWalls?.includes("right") || allSpaces[i].type === "barrier") {
  //         firstBlockedSpacePosition = [colIndex, pawn.position[1]]
  //         break;
  //       }
  //       else if (isSpaceOccupied(pawn.gridPosition, colIndex, pawn.position[1])) {
  //         firstBlockedSpacePosition = [colIndex, pawn.position[1]]
  //         break;
  //       }
  //     }
  //   }

  //   const firstBlocked = {
  //     position: firstBlockedSpacePosition,
  //     gridPosition: blockedSpaceGridPosition
  //   }

  //   console.log("first Blocked" , firstBlocked)
  //   console.log("direction blocked space", direction, firstBlockedSpacePosition)

  //   return firstBlocked;
  // }

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

      let skipUpTile = false;
      let skipRightTile = false;
      let skipDownTile = false;
      let skipLeftTile = false;

      if (blockedDirections.up.gridPosition) {
        if (blockedDirections.up.gridPosition[0] === yellow.gridPosition[0] && blockedDirections.up.gridPosition[1] === yellow.gridPosition[1]) {
          skipUpTile = true;
        }
      }
      if (blockedDirections.right.gridPosition) {
        if (blockedDirections.right.gridPosition[0] === yellow.gridPosition[0] && blockedDirections.right.gridPosition[1] === yellow.gridPosition[1]) {
          skipRightTile = true;
        }
      }
      if (blockedDirections.down.gridPosition) {
        if (blockedDirections.down.gridPosition[0] === yellow.gridPosition[0] && blockedDirections.down.gridPosition[1] === yellow.gridPosition[1]) {
          skipDownTile = true;
        }
      }
      if (blockedDirections.left.gridPosition) {
        if (blockedDirections.left.gridPosition[0] === yellow.gridPosition[0] && blockedDirections.left.gridPosition[1] === yellow.gridPosition[1]) {
          skipLeftTile = true;
        }
      }

      if (tileData.gridPosition[0] === yellow.gridPosition[0] && tileData.gridPosition[1] === yellow.gridPosition[1] - 1) {
        if (!skipUpTile && yellow.position[0] === 2) {
          setShowMovableDirections(playerDirections);
        }
      }
      if (tileData.gridPosition[0] === yellow.gridPosition[0] + 1 && tileData.gridPosition[1] === yellow.gridPosition[1]) {
        if (!skipRightTile && yellow.position[1] === 2) {
          setShowMovableDirections(playerDirections);
        }
      }
      if (tileData.gridPosition[0] === yellow.gridPosition[0] && tileData.gridPosition[1] === yellow.gridPosition[1] + 1) {
        if (!skipDownTile && yellow.position[0] === 1) {
          setShowMovableDirections(playerDirections);
        }
      }
      if (tileData.gridPosition[0] === yellow.gridPosition[0] - 1 && tileData.gridPosition[1] === yellow.gridPosition[1] - 1) {
        if (!skipLeftTile && yellow.position[1] === 1) {
          setShowMovableDirections(playerDirections);
        }
      }

      if (tileData.gridPosition[0] === yellow.gridPosition[0] && tileData.gridPosition[1] === yellow.gridPosition[1]) {
        setShowMovableDirections(playerDirections);
      }
      // else if (
      //   (blockedDirections.up.gridPosition && 
      //     (blockedDirections.up.gridPosition[0] === tileData.gridPosition[0] && blockedDirections.up.gridPosition[1] === tileData.gridPosition[1]))
      //     ||
      //   (blockedDirections.right.gridPosition && 
      //     (blockedDirections.right.gridPosition[0] === tileData.gridPosition[0] && blockedDirections.right.gridPosition[1] === tileData.gridPosition[1]))
      //     ||
      //   (blockedDirections.down.gridPosition && 
      //     (blockedDirections.down.gridPosition[0] === tileData.gridPosition[0] && blockedDirections.down.gridPosition[1] === tileData.gridPosition[1]))
      //     ||
      //   (blockedDirections.left.gridPosition && 
      //     (blockedDirections.left.gridPosition[0] === tileData.gridPosition[0] && blockedDirections.left.gridPosition[1] === tileData.gridPosition[1]))
      //   ) {
      //     setShowMovableDirections(playerDirections);
      //   }
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

      let skipUpTile = false;
      let skipRightTile = false;
      let skipDownTile = false;
      let skipLeftTile = false;

      if (blockedDirections.up.gridPosition) {
        if (blockedDirections.up.gridPosition[0] === orange.gridPosition[0] && blockedDirections.up.gridPosition[1] === orange.gridPosition[1]) {
          skipUpTile = true;
        }
      }
      if (blockedDirections.right.gridPosition) {
        if (blockedDirections.right.gridPosition[0] === orange.gridPosition[0] && blockedDirections.right.gridPosition[1] === orange.gridPosition[1]) {
          skipRightTile = true;
        }
      }
      if (blockedDirections.down.gridPosition) {
        if (blockedDirections.down.gridPosition[0] === orange.gridPosition[0] && blockedDirections.down.gridPosition[1] === orange.gridPosition[1]) {
          skipDownTile = true;
        }
      }
      if (blockedDirections.left.gridPosition) {
        if (blockedDirections.left.gridPosition[0] === orange.gridPosition[0] && blockedDirections.left.gridPosition[1] === orange.gridPosition[1]) {
          skipLeftTile = true;
        }
      }

      if (tileData.gridPosition[0] === orange.gridPosition[0] && tileData.gridPosition[1] === orange.gridPosition[1] - 1) {
        if (!skipUpTile && orange.position[0] === 2) {
          setShowMovableDirections(playerDirections);
        }
      }
      if (tileData.gridPosition[0] === orange.gridPosition[0] + 1 && tileData.gridPosition[1] === orange.gridPosition[1]) {
        if (!skipRightTile && orange.position[1] === 2) {
          setShowMovableDirections(playerDirections);
        }
      }
      if (tileData.gridPosition[0] === orange.gridPosition[0] && tileData.gridPosition[1] === orange.gridPosition[1] + 1) {
        if (!skipDownTile && orange.position[0] === 1) {
          setShowMovableDirections(playerDirections);
        }
      }
      if (tileData.gridPosition[0] === orange.gridPosition[0] - 1 && tileData.gridPosition[1] === orange.gridPosition[1] - 1) {
        if (!skipLeftTile && orange.position[1] === 1) {
          setShowMovableDirections(playerDirections);
        }
      }

      if (tileData.gridPosition[0] === orange.gridPosition[0] && tileData.gridPosition[1] === orange.gridPosition[1]) {
        setShowMovableDirections(playerDirections);
      }
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
      let skipUpTile = false;
      let skipRightTile = false;
      let skipDownTile = false;
      let skipLeftTile = false;

      if (blockedDirections.up.gridPosition) {
        if (blockedDirections.up.gridPosition[0] === green.gridPosition[0] && blockedDirections.up.gridPosition[1] === green.gridPosition[1]) {
          skipUpTile = true;
        }
      }
      if (blockedDirections.right.gridPosition) {
        if (blockedDirections.right.gridPosition[0] === green.gridPosition[0] && blockedDirections.right.gridPosition[1] === green.gridPosition[1]) {
          skipRightTile = true;
        }
      }
      if (blockedDirections.down.gridPosition) {
        if (blockedDirections.down.gridPosition[0] === green.gridPosition[0] && blockedDirections.down.gridPosition[1] === green.gridPosition[1]) {
          skipDownTile = true;
        }
      }
      if (blockedDirections.left.gridPosition) {
        if (blockedDirections.left.gridPosition[0] === green.gridPosition[0] && blockedDirections.left.gridPosition[1] === green.gridPosition[1]) {
          skipLeftTile = true;
        }
      }

      if (tileData.gridPosition[0] === green.gridPosition[0] && tileData.gridPosition[1] === green.gridPosition[1] - 1) {
        if (!skipUpTile && green.position[0] === 2) {
          setShowMovableDirections(playerDirections);
        }
      }
      if (tileData.gridPosition[0] === green.gridPosition[0] + 1 && tileData.gridPosition[1] === green.gridPosition[1]) {
        if (!skipRightTile && green.position[1] === 2) {
          setShowMovableDirections(playerDirections);
        }
      }
      if (tileData.gridPosition[0] === green.gridPosition[0] && tileData.gridPosition[1] === green.gridPosition[1] + 1) {
        if (!skipDownTile && green.position[0] === 1) {
          setShowMovableDirections(playerDirections);
        }
      }
      if (tileData.gridPosition[0] === green.gridPosition[0] - 1 && tileData.gridPosition[1] === green.gridPosition[1] - 1) {
        if (!skipLeftTile && green.position[1] === 1) {
          setShowMovableDirections(playerDirections);
        }
      }

      if (tileData.gridPosition[0] === green.gridPosition[0] && tileData.gridPosition[1] === green.gridPosition[1]) {
        setShowMovableDirections(playerDirections);
      }
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

      let skipUpTile = false;
      let skipRightTile = false;
      let skipDownTile = false;
      let skipLeftTile = false;

      if (blockedDirections.up.gridPosition) {
        if (blockedDirections.up.gridPosition[0] === purple.gridPosition[0] && blockedDirections.up.gridPosition[1] === purple.gridPosition[1]) {
          skipUpTile = true;
        }
      }
      if (blockedDirections.right.gridPosition) {
        if (blockedDirections.right.gridPosition[0] === purple.gridPosition[0] && blockedDirections.right.gridPosition[1] === purple.gridPosition[1]) {
          skipRightTile = true;
        }
      }
      if (blockedDirections.down.gridPosition) {
        if (blockedDirections.down.gridPosition[0] === purple.gridPosition[0] && blockedDirections.down.gridPosition[1] === purple.gridPosition[1]) {
          skipDownTile = true;
        }
      }
      if (blockedDirections.left.gridPosition) {
        if (blockedDirections.left.gridPosition[0] === purple.gridPosition[0] && blockedDirections.left.gridPosition[1] === purple.gridPosition[1]) {
          skipLeftTile = true;
        }
      }

      if (tileData.gridPosition[0] === purple.gridPosition[0] && tileData.gridPosition[1] === purple.gridPosition[1] - 1) {
        if (!skipUpTile && purple.position[0] === 2) {
          setShowMovableDirections(playerDirections);
        }
      }
      if (tileData.gridPosition[0] === purple.gridPosition[0] + 1 && tileData.gridPosition[1] === purple.gridPosition[1]) {
        if (!skipRightTile && purple.position[1] === 2) {
          setShowMovableDirections(playerDirections);
        }
      }
      if (tileData.gridPosition[0] === purple.gridPosition[0] && tileData.gridPosition[1] === purple.gridPosition[1] + 1) {
        if (!skipDownTile && purple.position[0] === 1) {
          setShowMovableDirections(playerDirections);
        }
      }
      if (tileData.gridPosition[0] === purple.gridPosition[0] - 1 && tileData.gridPosition[1] === purple.gridPosition[1] - 1) {
        if (!skipLeftTile && purple.position[1] === 1) {
          setShowMovableDirections(playerDirections);
        }
      }

      if (tileData.gridPosition[0] === purple.gridPosition[0] && tileData.gridPosition[1] === purple.gridPosition[1]) {
        setShowMovableDirections(playerDirections);
      }
      // if (tileData.gridPosition[0] === purple.gridPosition[0] && tileData.gridPosition[1] === purple.gridPosition[1]) {
      //   // get pawn position
      //   const pawnPosition = purple.position;
      //   // get player direction from live player session? firebase?
      //   const playerDirections = playerState.playerDirections;
      //   // get player direction
      //   // showArea for spaces in player direction from pawn position
      //   const blockedDirections = {
      //     up: getFirstBlockedSpace(purple, "up"),
      //     right: getFirstBlockedSpace(purple, "right"),
      //     left: getFirstBlockedSpace(purple, "left"),
      //     down: getFirstBlockedSpace(purple, "down"),
      //   }

      //   pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color: "purple"})

      //   setShowMovableDirections(playerDirections);
      // }
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
                  // if there is blocked position
                  rowBlocked = true;
                  if (colorHeld.blockedPositions.right.gridPosition) {
                    // if pawn grid position in same grid row as blockedPosition // if not is same row is not moveable for direction "RIGHT"
                    if (colorHeld.gridPosition[1] === colorHeld.blockedPositions.right.gridPosition[1]) {
                      // if pawn grid Pos COLUMN is same as Blocked COL
                      if (colorHeld.gridPosition[0] === colorHeld.blockedPositions.right.gridPosition[0]) {
                        // if this TILE grid pos is same as blockedPosition grid Pos (ROW)
                        if (tileData.gridPosition[1] === colorHeld.blockedPositions.right.gridPosition[1]) {
                          // if this TILE grid pos is same as blockedPosition grid Pos (COL)
                          if (tileData.gridPosition[0] === colorHeld.blockedPositions.right.gridPosition[0]) {
                            // if blocked position not undefined
                            if (colorHeld.blockedPositions.right.position) {
                              if (rowIndex === colorHeld.blockedPositions.right.position[1]) {
                                if (colIndex > colorHeld.position[0]) {
                                  if (colIndex >= colorHeld.blockedPositions.right.position[0]) {
                                    rowBlocked = true;
                                  }
                                  else if (colIndex < colorHeld.blockedPositions.right.position[0]) {
                                    rowBlocked = false;
                                  }
                                }
                              }
                              else {
                                rowBlocked = true;
                              }
                              highlightSpace = !rowBlocked;
                            }
                          }
                        }
                      }
                      // if pawn gridPos is on the left of blocked Grid POs (There are 2 tiles require highlight)
                      else if (colorHeld.gridPosition[0] + 1 === colorHeld.blockedPositions.right.gridPosition[0]) {
                        // if tile is at blockedPosition Row
                        if (tileData.gridPosition[1] === colorHeld.blockedPositions.right.gridPosition[1]) {
                          // if tile is at blockedPosition Col
                          if (tileData.gridPosition[0] === colorHeld.blockedPositions.right.gridPosition[0]) {
                            if (colorHeld.blockedPositions.right.position) {
                              if (rowIndex === colorHeld.blockedPositions.right.position[1]) {
                                if (colIndex >= colorHeld.blockedPositions.right.position[0]) {
                                  rowBlocked = true;
                                }
                                else if (colIndex < colorHeld.blockedPositions.right.position[0]) {
                                  rowBlocked = false;
                                }
                              }
                              else {
                                rowBlocked = true;
                              }
                              // highlightSpace = !rowBlocked;
                            }
                          }
                          // else if tile is where pawn is left of BlockedPos grid COL
                          else if (tileData.gridPosition[0] === colorHeld.blockedPositions.right.gridPosition[0] - 1) {
                            if (colorHeld.blockedPositions.right.position) {
                              // adjust row to be blockedPosition + 1
                              if (rowIndex === colorHeld.blockedPositions.right.position[1] + 1) {
                                if (colIndex > colorHeld.position[0]) {
                                  rowBlocked = false;
                                }
                                else {
                                  rowBlocked = true;
                                }
                              }
                              else {
                                rowBlocked = true;
                              }
                              // highlightSpace = !rowBlocked;
                            }
                          }
                        }
                      }
                    }
                  }
                  // ELSE IF NO BLOCKERS
                  else if (tileData.gridPosition[0] === colorHeld.gridPosition[0] &&
                          tileData.gridPosition[1] === colorHeld.gridPosition[1]) {
                      if (colIndex > colorHeld.position[0] && rowIndex === colorHeld.position[1]) {
                        rowBlocked = false;
                      }
                      else {
                        rowBlocked = true;
                      }
                    }
                  highlightSpace = !rowBlocked;
                }
                // if (showMovableDirections.includes("left")) {
                //   if (colorHeld.position[1] === rowIndex && colIndex < colorHeld.position[0]) {
                //     // console.log("**************** should block left ??", space);
                //     // console.log("colindex and left position", colIndex, colorHeld.blockedPositions.left.position)
                //     // console.log("row current blocked?", rowBlocked)
                //     if (colorHeld.blockedPositions.left.gridPosition) {
                //       if (colorHeld.blockedPositions.left.gridPosition[0] === tileData.gridPosition[0] && 
                //           colorHeld.blockedPositions.left.gridPosition[1] === tileData.gridPosition[1]) {
                //             // console.log("block position: ", colorHeld.blockedPositions.left.position, " at gridPosition: ", colorHeld.blockedPositions.left.gridPosition)
                //       }
                //     }
                //     if (colorHeld.blockedPositions.left.position && colorHeld.blockedPositions.left.position.length) {
                //       if (colIndex <= colorHeld.blockedPositions.left.position[0]) {
                //         rowBlocked = true;
                //       }
                //       else if (colIndex > colorHeld.blockedPositions.left.position[0]) {
                //         rowBlocked = false;
                //       }
                //     }
                //     highlightSpace = !rowBlocked;
                //   }
                // }
                // if (showMovableDirections.includes("down") && !colBlocked) {
                //   if (colorHeld.position[0] === colIndex && rowIndex > colorHeld.position[1]) {
                //     if (colorHeld.blockedPositions.down.gridPosition) {

                //     }
                //     if (colorHeld.blockedPositions.down.position && colorHeld.blockedPositions.down.position.length) {
                //       if (rowIndex < colorHeld.blockedPositions.down.position[1]) {
                //         rowBlocked = false;
                //       }
                //       else if (rowIndex >= colorHeld.blockedPositions.down.position[1]) {
                //         rowBlocked = true;
                //       }
                //     }
                //     else {
                //       rowBlocked = false;
                //     }
                //     highlightSpace = !rowBlocked;
                //   }
                // }
                // if (showMovableDirections.includes("up") && !colBlocked) {
                //   if (colorHeld.blockedPositions.up.gridPosition) { // if extended tile NOTE: LATER CHANGE gridPosition default [8,8] instead of undefined
                //     if (tileData.gridPosition[0] === colorHeld.blockedPositions.up.gridPosition[0] &&
                //       tileData.gridPosition[1] === colorHeld.blockedPositions.up.gridPosition[1]) { 
                //       if (colorHeld.blockedPositions.up.position) {
                //         if (colorHeld.blockedPositions.up.position[0] === colIndex && rowIndex < colorHeld.blockedPositions.up.position[1]) {
                //           if (rowIndex <= colorHeld.blockedPositions.up.position[1]) {
                //             rowBlocked = true;
                //           }
                //         }
                //         else if (colorHeld.blockedPositions.up.position[0] === colIndex && rowIndex > colorHeld.blockedPositions.up.position[1]) {
                //           if (rowIndex > colorHeld.blockedPositions.up.position[1]) {
                //             rowBlocked = false;
                //           }
                //         }
                //         else {
                //           // console.log("all else blocked", colIndex, rowIndex, space)
                //           rowBlocked = true;
                //         }
                //         highlightSpace = !rowBlocked;
                //       }
                //     }   
                //     else if (tileData.gridPosition[0] === colorHeld.gridPosition[0] &&
                //             tileData.gridPosition[1] === colorHeld.gridPosition[1]) {
                //       if (colorHeld.position[0] === colIndex && rowIndex < colorHeld.position[1]) {
                //         rowBlocked = false;
                //         highlightSpace = !rowBlocked;
                //       }
                //     }
                //   }
                //   if (colorHeld.position[0] === colIndex && rowIndex < colorHeld.position[1]) {
                //     if (colorHeld.blockedPositions.up.gridPosition) {

                //     }
                //     else if (colorHeld.blockedPositions.up.position && colorHeld.blockedPositions.up.position.length) {
                //       if (rowIndex <= colorHeld.blockedPositions.up.position[1]) {
                //         rowBlocked = true;
                //       }
                //       else if (rowIndex > colorHeld.blockedPositions.up.position[1]) {
                //         rowBlocked = false;
                //       }
                //     }
                //     highlightSpace = !rowBlocked;
                //   }
                // }
              }
              // HERE need to check how far to show Area
                  // stop if walls, or pawns
              // HERE need to continue to other tiles

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
      <img src={`/${tileData.id}.jpg`} alt={`tile-${tileData.id}`}
        style={{
          transform: `rotate(${tileData.rotation}deg)`,
        }}></img>
    </div>
  )
}

export default Tile;
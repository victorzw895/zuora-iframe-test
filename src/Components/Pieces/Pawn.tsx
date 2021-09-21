import React, { useEffect, useState, MouseEvent } from 'react';
import { heroName, heroColor, heroWeapon, HeroPawn, TileInterface, direction, Space as SpaceType } from '../../types';
import { tileWallSize, spaceSize } from '../../constants';
import { usePawn, PawnState, BlockedPositions } from '../../Contexts/PawnContext';
import { usePlayer } from '../../Contexts/PlayerContext';
import { useGame } from '../../Contexts/GameContext';
import { useTiles } from '../../Contexts/TilesContext';
import { collection, getDoc, query, where, setDoc, doc, DocumentReference, DocumentData } from "firebase/firestore"; 
import { firestore } from "../../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'

// const PawnFactory = (color: heroColor, startPosition: number[]) => {
//   console.log('pawn factory', color, startPosition);
//   let heroName, weapon;
//   switch (color) {
//     case 'yellow':
//       heroName = 'Barbarian'
//       weapon = 'sword'
//       break;
//     case 'purple':
//       heroName = 'Mage'
//       weapon = 'vial'
//       break;
//     case 'green':
//       heroName = 'Elf'
//       weapon = 'bow'
//       break;
//     case 'orange':
//       heroName = 'Dwarf'
//       weapon = 'axe'
//       break;
//     default:
//       break;
//   }

//   return {
//     heroName: heroName as heroName,
//     color,
//     height: 46.25,
//     width: 46.25,
//     weapon: weapon as heroWeapon,
//     playerHeld: null,
//     position: startPosition,
//     ability: '',
//     canUseAbility: false,
//     move: () => {},
//     useAbility: () => {},
//     stealWeapon: () => {},
//     escape: () => {return false}
//   }
// }


interface pawnProps {
  color: heroColor,
  // position: number[]
}

const Pawn = ({color}: pawnProps) => {
  const { gameState, gameDispatch } = useGame();
  const { playerState, playerDispatch } = usePlayer();
  const { tilesState, tilesDispatch } = useTiles();

  const gamesRef = firestore.collection('games')

  const [room] = useDocumentData(gamesRef.doc(gameState.roomId));

  const {pawnState, pawnDispatch} = usePawn();
  // const [pawn, setPawn] = useState<HeroPawn>(PawnFactory(color, position));
  const pawn = pawnState[color as keyof PawnState];

  
  const directionPositionValue = {
    "up": -1,
    "right": 1,
    "down": 1,
    "left": -1
  }

  const getExtraDirectionalSpaces = (tileFound: TileInterface, pawn: HeroPawn, direction: direction) => {
    let extraSpaces;
    if (direction === "up" || direction === "down") {
      extraSpaces = Object.values(tileFound.spaces!).map((row) => row.filter((col, colIndex) => colIndex === pawn.position[0] + directionPositionValue[direction])).flat(1)
    }
    else if (direction === "left" || direction === "right") {
      extraSpaces = Object.values(tileFound.spaces!).filter((row, rowIndex) => rowIndex === pawn.position[1] - directionPositionValue[direction]).flat(1)
    }
    return extraSpaces
  }


  const findDirectionAdjacentTile = (pawn: HeroPawn, alignmentPositionConstant: "row" | "col", direction: direction) => {
    const positionConstantValue = alignmentPositionConstant === "col" ? 0 : 1;
    const positionVariantValue = alignmentPositionConstant === "col" ? 1 : 0;
    if (room.tiles.length > 1) {
      const tileFound = room.tiles.find((tile: any) => 
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
      remainingRows = Object.values(currentTile.spaces!).filter((row, rowIndex) => rowIndex === pawn.position[1])
    }
    else if (direction === "up") {
      remainingRows = Object.values(currentTile.spaces!).filter((row, rowIndex) => rowIndex < pawn.position[1])
    }
    else if (direction === "down") {
      remainingRows = Object.values(currentTile.spaces!).filter((row, rowIndex) => rowIndex > pawn.position[1])
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
    const currentTile = room.tiles.find((tile: any) => tile.gridPosition[0] === pawn.gridPosition[0] && tile.gridPosition[1] === pawn.gridPosition[1]);
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
    return directionalSpaces;
  }

  const isSpaceOccupied = (tileGridPosition: number[], colIndex: number, rowIndex: number) => {
    return Object.values(room.pawns).some((pawn: any) => {
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

    let firstBlockedSpacePosition = null;
    let blockedSpaceGridPosition = null;

    const currentTile = room.tiles.find((tile: any) => tile.gridPosition[0] === pawn.gridPosition[0] && tile.gridPosition[1] === pawn.gridPosition[1]);
    if (currentTile) {
      const tileRow = Object.values(currentTile.spaces!).find((row, rowIndex) => rowIndex === startRow);
      const currentSpace = (tileRow as any).find((col: any, colIndex: number) => colIndex === startCol);
      if (currentSpace && currentSpace.details?.sideWalls?.includes(direction)) {
        firstBlockedSpacePosition = [startCol, startRow];
        blockedSpaceGridPosition = currentTile.gridPosition;
      }
    }

    const allSpaces = getAllDirectionalSpaces(pawn, direction);

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

    return firstBlocked;
  }

  const _handleClick = async (e: MouseEvent<HTMLDivElement>) => {
    const pawnColor = room.pawns[color];
    const newRoomValue = {...room}
    const pawnPosition = pawnColor.position;
    console.log("newRoomValue", newRoomValue);
    const currentPlayer = newRoomValue.players.find((player: any) => player.number === playerState.number)
    const playerDirections = currentPlayer.playerDirections;

    const blockedDirections: BlockedPositions = {
      up: {
        position: null,
        gridPosition: null
      },
      right: {
        position: null,
        gridPosition: null
      },
      left: {
        position: null,
        gridPosition: null
      },
      down: {
        position: null,
        gridPosition: null
      },
    }

    if (!pawnColor.playerHeld) {
      const newRoomValue = {...room};

      newRoomValue.pawns[color].playerHeld = currentPlayer.number;

      // get pawn position
      // get player direction
      // showArea for spaces in player direction from pawn position
      playerDirections.forEach((direction: direction) => {
        const blockedSpace = getFirstBlockedSpace(pawnColor, direction);
        blockedDirections[direction].position = blockedSpace.position
        blockedDirections[direction].gridPosition = blockedSpace.gridPosition
      })

      newRoomValue.pawns[color].blockedPositions = blockedDirections;

      await setDoc(
        gamesRef.doc(gameState.roomId), 
        { 
          pawns: newRoomValue.pawns
        },
        {merge: true}
      )
      console.log("playerDirections", playerDirections)
      // pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color: "yellow"})
      // setShowMovableDirections(playerDirections);
      playerDispatch({type: "showMovableSpaces", value: playerDirections, color})

      // playerDispatch({type: "showMovableSpaces", value: playerDirections, color})
  
      // await setDoc(
      //   gamesRef.doc(gameState.roomId), 
      //   { 
      //     pawns: newRoomValue.pawns
      //   },
      //   {merge: true}
      // )
    }
    else {
      // pawnDispatch({type: "playerHeld", value: 1, color})
      newRoomValue.pawns[color].playerHeld = null;

      newRoomValue.pawns[color].blockedPositions = blockedDirections;
  
      await setDoc(
        gamesRef.doc(gameState.roomId), 
        { 
          pawns: newRoomValue.pawns
        },
        {merge: true}
      )

      playerDispatch({type: "showMovableSpaces", value: [], color})

    }
  }

  const getDisplacementValue = (positionValue: number) => {
    return tileWallSize - ((Math.abs(8 - positionValue) * 2) * spaceSize)
  }

  return (
    <>
      {
        room ? <div className="pawn-grid"
          style={{
            gridColumnStart: room?.pawns[color]?.gridPosition[0],
            gridRowStart: room?.pawns[color]?.gridPosition[1],
            marginTop: room?.pawns[color]?.gridPosition[0] < 8 ? getDisplacementValue(room?.pawns[color]?.gridPosition[0]) : tileWallSize,
            marginBottom: room?.pawns[color]?.gridPosition[0] > 8 ? getDisplacementValue(room?.pawns[color]?.gridPosition[0]) : tileWallSize,
            marginLeft: room?.pawns[color]?.gridPosition[1] > 8 ? getDisplacementValue(room?.pawns[color]?.gridPosition[1]) : tileWallSize,
            marginRight: room?.pawns[color]?.gridPosition[1] < 8 ? getDisplacementValue(room?.pawns[color]?.gridPosition[1]) : tileWallSize,
            placeSelf: "center",
            position: "static"
          }}>
          <div className={`pawn ${color}`} onClick={_handleClick}
            style={{
              // left: `${(pawn.position[0] * pawn.width) + tileWallSize + ((8 - pawn.gridPosition[1]) * pawn.width)}px`,
              // top: `${(pawn.position[1] * pawn.height) + tileWallSize + ((pawn.gridPosition[0] - 8) * pawn.height)}px`,
              gridColumnStart: room?.pawns[color]?.position[0] + 1,
              gridRowStart: room?.pawns[color]?.position[1] + 1,
              position: "relative"
            }}
          >
            <img 
              draggable={false}
              src={`/${color}-pawn.svg`} 
              alt={`${color}-piece`} 
              style={{border: `${room?.pawns[color]?.playerHeld ? "2px solid blue" : ""}`}}/>
          </div>
        </div>
          :
        <>
        </>
      }
    </>
  )
}

export default Pawn;
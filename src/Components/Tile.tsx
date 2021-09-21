import React, { useEffect, useState, useMemo, useLayoutEffect } from 'react';
import Space from './Space';
import { direction, HeroPawn, TileInterface, Space as SpaceType } from '../types';
import { tileWallSize, spaceSize } from '../constants';
import { usePawn } from '../Contexts/PawnContext';
import { useGame } from '../Contexts/GameContext';
import { usePlayer } from '../Contexts/PlayerContext';
import { useTiles } from '../Contexts/TilesContext';
import { collection, getDoc, query, where, setDoc, doc, DocumentReference, DocumentData } from "firebase/firestore"; 
import { firestore } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { color } from '@mui/system';

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
  // tileData: TileInterface,
  tileIndex: number
}

const Tile = ({startTile, id, tileIndex}: tileProps) => {
  const [showMovableDirections, setShowMovableDirections] = useState<direction[]>([]);

  const { playerState, playerDispatch } = usePlayer();
  const { pawnState, pawnDispatch } = usePawn();
  const { tilesState, tilesDispatch } = useTiles();
  const { yellow, green, purple, orange } = pawnState;

  const { gameState, gameDispatch } = useGame();

  const gamesRef = firestore.collection('games')

  const [room] = useDocumentData(gamesRef.doc(gameState.roomId));


  // useLayoutEffect(() => {
  //   (async() => {
  //     if (room?.pawns?.yellow.playerHeld) {
  //       // get pawn position
  //       const pawnPosition = room.pawns.yellow.position;
  //       const playerDirections = playerState.playerDirections;
  //       // get player direction
  //       // showArea for spaces in player direction from pawn position
        
  //       const blockedDirections = {
  //         up: getFirstBlockedSpace(room.pawns.yellow, "up"),
  //         right: getFirstBlockedSpace(room.pawns.yellow, "right"),
  //         left: getFirstBlockedSpace(room.pawns.yellow, "left"),
  //         down: getFirstBlockedSpace(room.pawns.yellow, "down"),
  //       }
  
  //       const newRoomValue = {...room};
  //       newRoomValue.pawns.yellow.blockedPositions = blockedDirections;
  
  //       await setDoc(
  //         gamesRef.doc(gameState.roomId), 
  //         { 
  //           pawns: newRoomValue.pawns
  //         },
  //         {merge: true}
  //       )
  
  //       // pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color: "yellow"})
  //       setShowMovableDirections(playerDirections);
  //     }
  //   })()
  // }, [room?.pawns?.yellow.playerHeld])

  // useLayoutEffect(() => {
  //   (async() => {
  //     if (room?.pawns?.orange.playerHeld) {
  //       // get pawn position
  //       const pawnPosition = room.pawns.orange.position;
  //       const playerDirections = playerState.playerDirections;
  //       // get player direction
  //       // showArea for spaces in player direction from pawn position
        
  //       const blockedDirections = {
  //         up: getFirstBlockedSpace(room.pawns.orange, "up"),
  //         right: getFirstBlockedSpace(room.pawns.orange, "right"),
  //         left: getFirstBlockedSpace(room.pawns.orange, "left"),
  //         down: getFirstBlockedSpace(room.pawns.orange, "down"),
  //       }
  
  //       const newRoomValue = {...room};
  //       newRoomValue.pawns.orange.blockedPositions = blockedDirections;
  
  //       await setDoc(
  //         gamesRef.doc(gameState.roomId), 
  //         { 
  //           pawns: newRoomValue.pawns
  //         },
  //         {merge: true}
  //       )
  
  //       // pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color: "yellow"})
  //       setShowMovableDirections(playerDirections);
  //     }
  //   })()
  // }, [room?.pawns?.orange.playerHeld])

  // useLayoutEffect(() => {
  //   (async() => {
  //     if (room?.pawns?.green.playerHeld) {
  //       // get pawn position
  //       const pawnPosition = room.pawns.green.position;
  //       const playerDirections = playerState.playerDirections;
  //       // get player direction
  //       // showArea for spaces in player direction from pawn position
        
  //       const blockedDirections = {
  //         up: getFirstBlockedSpace(room.pawns.green, "up"),
  //         right: getFirstBlockedSpace(room.pawns.green, "right"),
  //         left: getFirstBlockedSpace(room.pawns.green, "left"),
  //         down: getFirstBlockedSpace(room.pawns.green, "down"),
  //       }
  
  //       const newRoomValue = {...room};
  //       newRoomValue.pawns.green.blockedPositions = blockedDirections;
  
  //       await setDoc(
  //         gamesRef.doc(gameState.roomId), 
  //         { 
  //           pawns: newRoomValue.pawns
  //         },
  //         {merge: true}
  //       )
  
  //       // pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color: "green"})
  //       setShowMovableDirections(playerDirections);
  //     }
  //   })()
  // }, [room?.pawns?.green.playerHeld])

  // useLayoutEffect(() => {
  //   (async() => {
  //     if (room?.pawns?.purple.playerHeld) {
  //       // get pawn position
  //       const pawnPosition = room.pawns.purple.position;
  //       const playerDirections = playerState.playerDirections;
  //       // get player direction
  //       // showArea for spaces in player direction from pawn position
        
  //       const blockedDirections = {
  //         up: getFirstBlockedSpace(room.pawns.purple, "up"),
  //         right: getFirstBlockedSpace(room.pawns.purple, "right"),
  //         left: getFirstBlockedSpace(room.pawns.purple, "left"),
  //         down: getFirstBlockedSpace(room.pawns.purple, "down"),
  //       }
  
  //       const newRoomValue = {...room};
  //       newRoomValue.pawns.purple.blockedPositions = blockedDirections;
  
  //       await setDoc(
  //         gamesRef.doc(gameState.roomId), 
  //         { 
  //           pawns: newRoomValue.pawns
  //         },
  //         {merge: true}
  //       )
  
  //       // pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color: "purple"})
  //       setShowMovableDirections(playerDirections);
  //     }
  //   })()
  // }, [room?.pawns?.purple.playerHeld])

  // useLayoutEffect(() => {
  //   if (yellow.playerHeld) {
  //     // get pawn position
  //     const pawnPosition = yellow.position;
  //     const playerDirections = playerState.playerDirections;
  //     // get player direction
  //     // showArea for spaces in player direction from pawn position
      
  //     const blockedDirections = {
  //       up: getFirstBlockedSpace(yellow, "up"),
  //       right: getFirstBlockedSpace(yellow, "right"),
  //       left: getFirstBlockedSpace(yellow, "left"),
  //       down: getFirstBlockedSpace(yellow, "down"),
  //     }

  //     pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color: "yellow"})
  //     setShowMovableDirections(playerDirections);
  //   }
  // }, [yellow.playerHeld])

  // useLayoutEffect(() => {
  //   if (orange.playerHeld) {
  //     // get pawn position
  //     const pawnPosition = orange.position;
  //     const playerDirections = playerState.playerDirections;
  //     // get player direction
  //     // showArea for spaces in player direction from pawn position
      
  //     const blockedDirections = {
  //       up: getFirstBlockedSpace(orange, "up"),
  //       right: getFirstBlockedSpace(orange, "right"),
  //       left: getFirstBlockedSpace(orange, "left"),
  //       down: getFirstBlockedSpace(orange, "down"),
  //     }

  //     pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color: "orange"})
  //     setShowMovableDirections(playerDirections);
  //   }

  // }, [orange.playerHeld])

  // useLayoutEffect(() => {
  //   if (green.playerHeld) {
  //     // get pawn position
  //     const pawnPosition = green.position;
  //     const playerDirections = playerState.playerDirections;
  //     // get player direction
  //     // showArea for spaces in player direction from pawn position
      
  //     const blockedDirections = {
  //       up: getFirstBlockedSpace(green, "up"),
  //       right: getFirstBlockedSpace(green, "right"),
  //       left: getFirstBlockedSpace(green, "left"),
  //       down: getFirstBlockedSpace(green, "down"),
  //     }

  //     pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color: "green"})
  //     setShowMovableDirections(playerDirections);
  //   }
  // }, [green.playerHeld])

  // useLayoutEffect(() => {
  //   if (purple.playerHeld) {
  //     // get pawn position
  //     const pawnPosition = purple.position;
  //     const playerDirections = playerState.playerDirections;
  //     // get player direction
  //     // showArea for spaces in player direction from pawn position
      
  //     const blockedDirections = {
  //       up: getFirstBlockedSpace(purple, "up"),
  //       right: getFirstBlockedSpace(purple, "right"),
  //       left: getFirstBlockedSpace(purple, "left"),
  //       down: getFirstBlockedSpace(purple, "down"),
  //     }

  //     pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color: "purple"})

  //       setShowMovableDirections(playerDirections);
  //   }
  // }, [purple.playerHeld])

  const tileHasBlockedSpace = (tileData: TileInterface, direction: direction, pawnHeld: HeroPawn) => {
    console.log(playerState);
    if (playerState?.showMovableDirections?.includes(direction)) {
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
    <>
      {room ?
        <div className={`tile ${id === '1a' ? "start-tile" : ""}`} 
          style={
            {
              gridColumnStart: room.tiles[tileIndex].gridPosition[0],
              gridRowStart: room.tiles[tileIndex].gridPosition[1],
              marginTop: room.tiles[tileIndex].gridPosition[0] < 8 ? getDisplacementValue(room.tiles[tileIndex].gridPosition[0]) : tileWallSize,
              marginBottom: room.tiles[tileIndex].gridPosition[0] > 8 ? getDisplacementValue(room.tiles[tileIndex].gridPosition[0]) : tileWallSize,
              marginLeft: room.tiles[tileIndex].gridPosition[1] > 8 ? getDisplacementValue(room.tiles[tileIndex].gridPosition[1]) : tileWallSize,
              marginRight: room.tiles[tileIndex].gridPosition[1] < 8 ? getDisplacementValue(room.tiles[tileIndex].gridPosition[1]) : tileWallSize,
              placeSelf: "center"
            }
          }>
          {room.tiles[tileIndex].spaces && Object.values(room.tiles[tileIndex].spaces).map((row: any, rowIndex) => {
            // let rowBlocked = true;
            return (
              <div className="row" key={`row${rowIndex}`}>
                {row.map((space: any, colIndex: number) => {
                  let highlightSpace = false;
                  let colorHeld: HeroPawn | undefined;

                  if (room?.pawns?.yellow.playerHeld) colorHeld = room?.pawns?.yellow;
                  if (room?.pawns?.orange.playerHeld) colorHeld = room?.pawns?.orange;
                  if (room?.pawns?.green.playerHeld) colorHeld = room?.pawns?.green;
                  if (room?.pawns?.purple.playerHeld) colorHeld = room?.pawns?.purple;

                  const player = room.players.find((player: any) => player.number === playerState.number)
                  console.log("player", player)
                  if (colorHeld && colorHeld.playerHeld === player.number && playerState?.showMovableDirections?.length) {
                    console.log("colorHeld", colorHeld)
                    if (room.tiles[tileIndex].gridPosition[0] !== colorHeld.gridPosition[0] || room.tiles[tileIndex].gridPosition[1] !== colorHeld.gridPosition[1]) {
                      let rowBlocked = true;
                      if (player.playerDirections.includes("up")) {
                        if (room.tiles[tileIndex].gridPosition[0] === colorHeld.gridPosition[0] && 
                          room.tiles[tileIndex].gridPosition[1] === colorHeld.gridPosition[1] - 1) {
                          if (tileHasBlockedSpace(room.tiles[tileIndex], "up", colorHeld)) {
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
                        }
                      }

                      if (player.playerDirections.includes("left")) {
                        if (room.tiles[tileIndex].gridPosition[0] === colorHeld.gridPosition[0] - 1 && 
                          room.tiles[tileIndex].gridPosition[1] === colorHeld.gridPosition[1]) {
                          if (tileHasBlockedSpace(room.tiles[tileIndex], "left", colorHeld) && player.playerDirections.includes("left")) {
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
                            if (rowIndex === colorHeld.position[1] + 1 && colorHeld.position[1] === 1) {
                              if (!colorHeld.blockedPositions.left.gridPosition) {
                                rowBlocked = false;
                              }
                            }
                          }
                        }
                      }
                      
                      if (player.playerDirections.includes("right")) {
                        if (room.tiles[tileIndex].gridPosition[0] === colorHeld.gridPosition[0] + 1 && 
                          room.tiles[tileIndex].gridPosition[1] === colorHeld.gridPosition[1]) {
                          if (tileHasBlockedSpace(room.tiles[tileIndex], "right", colorHeld) && player.playerDirections.includes("right")) {
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
                            if (rowIndex === colorHeld.position[1] - 1 && colorHeld.position[1] === 2) {
                              if (!colorHeld.blockedPositions.right.gridPosition) {
                                rowBlocked = false;
                              }
                            }
                          }
                        }
                      }

                      if (player.playerDirections.includes("down")) {
                        if (room.tiles[tileIndex].gridPosition[0] === colorHeld.gridPosition[0] && 
                          room.tiles[tileIndex].gridPosition[1] === colorHeld.gridPosition[1] + 1) {
                          if (tileHasBlockedSpace(room.tiles[tileIndex], "down", colorHeld) && player.playerDirections.includes("down")) {
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
                            if (colIndex === colorHeld.position[0] + 1 && colorHeld.position[0] === 1) {
                              if (!colorHeld.blockedPositions.down.gridPosition) {
                                rowBlocked = false;
                              }
                            }
                          }
                        }
                      }

                      highlightSpace = !rowBlocked
                    }
                    else if (room.tiles[tileIndex].gridPosition[0] === colorHeld.gridPosition[0] && room.tiles[tileIndex].gridPosition[1] === colorHeld.gridPosition[1]) {
                      let rowBlocked = true;
                      
                      // column directly above from pawn (up movement)
                      if (rowIndex < colorHeld.position[1] && colIndex === colorHeld.position[0] && player.playerDirections.includes("up")) {
                        if (tileHasBlockedSpace(room.tiles[tileIndex], "up", colorHeld)) {
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
                      else if (colIndex < colorHeld.position[0] && rowIndex === colorHeld.position[1] && player.playerDirections.includes("left")) {
                        if (tileHasBlockedSpace(room.tiles[tileIndex], "left", colorHeld)) {
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
                      else if (colIndex > colorHeld.position[0] && rowIndex === colorHeld.position[1] && player.playerDirections.includes("right")) {
                        if (tileHasBlockedSpace(room.tiles[tileIndex], "right", colorHeld)) {
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
                      else if (rowIndex > colorHeld.position[1] && colIndex === colorHeld.position[0] && player.playerDirections.includes("down")) {
                        if (tileHasBlockedSpace(room.tiles[tileIndex], "down", colorHeld)) {
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
                      gridPosition={[...room.tiles[tileIndex].gridPosition]}
                    />
                  )
                })}
              </div>
            )
          })}
          <img 
            draggable={false}
            src={`/${room.tiles[tileIndex].id}.jpg`} alt={`tile-${room.tiles[tileIndex].id}`}
            style={{
              transform: `rotate(${room.tiles[tileIndex].rotation}deg)`,
            }}>
          </img>
        </div>
            :
        <>
        </>
      }
    </>
  )
}

export default Tile;
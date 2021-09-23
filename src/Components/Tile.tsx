import React, { useState, useCallback, memo, useEffect } from 'react';
import Space from './Space';
import { direction, HeroPawn, TileInterface, heroColor } from '../types';
import { tileWallSize, spaceSize } from '../constants';
import { usePawn } from '../Contexts/PawnContext';
import { useGame } from '../Contexts/GameContext';
import { usePlayer } from '../Contexts/PlayerContext';
import { useTiles } from '../Contexts/TilesContext';
import { firestore, gamesRef } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'


interface tileProps {
  startTile?: boolean | undefined,
  id?: string,
  // tileData: TileInterface,
  tileIndex: number
}

const areEqual = (prevProps: tileProps, nextProps: tileProps) => {
  if (prevProps.id === nextProps.id) {
    return true
  } 
  else if (prevProps.tileIndex === nextProps.tileIndex) {
    return true
  }
  return false
}

const Tile = memo(({startTile, id, tileIndex}: tileProps) => {

  const { playerState, playerDispatch } = usePlayer();

  const { gameState, gameDispatch } = useGame();

  // const gamesRef = firestore.collection('games')

  const [room] = useDocumentData(gamesRef.doc(gameState.roomId));

  useEffect(() => {
    console.log('tile', room)
  }, [room])
  useEffect(() => {
    console.log('tile', 'startTile', startTile)
  }, [startTile])
  useEffect(() => {
    console.log('tile', 'id', id)
  }, [id])
  useEffect(() => {
    console.log('tile', 'tileIndex', tileIndex)
  }, [tileIndex])
  useEffect(() => {
    console.log('tile', 'playerState', playerState)
  }, [playerState])
  useEffect(() => {
    console.log('tile', 'gameState', gameState)
  }, [gameState])
  useEffect(() => {
    console.log('tile', 'gamesRef', gamesRef)
  }, [gamesRef])

  const tileHasBlockedSpace = (tileData: TileInterface, direction: direction, pawnHeld: HeroPawn) => {
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
            let highlightSpace = false;
            let colorHeld: HeroPawn | undefined;

            Object.values(room.pawns).forEach((pawn: any) => {
              if (pawn.playerHeld && pawn.playerHeld === playerState.number) {
                colorHeld = pawn;
              }
            })

            return (
              <div className="row" key={`row${rowIndex}`}>
                {console.log("re rendering tile ******")}
                {row.map((space: any, colIndex: number) => {
                  const player = room.players.find((player: any) => player.number === playerState.number)
                  if (colorHeld && colorHeld.playerHeld === player.number && playerState?.showMovableDirections?.length) {
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
                      highlightTeleporter={playerState.showTeleportSpaces}
                      highlightEscalator={playerState.showEscalatorSpaces}
                      tileIndex={tileIndex}
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
          {/* {console.log("rendering tile")} */}
        </div>
            :
        <>
        </>
      }
    </>
  )
}, areEqual)

export default Tile;
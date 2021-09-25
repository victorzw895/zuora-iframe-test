import React, { useState, useCallback, memo, useEffect } from 'react';
import Space from './Space';
import { direction, HeroPawn, heroColor } from '../types';
import { Room, DBTile, DBHeroPawn } from '../firestore-types';
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
  tileData: DBTile,
  tileIndex: number
}

const areEqual = (prevProps: tileProps, nextProps: tileProps) => {
  // if (prevProps.id === nextProps.id) {
  //   return true
  // } 
  // else if (prevProps.tileIndex === nextProps.tileIndex) {
  //   return true
  // }
  return false
}

const Tile = memo(({startTile, id, tileIndex, tileData}: tileProps) => {

  const { playerState, playerDispatch } = usePlayer();

  const { pawnState, pawnDispatch } = usePawn();

  const { gameState, gameDispatch } = useGame();

  // const gamesRef = firestore.collection('games')

  const [room] = useDocumentData(gamesRef.doc(gameState.roomId));

  const { pawns, players } : Room = room || {}

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
  useEffect(() => {
    console.log('tile', 'pawnState', pawnState)
  }, [pawnState])

  const tileHasBlockedSpace = (tileData: DBTile, direction: direction, pawnHeld: HeroPawn) => {
    console.log("tilehas blocked space")
    if (playerState?.showMovableDirections?.includes(direction)) {
      if (pawnHeld.blockedPositions[direction].gridPosition && pawnHeld.blockedPositions[direction].position) {
        if (tileData.gridPosition[0] === pawnHeld.blockedPositions[direction].gridPosition![0] &&
            tileData.gridPosition[1] === pawnHeld.blockedPositions[direction].gridPosition![1]) {
              console.log('true')
              return true;
            }
      }
    }
    console.log('false', pawnHeld)
    return false;
  }

  const getDisplacementValue = (positionValue: number) => {
    return tileWallSize - ((Math.abs(8 - positionValue) * 2) * spaceSize)
  }
  
  return (
    <>
      {tileData && room ?
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
          {tileData.spaces && Object.values(tileData.spaces).map((row, rowIndex) => {
            // let rowBlocked = true;
            let highlightSpace = false;
            let colorHeld: HeroPawn | undefined;

            Object.values(pawns).forEach(pawn => {
              if (pawn.playerHeld && pawn.playerHeld === playerState.number) {
                colorHeld = pawn;
              }
            })


            return (
              <div className="row" key={`row${rowIndex}`}>
                {console.log("re rendering tile ******")}
                {row.map((space, colIndex) => {
                  const player = players.find(player => player.number === playerState.number)!
                  if (colorHeld && colorHeld.playerHeld === player.number && playerState.showMovableDirections.length) {
                    const localPawn = pawnState[colorHeld.color]
                    if (tileData.gridPosition[0] !== colorHeld.gridPosition[0] || tileData.gridPosition[1] !== colorHeld.gridPosition[1]) {
                      let rowBlocked = true;
                      if (player.playerDirections.includes("up")) {
                        if (tileData.gridPosition[0] === colorHeld.gridPosition[0] && 
                          tileData.gridPosition[1] === colorHeld.gridPosition[1] - 1) {
                          if (tileHasBlockedSpace(tileData, "up", localPawn)) {
                            if (colIndex === localPawn.blockedPositions.up.position![0]) {
                              if (rowIndex <= localPawn.blockedPositions.up.position![1]) {
                                rowBlocked = true;
                              }
                              else if (rowIndex > localPawn.blockedPositions.up.position![1]) {
                                rowBlocked = false;
                              }
                            }
                          }
                          else {
                            if (colIndex === colorHeld.position[0] - 1 && colorHeld.position[0] === 2) {
                              if (!localPawn.blockedPositions.up.gridPosition) {
                                rowBlocked = false;
                              }
                            }
                          }
                        }
                      }

                      if (player.playerDirections.includes("left")) {
                        if (tileData.gridPosition[0] === colorHeld.gridPosition[0] - 1 && 
                          tileData.gridPosition[1] === colorHeld.gridPosition[1]) {
                          if (tileHasBlockedSpace(tileData, "left", localPawn) && player.playerDirections.includes("left")) {
                            if (rowIndex === localPawn.blockedPositions.left.position![1]) {
                              if (colIndex <= localPawn.blockedPositions.left.position![0]) {
                                rowBlocked = true;
                              }
                              else if (colIndex > localPawn.blockedPositions.left.position![0]) {
                                rowBlocked = false;
                              }
                            }
                          }
                          else {
                            if (rowIndex === colorHeld.position[1] + 1 && colorHeld.position[1] === 1) {
                              if (!localPawn.blockedPositions.left.gridPosition) {
                                rowBlocked = false;
                              }
                            }
                          }
                        }
                      }
                      
                      if (player.playerDirections.includes("right")) {
                        if (tileData.gridPosition[0] === colorHeld.gridPosition[0] + 1 && 
                          tileData.gridPosition[1] === colorHeld.gridPosition[1]) {
                          if (tileHasBlockedSpace(tileData, "right", localPawn) && player.playerDirections.includes("right")) {
                            if (rowIndex === localPawn.blockedPositions.right.position![1]) {
                              if (colIndex >= localPawn.blockedPositions.right.position![0]) {
                                rowBlocked = true;
                              }
                              else if (colIndex < localPawn.blockedPositions.right.position![0]) {
                                rowBlocked = false;
                              }
                            }
                          }
                          else {
                            if (rowIndex === colorHeld.position[1] - 1 && colorHeld.position[1] === 2) {
                              if (!localPawn.blockedPositions.right.gridPosition) {
                                rowBlocked = false;
                              }
                            }
                          }
                        }
                      }

                      if (player.playerDirections.includes("down")) {
                        if (tileData.gridPosition[0] === colorHeld.gridPosition[0] && 
                          tileData.gridPosition[1] === colorHeld.gridPosition[1] + 1) {
                          if (tileHasBlockedSpace(tileData, "down", localPawn) && player.playerDirections.includes("down")) {
                            if (colIndex === localPawn.blockedPositions.down.position![0]) {
                              if (rowIndex >= localPawn.blockedPositions.down.position![1]) {
                                rowBlocked = true;
                              }
                              else if (rowIndex < localPawn.blockedPositions.down.position![1]) {
                                rowBlocked = false;
                              }
                            }
                          }
                          else {
                            if (colIndex === colorHeld.position[0] + 1 && colorHeld.position[0] === 1) {
                              if (!localPawn.blockedPositions.down.gridPosition) {
                                rowBlocked = false;
                              }
                            }
                          }
                        }
                      }

                      highlightSpace = !rowBlocked
                    }
                    else if (tileData.gridPosition[0] === colorHeld.gridPosition[0] && tileData.gridPosition[1] === colorHeld.gridPosition[1]) {
                      let rowBlocked = true;
                      
                      // column directly above from pawn (up movement)
                      if (rowIndex < colorHeld.position[1] && colIndex === colorHeld.position[0] && player.playerDirections.includes("up")) {
                        if (tileHasBlockedSpace(tileData, "up", localPawn)) {
                          if (colIndex === localPawn.blockedPositions.up.position![0]) {
                            if (rowIndex <= localPawn.blockedPositions.up.position![1]) {
                              rowBlocked = true;
                            }
                            else if (rowIndex > localPawn.blockedPositions.up.position![1]) {
                              rowBlocked = false;
                            }
                          }
                        }
                        else {
                          rowBlocked = false;
                        }
                      }
                      else if (colIndex < colorHeld.position[0] && rowIndex === colorHeld.position[1] && player.playerDirections.includes("left")) {
                        if (tileHasBlockedSpace(tileData, "left", localPawn)) {
                          if (rowIndex === localPawn.blockedPositions.left.position![1]) {
                            if (colIndex <= localPawn.blockedPositions.left.position![0]) {
                              rowBlocked = true;
                            }
                            else if (colIndex > localPawn.blockedPositions.left.position![0]) {
                              
                              rowBlocked = false;
                            }
                          }
                        }
                        else {
                          
                          rowBlocked = false;
                        }
                      }
                      else if (colIndex > colorHeld.position[0] && rowIndex === colorHeld.position[1] && player.playerDirections.includes("right")) {
                        if (tileHasBlockedSpace(tileData, "right", localPawn)) {
                          if (rowIndex === localPawn.blockedPositions.right.position![1]) {
                            if (colIndex >= localPawn.blockedPositions.right.position![0]) {
                              rowBlocked = true;
                            }
                            else if (colIndex < localPawn.blockedPositions.right.position![0]) {
                              rowBlocked = false;
                            }
                          }
                        }
                        else {
                          rowBlocked = false;
                        }
                      }
                      else if (rowIndex > colorHeld.position[1] && colIndex === colorHeld.position[0] && player.playerDirections.includes("down")) {
                        if (tileHasBlockedSpace(tileData, "down", localPawn)) {
                          if (colIndex === localPawn.blockedPositions.down.position![0]) {
                            if (rowIndex >= localPawn.blockedPositions.down.position![1]) {
                              rowBlocked = true;
                            }
                            else if (rowIndex < localPawn.blockedPositions.down.position![1]) {
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
            src={`/${tileData.id}.jpg`} alt={`tile-${tileData.id}`}
            style={{
              transform: `rotate(${tileData.rotation}deg)`,
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
import React, { useEffect, useState, memo } from 'react';
import { useGame } from '../Contexts/GameContext';
import { usePlayer } from '../Contexts/PlayerContext';
import { Space as SpaceType, heroColor, TeleporterSpace, HeroPawn, Escalator, TimerSpace, WeaponSpace, ExitSpace } from '../types';
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import { firestore } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { positions } from '@mui/system';

interface SpaceProps {
  spaceData: SpaceType,
  showMovableArea: boolean,
  spacePosition: number[],
  colorSelected: heroColor | null,
  gridPosition: number[],
  highlightTeleporter: heroColor | null,
  highlightEscalator: Escalator[],
  tileIndex: number
}

// const areEqual = (prevProps: SpaceProps, nextProps: SpaceProps) => {
//   if (prevProps.showMovableArea !== nextProps.showMovableArea) {
//         return false
//   }
//   return true
// }


const Space = ({spaceData, showMovableArea, spacePosition, colorSelected, gridPosition, highlightTeleporter, highlightEscalator, tileIndex}: SpaceProps) => {
  const { gameState, gameDispatch } = useGame();
  const { playerState, playerDispatch } = usePlayer();

  const gamesRef = firestore.collection('games')

  const isTeleporter = spaceData.type === "teleporter";
  const teleporterColor = isTeleporter ? (spaceData.details as TeleporterSpace).color : "";

  const isEscalator = spaceData.details?.hasEscalator;
  const escalatorName = isEscalator ? spaceData.details?.escalatorName : "";

  const isTimer = spaceData.type === "timer";

  const hasWeapon = spaceData.type === "weapon";
  const weaponColor = hasWeapon ? (spaceData.details as WeaponSpace).color : "";

  const isExit = spaceData.type === "exit";
  const exitColor = isExit ? (spaceData.details as ExitSpace).color : "";

  const [showTeleport, setShowTeleport] = useState(false)
  const [showEscalator, setShowEscalator] = useState(false);

  useEffect(() => {
    (async () => {
      if (!isTeleporter) return;
      if (highlightTeleporter === teleporterColor) {
        let isOccupied = false;
        const docSnap = await getDoc(doc(gamesRef, gameState.roomId));
        if (docSnap.exists()) {
          const pawn: any = Object.values(docSnap.data().pawns).find((pawn: any) => pawn.color === teleporterColor)
          if (pawn.gridPosition[0] === gridPosition[0] && pawn.gridPosition[1] === gridPosition[1]) {
            if (pawn.position[0] === spacePosition[0] && pawn.position[1] === spacePosition[1]) {
              isOccupied = true;
            }
          }
        }
        setShowTeleport(!isOccupied)
      }
      else {
        setShowTeleport(false)
      }
    })()
  }, [highlightTeleporter])


  useEffect(() => {
    (async () => {
      if (!isEscalator) return;
      console.log("should only be for spaces that are escalators", spaceData)
      if (highlightEscalator.length) {
        const escalator = highlightEscalator.find(escalator => escalator.escalatorName === escalatorName);
        if (escalator && escalator.gridPosition && escalator.position && escalator.escalatorName) {
          if (escalator.gridPosition[0] === gridPosition[0] && escalator.gridPosition[1] === gridPosition[1]) {
            if (escalator.position[0] !== spacePosition[0] || escalator.position[1] !== spacePosition[1]) {
              if (escalator.escalatorName === escalatorName) {
                let isOccupied = false;
                const docSnap = await getDoc(doc(gamesRef, gameState.roomId));
                if (docSnap.exists()) {
                  isOccupied = Object.values(docSnap.data().pawns).some((pawn: any) => {
                    if (pawn.gridPosition[0] === gridPosition[0] && pawn.gridPosition[1] === gridPosition[1]) {
                      if (pawn.position[0] === spacePosition[0] && pawn.position[1] === spacePosition[1]) {
                        return true;
                      }
                    }
                    return false
                  })
                }
                setShowEscalator(!isOccupied)
              }
            }
          }
        }
      }
      else {
        setShowEscalator(false)
      }
    })()
  }, [highlightEscalator])

  // add into movePawn click, if space is timer, pause timer!
  const movePawn = async () => {
    const docSnap = await getDoc(doc(gamesRef, gameState.roomId));

    if (docSnap.exists()) {
      const newRoomValue = {...docSnap.data()}

      if (newRoomValue && newRoomValue.pawns) {
        if (!colorSelected) return;
        newRoomValue.pawns[colorSelected].position = spacePosition;
        newRoomValue.pawns[colorSelected].gridPosition = gridPosition;
        newRoomValue.pawns[colorSelected].playerHeld = null;
        newRoomValue.pawns[colorSelected].blockedPositions = {
          up: {position: null, gridPosition: null},
          down: {position: null, gridPosition: null},
          right: {position: null, gridPosition: null},
          left: {position: null, gridPosition: null},
        };
        if (isTimer && !(spaceData.details as TimerSpace).isDisabled) {
          // pause and update db with pause
          if (gameState.timerRunning) {
            gameDispatch({type: "toggleTimer", value: !gameState.timerRunning})
            newRoomValue.tiles[tileIndex].spaces[spacePosition[1]][spacePosition[0]].details.isDisabled = true;
          }
        }

        if (hasWeapon && !(spaceData.details as WeaponSpace).weaponStolen && (spaceData.details as WeaponSpace).color === colorSelected) {
          newRoomValue.tiles[tileIndex].spaces[spacePosition[1]][spacePosition[0]].details.weaponStolen = true;
          newRoomValue.weaponsStolen = [...newRoomValue.weaponsStolen, colorSelected]
        }

        if (isExit && !(spaceData.details as ExitSpace).color && (spaceData.details as ExitSpace).color === colorSelected) {
          if (newRoomValue.weaponsStolen.length === 4) {
            newRoomValue.heroesEscaped = [...newRoomValue.heroesEscaped, colorSelected]
          }
        }

        await setDoc(
          gamesRef.doc(gameState.roomId), 
          {
            pawns: newRoomValue.pawns, 
            tiles: newRoomValue.tiles,
            weaponsStolen: newRoomValue.weaponsStolen,
            heroesEscaped: newRoomValue.heroesEscaped
          },
          {merge: true}
        )
        playerDispatch({type: "showMovableSpaces", value: []})
        playerDispatch({type: "showTeleportSpaces", color: null})
        playerDispatch({type: "showEscalatorSpaces", value: []})
      }
    }
  }

  // const isTeleporterOccupied = async () => {
  //   const docSnap = await getDoc(doc(gamesRef, gameState.roomId));
  //   let spaceOccupied = false;

  //   if (docSnap.exists()) {
  //     Object.values(docSnap.data().pawns).some((pawn: any) => {
  //       if (pawn.gridPosition[0] === gridPosition[0] && pawn.gridPosition[1] === gridPosition[1]) {
  //         if (pawn.position[0] === spacePosition[0] && pawn.position[1] === spacePosition[1]) {
  //           return true;
  //         }
  //       }
  //       return false;
  //     })
  //   }
  //   return spaceOccupied;
  // }

  return (
    <div 
      className={`space ${showMovableArea ? "active" : ""} ${showTeleport ? "teleporter" : ""} ${showEscalator ? "escalator" : ""}`}
      onClick={showMovableArea || showTeleport || showEscalator ? movePawn : () => {}}
    >
      <div className={teleporterColor}></div>
      {console.log("re rendering space")}
    </div>
  )
}

export default Space
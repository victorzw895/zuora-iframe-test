import React from 'react';
import { useGame } from '../Contexts/GameContext';
import { Space as SpaceType, heroColor } from '../types';
import { setDoc } from "firebase/firestore"; 
import { firestore } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'

interface SpaceProps {
  spaceData: SpaceType,
  showMovableArea: any,
  spacePosition: number[],
  colorSelected: heroColor | null,
  gridPosition: number[]
}

const Space = ({spaceData, showMovableArea, spacePosition, colorSelected, gridPosition}: SpaceProps) => {
  const { gameState, gameDispatch } = useGame();

  const gamesRef = firestore.collection('games')

  const [room] = useDocumentData(gamesRef.doc(gameState.roomId));

  const movePawn = async () => {
    const newRoomValue = {...room};
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
      await setDoc(
        gamesRef.doc(gameState.roomId), 
        {pawns: newRoomValue.pawns},
        {merge: true}
      )
    }
  }

  return (
    <div 
      className={`space ${showMovableArea ? "active" : ""}`}
      onClick={showMovableArea ? movePawn : () => {}}
    >
      {/* {console.log("rendering spaces")} */}
      <div></div>
    </div>
  )
}

export default Space
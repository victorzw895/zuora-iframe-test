import React, { useEffect, useState } from 'react';
import { usePawn } from '../Contexts/PawnContext';
import { useGame } from '../Contexts/GameContext';
import { usePlayer } from '../Contexts/PlayerContext';
import { Space as SpaceType, heroColor } from '../types';
import { collection, getDoc, query, where, setDoc, doc, DocumentReference, DocumentData } from "firebase/firestore"; 
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
  const { pawnState, pawnDispatch } = usePawn();
  const { playerState, playerDispatch } = usePlayer();
  const { gameState, gameDispatch } = useGame();

  const gamesRef = firestore.collection('games')

  const [room] = useDocumentData(gamesRef.doc(gameState.roomId));

  useEffect(() => {
    if (pawnState.green.playerHeld) {
    }
  }, [pawnState])

  useEffect(() => {
  }, [spaceData])

  const movePawn = async () => {
    const newPawnPosition = {...pawnState};
    const newRoomValue = {...room};
    // 
    // if (playerState.playerPawnHeld === colorSelected) {

    // }
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
    // newPawnPosition[colorSelected].position = spacePosition;
    // newPawnPosition[colorSelected].gridPosition = gridPosition;
    // pawnDispatch({type: "movePawn", value: spacePosition, color: colorSelected})    
    // pawnDispatch({type: "playerHeld", value: null, color: colorSelected})    
    // update firebase reset playerHeld to null
  }

  return (
    <div 
      className={`space ${showMovableArea ? "active" : ""}`}
      onClick={showMovableArea ? movePawn : () => {}}
    ></div>
  )
}

export default Space
import React, { useEffect, useState } from 'react';
import { usePawn } from '../Contexts/PawnContext';
import { usePlayer } from '../Contexts/PlayerContext';
import { Space as SpaceType, heroColor } from '../types';

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

  useEffect(() => {
    if (pawnState.green.playerHeld) {
    }
  }, [pawnState])

  useEffect(() => {
  }, [spaceData])

  const movePawn = () => {
    const newPawnPosition = {...pawnState};
    // 
    // if (playerState.playerPawnHeld === colorSelected) {

    // }
    if (!colorSelected) return;
    newPawnPosition[colorSelected].position = spacePosition;
    newPawnPosition[colorSelected].gridPosition = gridPosition;
    pawnDispatch({type: "movePawn", value: spacePosition, color: colorSelected})    
    pawnDispatch({type: "playerHeld", value: null, color: colorSelected})    
  }

  return (
    <div 
      className={`space ${showMovableArea ? "active" : ""}`}
      onClick={showMovableArea ? movePawn : () => {}}
    ></div>
  )
}

export default Space
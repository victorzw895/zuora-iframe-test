import React, { useEffect, useState, MouseEvent } from 'react';
import { heroName, heroColor, heroWeapon, HeroPawn } from '../../types';
import { tileWallSize, spaceSize } from '../../constants';
import { usePawn, PawnState } from '../../Contexts/PawnContext';

const PawnFactory = (color: heroColor, startPosition: number[]) => {
  console.log('pawn factory', color, startPosition);
  let heroName, weapon;
  switch (color) {
    case 'yellow':
      heroName = 'Barbarian'
      weapon = 'sword'
      break;
    case 'purple':
      heroName = 'Mage'
      weapon = 'vial'
      break;
    case 'green':
      heroName = 'Elf'
      weapon = 'bow'
      break;
    case 'orange':
      heroName = 'Dwarf'
      weapon = 'axe'
      break;
    default:
      break;
  }

  return {
    heroName: heroName as heroName,
    color,
    height: 46.25,
    width: 46.25,
    weapon: weapon as heroWeapon,
    playerHeld: null,
    position: startPosition,
    ability: '',
    canUseAbility: false,
    move: () => {},
    useAbility: () => {},
    stealWeapon: () => {},
    escape: () => {return false}
  }
}

interface pawnProps {
  color: heroColor,
  position: number[]
}

const Pawn = ({color, position}: pawnProps) => {
  const {pawnState, pawnDispatch} = usePawn();
  // const [pawn, setPawn] = useState<HeroPawn>(PawnFactory(color, position));
  const pawn = pawnState[color as keyof PawnState];

  const _handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (pawn.playerHeld) {
      pawnDispatch({type: "playerHeld", value: null, color})
    }
    else {
      pawnDispatch({type: "playerHeld", value: 1, color})
    }
  }

  const getDisplacementValue = (positionValue: number) => {
    return tileWallSize - ((Math.abs(8 - positionValue) * 2) * spaceSize)
  }

  return (
    <div className="pawn-grid"
      style={{
        gridColumnStart: pawn.gridPosition[0],
        gridRowStart: pawn.gridPosition[1],
        marginTop: pawn.gridPosition[0] < 8 ? getDisplacementValue(pawn.gridPosition[0]) : tileWallSize,
        marginBottom: pawn.gridPosition[0] > 8 ? getDisplacementValue(pawn.gridPosition[0]) : tileWallSize,
        marginLeft: pawn.gridPosition[1] > 8 ? getDisplacementValue(pawn.gridPosition[1]) : tileWallSize,
        marginRight: pawn.gridPosition[1] < 8 ? getDisplacementValue(pawn.gridPosition[1]) : tileWallSize,
        placeSelf: "center",
        position: "static"
      }}>
      <div className={`pawn ${color}`} onClick={_handleClick}
        style={{
          // left: `${(pawn.position[0] * pawn.width) + tileWallSize + ((8 - pawn.gridPosition[1]) * pawn.width)}px`,
          // top: `${(pawn.position[1] * pawn.height) + tileWallSize + ((pawn.gridPosition[0] - 8) * pawn.height)}px`,
          gridColumnStart: pawn.position[0] + 1,
          gridRowStart: pawn.position[1] + 1,
          position: "relative"
        }}
      >
        <img 
          draggable={false}
          src={`/${color}-pawn.svg`} 
          alt={`${color}-piece`} 
          style={{border: `${pawn.playerHeld ? "2px solid blue" : ""}`}}/>
      </div>
    </div>
  )
}

export default Pawn;
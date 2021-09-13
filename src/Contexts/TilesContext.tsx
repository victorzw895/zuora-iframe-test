import React, { createContext, useContext, useReducer } from 'react';
import { HeroPawn, heroName, heroWeapon, heroColor, TileInterface, direction, Space } from '../types';

import { allTiles } from '../Data/all-tiles-data';


type Action = {type: 'initTile', value: TileInterface} | 
              {type: 'addTile', value: TileInterface} | undefined;
type Dispatch = (action: Action) => void;

type TilesProviderProps = {children: React.ReactNode}

const tilesInitialState: TileInterface[] = []

const TilesContext = createContext<{tilesState: TileInterface[]; tilesDispatch: Dispatch} | undefined>(undefined);

type directionValuesType = {
  up: number,
  right: number,
  down: number,
  left: number
}

const directionValue: directionValuesType = {
  up: 0,
  right: 90,
  down: 180,
  left: 270
}

const availableTiles = [2,3,4,5,6,7,8,9,10,11,12];

availableTiles.sort(() => 0.5 - Math.random());

const calculateRotation = (placementDirection: direction, entryDirection: direction) => {
  let placementDirectionValue = directionValue[placementDirection];
  let entrySideValue = directionValue[entryDirection];

  console.log("placement Direction", placementDirection, directionValue[placementDirection])
  console.log("entry direction", entryDirection, directionValue[entryDirection])
  console.log(placementDirectionValue - entrySideValue)

  const rotationValue = placementDirectionValue - entrySideValue;
  if (rotationValue === -90) {
    return 270;
  }
  else if (rotationValue === -270) {
    return 90;
  }
  else return Math.abs(placementDirectionValue - entrySideValue);
}

const rotate = (matrix: any) => {          // function statement
  const N = matrix.length - 1;   // use a constant
  // use arrow functions and nested map;
  const result = matrix.map((row: any, i: any) => 
        row.map((val: any, j: any) => matrix[N - j][i])
  );
  matrix.length = 0;       // hold original array reference
  matrix.push(...result);  // Spread operator
  return matrix;
}

const updateSideWalls = (spaces: Space[][], rotationValue: number) => {
  console.log("updating sidewalls");
  const newSpaces = [...spaces];
  return newSpaces.map((row, rowIndex) => row.map((col, colIndex) => 
    {
      if (col.details && col.details.sideWalls) {
        let updatedSideWalls = col.details.sideWalls.map(
          sideWall => {
            let updatedValue = directionValue[sideWall] + rotationValue;
            if (updatedValue >= 360) {
              updatedValue = updatedValue - 360;
            }
            return Object.keys(directionValue).find(key => directionValue[key as direction] === updatedValue) as direction;
          }
        )
        col.details.sideWalls = updatedSideWalls;
      }
      return col;
    }
  ))
}

const tilesReducer = (tilesState: TileInterface[], action: any) => {

  switch (action.type) {
    case 'initTile': {
      return [...tilesState, {...action.value, gridPosition: [8, 8]}];
    }
    case 'addTile': {
      const newId = availableTiles.pop();
      const tile = allTiles.find(tile => tile.id === newId?.toString()) as TileInterface;
      if (!tile) return [...tilesState];
      const { gridPosition, placementDirection} = action.value
      const newTile: TileInterface = {...tile, gridPosition, placementDirection};
      const tileSpaces = [...newTile.spaces!]
      const rotationValue = calculateRotation(newTile.placementDirection!, newTile.entryDirection!);

      switch (rotationValue) {
        case 90:
          rotate(tileSpaces);
          updateSideWalls(tileSpaces, rotationValue);
          break; 
        case 180:
          rotate(tileSpaces);
          rotate(tileSpaces);
          updateSideWalls(tileSpaces, rotationValue);
          break;
        case 270:
          rotate(tileSpaces);
          rotate(tileSpaces);
          rotate(tileSpaces);
          updateSideWalls(tileSpaces, rotationValue);
          break;
        default:
          break;
      }
      
      return [...tilesState, {...newTile, rotation: rotationValue, spaces: tileSpaces}];
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const TilesProvider = ({children}: TilesProviderProps) => {

  const [tilesState, tilesDispatch] = useReducer(tilesReducer, tilesInitialState);
  const value = {tilesState, tilesDispatch};

  return <TilesContext.Provider value={value}>{children}</TilesContext.Provider>
}

const useTiles = () => {
  const context = useContext(TilesContext)
  if (context === undefined) {
    throw new Error('useTiles must be used within a TilesProvider');
  }
  return context;
}

export { TilesProvider, useTiles };
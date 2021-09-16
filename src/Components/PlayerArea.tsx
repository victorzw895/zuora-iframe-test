import React, { MouseEvent, Dispatch, SetStateAction } from 'react';

interface PlayerAreaProps {
  // playTile: (id: string, position: number) => void,
  highlightNewTileArea: () => void
}

const PlayerArea = ({highlightNewTileArea} : PlayerAreaProps) => {
  // const placeNewTile = (e: MouseEvent<HTMLButtonElement>) => {
  //   const position = 3;
  //   playTile("4", position);
  // }

  return (
    <div className="player-area">
      {/* <button onClick={(e) => placeNewTile(e)}>Add Tile</button> */}
      <button onClick={() => highlightNewTileArea()}>Add Tile</button>
    </div>
  )
}

export default PlayerArea;
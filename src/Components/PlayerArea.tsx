import React, { MouseEvent, Dispatch, SetStateAction } from 'react';

interface PlayerAreaProps {
  highlightNewTileArea: () => void
}

const PlayerArea = ({highlightNewTileArea} : PlayerAreaProps) => {

  return (
    <div className="player-area">
      <button onClick={() => highlightNewTileArea()}>Add Tile</button>
    </div>
  )
}

export default PlayerArea;
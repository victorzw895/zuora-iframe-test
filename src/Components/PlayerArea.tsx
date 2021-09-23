import React, { useEffect } from 'react';
import { useGame } from '../Contexts/GameContext';
import { usePlayer } from '../Contexts/PlayerContext';
import { firestore } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'

interface PlayerAreaProps {
  highlightNewTileArea: () => void
}

const PlayerArea = ({highlightNewTileArea} : PlayerAreaProps) => {
  const { gameState, gameDispatch } = useGame();
  const { playerState, playerDispatch } = usePlayer();

  const gamesRef = firestore.collection('games')

  const [room] = useDocumentData(gamesRef.doc(gameState.roomId));

  const _handleContinueGame = () => {
    gameDispatch({type: "toggleTimer", value: !gameState.timerRunning})
  }

  return (
    <div className="player-area">
      {
        room ?
          <>
            { room.players.find((player: any) => player.number === playerState.number)?.playerDirections.map((direction: any) => {
                return <div key={direction}>{direction}</div>
              })
            }
            {
              room.players.find((player: any) => player.number === playerState.number)?.playerAbilities.map((ability: any) => {
                if (ability === "explore") {
                  return <button key={ability} onClick={() => highlightNewTileArea()}>Add Tile</button>
                }
                else if (ability === "teleport") {
                  return <div key={ability}>Teleport</div>
                }
                else {
                  return <div key={ability}>Escalator</div>
                }
              })
            }
            {
              (!gameState.timerRunning) &&
              <div className="game-paused">
                <p>Timer has been hit! Time left remaining:
                  <span>{gameState.minutesLeft}</span>:
                  <span>{gameState.secondsLeft.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}</span>
                </p>
                <button onClick={_handleContinueGame}>Continue</button>
              </div>
            }
            {
               gameState.gameOver && 
               <div className="game-paused">
                <p>Game Over</p>
              </div>
            }
            {/* {console.log("rendering player area")} */}
          </>
            :
          <>
          </>
      }
    </div>
  )
}

export default PlayerArea;
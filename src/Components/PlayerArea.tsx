import React, { MouseEvent, Dispatch, SetStateAction, useEffect } from 'react';
import { useGame } from '../Contexts/GameContext';
import { usePlayer } from '../Contexts/PlayerContext';
import { collection, getDoc, query, where, setDoc, doc, DocumentReference, DocumentData } from "firebase/firestore"; 
import { firestore } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'

interface PlayerAreaProps {
  highlightNewTileArea: () => void
}

const PlayerArea = ({highlightNewTileArea} : PlayerAreaProps) => {
  const { gameState, gameDispatch } = useGame();
  const { playerState, playerDispatch } = usePlayer();
  // const [ playerActions, setPlayerActions] = useState();

  const gamesRef = firestore.collection('games')

  const [room] = useDocumentData(gamesRef.doc(gameState.roomId));

  // useEffect(() => {
  //   const currentPlayer = room?.players?.find((player: any) => player.number === playerState.number);
  //   console.log("room", room, currentPlayer)
  //   if (currentPlayer) {
  //     playerDispatch({type: "setPlayer", value: currentPlayer});
  //   }
  // }, [room])

  useEffect(() => {
    console.log(room);
  }, [room])

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
          </>
            :
          <>
          </>
      }
    </div>
  )
}

export default PlayerArea;
import React, { useEffect, useState } from 'react';
import Board from './Components/Board';
import './App.css';
import { PawnProvider } from './Contexts/PawnContext';
import { PlayerProvider } from './Contexts/PlayerContext';
import { TilesProvider } from './Contexts/TilesContext';
import { GameProvider, useGame } from './Contexts/GameContext';
import Lobby from './Components/Lobby';
import { collection, getDoc, query, where, setDoc, doc, DocumentReference, DocumentData } from "firebase/firestore"; 
import { firestore } from "./Firestore";
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'

function App() {
  const { gameState, gameDispatch } = useGame();
  const gamesRef = firestore.collection('games')

  const [gameDoc, setGameDoc] = useState(null);

  const [currentGame] = useDocumentData(gameDoc);

  useEffect(() => {
    if (gameState.roomId) {
      setGameDoc(gamesRef.doc(gameState.roomId))
    }
  }, [gameState.roomId])

  return (
    <div className="MMApp">
      <PlayerProvider>
        <TilesProvider>
          <PawnProvider>
            {
              gameState.roomId && currentGame && currentGame.gameStarted ? 
              <Board />
                : 
              <Lobby />
            }
          </PawnProvider>
        </TilesProvider>
      </PlayerProvider>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import Board from './Components/Board';
import './App.css';
import { PawnProvider } from './Contexts/PawnContext';
import { PlayerProvider } from './Contexts/PlayerContext';
import { TilesProvider } from './Contexts/TilesContext';
import { GameProvider, useGame } from './Contexts/GameContext';
import Lobby from './Components/Lobby';

function App() {
  const { gameState, gameDispatch } = useGame();
  
  return (
    <div className="MMApp">
      <PlayerProvider>
        <TilesProvider>
          <PawnProvider>
            {
              !gameState.gameStarted ? 
                <Lobby />
                  : 
                <Board />
            }
          </PawnProvider>
        </TilesProvider>
      </PlayerProvider>
    </div>
  );
}

export default App;

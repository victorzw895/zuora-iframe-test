import React, { useState, ChangeEvent } from 'react';
import cryptoRandomString from 'crypto-random-string';
import { useGame } from '../Contexts/GameContext';
import { usePlayer } from '../Contexts/PlayerContext';
import { setConstantValue } from 'typescript';
import { Game } from '../types';
import { Stack, Button, TextField, List, ListItem, Paper } from '@mui/material';

interface LobbyProps {
}

const Lobby = ({}: LobbyProps) => {
  const { gameState, gameDispatch } = useGame();
  const { playerState, playerDispatch } = usePlayer();
  const [playerName, setPlayerName] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [promptCode, setPromptCode] = useState(false);
  const [existingRoomCode, setExistingRoomCode] = useState("");

  const createNewGame = () => {
    const newGameCode = cryptoRandomString({length: 5, type: 'distinguishable'});
    setIsHost(true);
    gameDispatch({type: "createRoom", value: newGameCode, playerName});
  }

  const startGame = () => {
    gameDispatch({type: "startGame"})
  }

  const _handleRoomCode = (e: ChangeEvent<HTMLInputElement>) => {
    setExistingRoomCode(e.target.value)
  }

  const _handleNameInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value)
  }

  const joinRoom = () => {
    // Find Room on database using existingRoomCode
    // fetch, value: roomCode
    const roomFound: Game = {
      roomId: "roomCode from database",
      players: [
        {
          name: "victor",
          number: 1,
          playerDirections: [],
          playerPawnHeld: null,
          playerAbilities: [],
          pingPlayer: null,
        },
        {
          name: "bob",
          number: 2,
          playerDirections: [],
          playerPawnHeld: null,
          playerAbilities: [],
          pingPlayer: null,
        },
        {
          name: "Yue",
          number: 3,
          playerDirections: [],
          playerPawnHeld: null,
          playerAbilities: [],
          pingPlayer: null,
        },
      ],
      gameStarted: false
    }

    // if found
    if (roomFound && !roomFound.gameStarted && roomFound.players.length <= 8) {
      gameDispatch({type: "joinRoom", value: roomFound, playerName});
    }
    
    // else if not found
  }

  return (
    <header className="App-header">
      <h3>
        Welcome to Magic Maze.
      </h3>
      
      {gameState.roomId ?
        <>
          <h4 className="lobby-code">CODE: {gameState.roomId}</h4>
          {gameState.players.length && 
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: '#63B0CD' }}>
              {
                gameState.players.map(player => {
                  return <ListItem key={player.number}>{`${player.number}  ${player.name}`}</ListItem>
                })
              }
              {isHost && 
                <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0"}}>
                  <Button variant="contained" size="small" disableElevation onClick={startGame}>Start Game</Button>
                </Stack>
              }
            </List>
          }
        </>
          :
        <Paper className="lobby-actions" sx={{ width: '100%', maxWidth: 360, bgcolor: '#63B0CD' }}>
          {
            promptCode ? 
              <div>
                <TextField margin="normal" size="small" type="text" variant="filled" label="Enter Room Code" onChange={_handleRoomCode} value={existingRoomCode}></TextField>
                <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0"}}>
                  <Button variant="contained" size="small" disableElevation onClick={joinRoom}>Join</Button>
                </Stack>
              </div>
                :
              <>
                <TextField margin="normal" label="Name" size="small" type="text" variant="filled" onChange={_handleNameInput} value={playerName}></TextField>
                <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0"}}>
                  <Button variant="contained" size="small" disableElevation disabled={playerName.length < 2} onClick={createNewGame}>Create Lobby</Button>
                  <Button variant="contained" size="small" disableElevation disabled={playerName.length < 2} onClick={() => setPromptCode(true)}>Join Lobby</Button>
                </Stack>
              </>
          }
        </Paper>
      }
    </header>
  )
}

export default Lobby
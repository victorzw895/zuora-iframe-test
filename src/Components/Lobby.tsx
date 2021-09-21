import React, { useState, ChangeEvent, useEffect } from 'react';
import cryptoRandomString from 'crypto-random-string';
import { useGame, PlayerFactory, assignRandomActions } from '../Contexts/GameContext';
import { usePlayer } from '../Contexts/PlayerContext';
import { usePawn, pawnsInitialState } from '../Contexts/PawnContext';
import { Game, playerNumber } from '../types';
import { Stack, Button, TextField, List, ListItem, Paper, Alert } from '@mui/material';
import { collection, getDoc, query, where, setDoc, doc, DocumentReference, DocumentData } from "firebase/firestore"; 
import { firestore } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { tile1a } from '../Data/tile1a';

interface LobbyProps {
}

const Lobby = ({}: LobbyProps) => {
  const { gameState, gameDispatch } = useGame();
  const { playerState, playerDispatch } = usePlayer();
  const [playerName, setPlayerName] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [promptCode, setPromptCode] = useState(false);
  const [existingRoomCode, setExistingRoomCode] = useState("");
  const [failJoinRoomMessage, setFailJoinRoomMessage] = useState("");

  const gamesRef = firestore.collection('games')

  const [gameDoc, setGameDoc] = useState<any>(null);

  const [room] = useDocumentData(gameDoc);

  const createNewGame = async () => {
    const newGameCode = cryptoRandomString({length: 5, type: 'distinguishable'});
    setIsHost(true);
    gameDispatch({type: "joinRoom", value: newGameCode, playerName});
    const newPlayer = PlayerFactory(playerName, 0)
    playerDispatch({type: "setPlayer", value: newPlayer});
    await setDoc(gamesRef.doc(newGameCode), {
      players: [newPlayer],
      gameStarted: false
      }
    )
    setGameDoc(gamesRef.doc(newGameCode))
  }

  const startGame = async () => {
    const players = assignRandomActions(room.players)
    // setInitialTile
    // setPawnPositions

    const initTile = {
      ...tile1a,
      gridPosition: [8, 8]
    }
    await setDoc(
      gamesRef.doc(gameState.roomId), 
      { 
        players, 
        gameStarted: true,
        tiles: [initTile],
        pawns: pawnsInitialState
      },
      {merge: true}
    )
  }

  const _handleRoomCode = (e: ChangeEvent<HTMLInputElement>) => {
    setExistingRoomCode(e.target.value)
  }

  const _handleNameInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value)
  }

  const joinRoom = async () => {
    const gamesDocRef = gamesRef.doc(existingRoomCode)
    const docSnap = await getDoc(gamesDocRef);

    let roomFound;

    if (docSnap.exists()) {
      roomFound = docSnap.data();
      setGameDoc(gamesDocRef)
    }

    // if found
    if (roomFound && !roomFound.gameStarted && roomFound.players.length <= 8) {
      const newPlayer = PlayerFactory(playerName, roomFound.players.length);
      const playersInRoom = [
        ...roomFound.players, 
        newPlayer
      ];
      gameDispatch({type: "joinRoom", value: existingRoomCode, playerName});
      playerDispatch({type: "setPlayer", value: newPlayer});
      await setDoc(gamesRef.doc(existingRoomCode), 
        {players: playersInRoom},
        {merge: true}
      )
    }
    else if (!roomFound) {
      setFailJoinRoomMessage("Room code not found");
    }
    else if (roomFound.gameStarted) {
      setFailJoinRoomMessage("Game has already started");
    }
    else if (roomFound.players.length > 8) {
      setFailJoinRoomMessage("Game Lobby full");
    }
  }

  return (
    <header className="App-header">
      <h3>
        Welcome to Magic Maze.
      </h3>
      
      {gameState.roomId ?
        <>
          <h4 className="lobby-code">CODE: {gameState.roomId}</h4>
          {room?.players?.length && 
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: '#63B0CD' }}>
              {
                room?.players?.map((player: any) => {
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
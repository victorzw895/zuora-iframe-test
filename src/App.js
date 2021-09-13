import logo from './logo.svg';
import Board from './Components/Board';
import './App.css';
import { PawnProvider } from './Contexts/PawnContext';
import { PlayerProvider } from './Contexts/PlayerContext';
import { TilesProvider } from './Contexts/TilesContext';

function App() {
  return (
    <div className="MMApp">
      {/* <header className="App-header">
        <p>
          Welcome to Magic Maze.
        </p>
        <p>
          Click <span>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a> 
          </span> to Get Started
        </p>
        
      </header> */}
      <PlayerProvider>
        <TilesProvider>
          <PawnProvider>
            <Board/>
          </PawnProvider>
        </TilesProvider>
      </PlayerProvider>
    </div>
  );
}

export default App;

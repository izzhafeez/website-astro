import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import gamesData from '../../../data/games/games.json';
import Swal from 'sweetalert2';
import lifecycle from '../common/GameLifecycle';
import GameStart from '../common/GameStart';
import GameTitle from '../common/GameTitle';
import GameJoin from '../common/GameJoin';

const instructions = gamesData['midpoint-master'].heroText;

type PlayerData = {
  points: number;
  played_coordinate: [number, number];
  added_score: number;
  letter: string;
  acknowledged: boolean;
}

const coordinateAsString = (coordinate: number[]) => `(${coordinate[0]}, ${coordinate[1]})`;

function MidpointMaster({ id }: { id: string }) {
  const WS_URL = `${import.meta.env.PUBLIC_WS}/api/games/midpoint-master/${id}`;
  const [players, setPlayers] = React.useState({} as {[name: string]: PlayerData});
  const [name, setName] = React.useState('');
  const [gameStatus, setGameStatus] = React.useState('UNJOINED');
  const [coordinate, setCoordinate] = React.useState(null as null | [number, number]);
  const [midpoint, setMidpoint] = React.useState([0, 0]);
  const [playedGrid, setPlayedGrid] = React.useState([] as string[][][]);
  const [roundId, setRoundId] = React.useState(0);

  const { sendJsonMessage, lastMessage } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    share: true
  });

  useEffect(() => {
    if (!lastMessage) return;
    const message = JSON.parse(lastMessage.data);
    const method = message.method;
    console.log(message);

    // deep copy of message.players object
    if (message.players) setPlayers(_ => JSON.parse(JSON.stringify(message.players)));
    if (message.round_id) setRoundId(_ => message.round_id);
    if (message.played_grid) setPlayedGrid(_ => message.played_grid);

    if (method === 'connect') {
      lifecycle.handleConnect(setGameStatus);
    } else if (method === 'join') {
      if (gameStatus === 'UNJOINED') setGameStatus('JOINED');
    } else if (method === 'leave') {
      lifecycle.handleLeave(message.name === name, setGameStatus);
    } else if (method === 'start') {
      setGameStatus('PLAYING');
    } else if (method === 'next') {
      setGameStatus('PLAYING');
      setCoordinate([0, 0]);
      Swal.fire({
        icon: 'info',
        title: `Round ${message.round_id}!`,
        text: `Pick a cell!`,
        timer: 1500,
      })
    } else if (method === 'evaluate') {
      setGameStatus('EVALUATING');
      setMidpoint(_ => message.midpoint);
      const failedPlayers = message.failed_players;
      Swal.fire({
        icon: 'info',
        title: `The midpoint was ${coordinateAsString(message.midpoint)}!`,
        html: `<table class="w-full text-sm text-left rtl:text-right text-gray-700 mt-4">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" class="px-6 py-3">Player</th>
              <th scope="col" class="px-6 py-3">Guess</th>
              <th scope="col" class="px-6 py-3">Score</th>
            </tr>
          </thead>
          ${Object.entries(message.players as {[name: string]: PlayerData}).map(([name, playerData]) => `
            <tr class="bg-white border-b">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${name}</th>
              <td class="px-6 py-4 font-light">#${coordinateAsString(playerData.played_coordinate)}</td>
              <td class="px-6 py-4 font-light">${playerData.added_score}</td>
            </tr>
          `).join('')}
        </table>`
      }).then(() => {
        if (failedPlayers && failedPlayers.length > 0) {
          if (failedPlayers.includes(name)) {
            var audio = new Audio(`/sound/quizzes/haiya.mp3`);
            audio.play();
          }
          
          // notify that these players have played the same card, and lose 50 points
          Swal.fire({
            icon: 'warning',
            title: `Clash!`,
            text: `Players who played clashing cells lose 50 points: ${failedPlayers.join(', ')}`,
            timer: 5000,
          });
        }
      });
    } else if (method === 'end') {
      lifecycle.handleEndGame(message.winner, setGameStatus);
    } else if (method === 'connect_error') {
      lifecycle.handleConnectError(id, setGameStatus);
    } else if (method === 'join_error') {
      lifecycle.handleJoinError(message.message, setGameStatus);
    } else if (method === 'start_error') {
      lifecycle.handleStartError(message.message, setGameStatus);
    }
  }, [lastMessage]);

  const joinGame = () => {
    sendJsonMessage({ method: 'join', name })
    setGameStatus('JOINED');
  };

  const leaveGame = () => {
    sendJsonMessage({ method: 'leave', name });
    setGameStatus('UNJOINED');
  };

  const startGame = () => {
    sendJsonMessage({ method: 'start', deck_size: 100 });
    setGameStatus('PLAYING')
  };

  const submitGuess = () => {
    if (!coordinate) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please pick a cell!'
      });
    }
    Swal.fire({
      title: 'Waiting for other players...',
      didOpen: () => {
        Swal.showLoading();
      }
    })
    sendJsonMessage({ method: 'play', played_coordinate: coordinate, name: name });
    setGameStatus('PLAYED');
  }

  const acknowledge = () => {
    sendJsonMessage({ method: 'acknowledge', name });
    Swal.fire({
      icon: 'info',
      title: 'Waiting for other players to press ready...',
      didOpen: () => {
        Swal.showLoading();
      }
    })
  };

  const howToPlay = `Players each pick a cell below. Then, your score is calculated based on how close you are to the midpoint of all cells. But be warned, if you choose the same cell as another player, you will lose 50 points!`;

  return <>
    <div className="p-2 max-w-3xl mx-auto">
      {gameStatus !== 'UNJOINED' && <GameTitle title={"Midpoint Master"}/>}
      {gameStatus === 'JOINED' && <GameStart instructions={instructions} startGame={startGame}/>}
      {gameStatus === 'UNJOINED' && <GameJoin title={"Midpoint Master"} instructions={instructions} name={name} setName={setName} joinGame={joinGame}/>}

      {/* show all players */}
      {gameStatus !== 'UNJOINED' && <>
      <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Players</h3>
      <ul className="grid gap-2">
        {Object.entries(players).map(([playerName, playerData]) => (
          <li key={playerName} className="">
            <span className="text-white bg-dt-500 dark:bg-dt-300 dark:text-black rounded-md p-1 me-1">{playerName}{playerName === name && ' (you)'}{playerData.played_coordinate && gameStatus !== 'EVALUATING' && ' (played)'}{playerData.acknowledged && ' (ready)'}</span> {playerData.points} Points
          </li>
        ))}
        <li><span onClick={() => lifecycle.showHowToPlay(howToPlay)} className="bg-cc-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">How to Play</span></li>
        <li><span onClick={() => lifecycle.promptLeave(leaveGame)} className="bg-ns-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">Leave Game</span></li>
      </ul>
      </>}

      {gameStatus === 'PLAYING' && <div className="grid">
        {/* round counter */}
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2 mx-auto">Round {roundId}/10</h3>

        {/* submit guess */}
        <button onClick={submitGuess} className="my-2 mx-auto p-2 rounded-md bg-ew-500 hover:opacity-80 text-white">Select Cell</button>

        {/* grid of 10 x 10 cells for selecting coordinate */}
        <div className="grid grid-cols-10 gap-1 justify-self-center mt-4 mb-8">
          {Array.from({ length: 100 }).map((_, i) => {
            const x = i % 10;
            const y = Math.floor(i / 10);
            return <div key={i} onClick={
              () => {
                console.log(playedGrid[x][y])
                if (playedGrid[x][y].length > 0 && playedGrid[x][y][0] == 'AA') return;
                setCoordinate([x, y])
              }
            } className={`w-10 h-10 rounded-md ${
              playedGrid[x][y].length > 0 && playedGrid[x][y][0] == 'AA'
              ? 'bg-ns-500'
              : coordinate && coordinate[0] === x && coordinate[1] === y
              ? 'bg-cc-500'
              : 'bg-white dark:bg-gray-700'} cursor-pointer`}></div>
          })}
        </div>
      </div>}

      {/* played card */}
      {gameStatus === 'EVALUATING' && <>
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">The midpoint was {coordinateAsString(midpoint)}! Players guessed:</h3>
        <ul className="grid gap-2">
          {Object.entries(players).map(([name, playerData]) => (
          <li key={name} className={`list-none p-4 border-[1px] rounded-md bg-white/50 dark:bg-gray-700/50`}>
            {/* left side should be player name and color, right side should be the guessed color */}
            <div className="flex gap-2">
              <span className="my-auto">{name} played {playerData.letter}{coordinateAsString(playerData.played_coordinate)}</span>
              <span className="my-auto ms-auto">Score: {playerData.added_score}</span>
            </div>
          </li>))
          }
        </ul>

        {/* ready button */}
        <button onClick={acknowledge} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white my-4">Ready</button>

        {/* grid of what players played */}
        <div className="grid">
          <div className="grid grid-cols-10 gap-1 justify-self-center mb-8">
            {Array.from({ length: 100 }).map((_, i) => {
              const x = i % 10;
              const y = Math.floor(i / 10);
              return <div key={i} className={`w-10 h-10 rounded-md text-white text-center flex ${
                playedGrid[x][y].length > 0 && playedGrid[x][y][0] == 'AA'
                ? 'bg-ns-500'
                : playedGrid[x][y].length == 1
                ? 'bg-cc-500'
                : 'bg-white dark:bg-gray-700'}`}><span className="my-auto mx-auto">{playedGrid[x][y] && playedGrid[x][y][0] != 'AA' && playedGrid[x][y].join(", ")}</span></div>
            })}
          </div>
        </div>
      </>}
    </div>
  </>;
}

export default MidpointMaster;
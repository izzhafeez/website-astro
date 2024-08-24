import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import gamesData from '../../../data/games/games.json';
import Swal from 'sweetalert2';
import GameTitle from '../common/GameTitle';
import GameStart from '../common/GameStart';
import GameJoin from '../common/GameJoin';
import lifecycle from '../common/GameLifecycle';

const instructions = gamesData['color-guessr'].heroText;

type PlayerData = {
  points: number;
  played_color: string;
  added_score: number;
  acknowledged: boolean;
}

function ColorGuessr({ id }: { id: string }) {
  const WS_URL = `${import.meta.env.PUBLIC_WS}/api/games/color-guessr/${id}`;
  const [players, setPlayers] = React.useState({} as {[name: string]: PlayerData});
  const [name, setName] = React.useState('');
  const [gameStatus, setGameStatus] = React.useState('UNJOINED');
  const [color, setColor] = React.useState('');
  const [selectedColor, setSelectedColor] = React.useState('');
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
    if (message.color) setColor(_ => message.color);
    if (message.round_id) setRoundId(_ => message.round_id);

    if (method === 'connect') {
      lifecycle.handleConnect(setGameStatus);
    } else if (method === 'join') {
      setGameStatus('JOINED');
    } else if (method === 'leave') {
      lifecycle.handleLeave(message.name === name, setGameStatus);
    } else if (method === 'start') {
      setGameStatus('PLAYING');
    } else if (method === 'next') {
      setGameStatus('PLAYING');
      setSelectedColor('');
      Swal.fire({
        icon: 'info',
        title: `Round ${message.round_id}!`,
        text: `Guess that color!`,
        timer: 1500,
      })
    } else if (method === 'evaluate') {
      setGameStatus('EVALUATING');

      const playerScoredAbove95 = message.players[name].added_score > 95;
      if (playerScoredAbove95) {
        var audio = new Audio(`/sound/quizzes/fuiyoh.mp3`);
        audio.play();
      }

      Swal.fire({
        icon: 'info',
        title: `The color was #${color}!`,
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
              <td class="px-6 py-4 font-light">#${playerData.played_color}</td>
              <td class="px-6 py-4 font-light">${playerData.added_score}</td>
            </tr>
          `).join('')}
        </table>`
      })
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
  }

  const submitGuess = (e: any) => {
    e.preventDefault();
    if (!selectedColor) return;
    // validate hex code
    const removedHash = selectedColor.replace('#', '');
    if (!/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(removedHash)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Hex Code!',
        text: 'Please enter a valid hex code!'
      });
      return;
    }

    sendJsonMessage({ method: 'play', color: removedHash, name: name });
    setGameStatus('PLAYED');
    setSelectedColor('');
    lifecycle.showSubmitSwal();
  }

  const acknowledge = () => {
    sendJsonMessage({ method: 'acknowledge', name });
    lifecycle.showAcknowledgeSwal();
  };

  const howToPlay = `Based on the given color, guess the hex code of the color. The the number of points you get is based on how close you are to the actual color. The player with the most points at the end of the game wins!`;

  return <>
    <div className="p-2 max-w-3xl mx-auto">
      {gameStatus !== 'UNJOINED' && <GameTitle title={"Color Guessr"}/>}
      {gameStatus === 'JOINED' && <GameStart instructions={instructions} startGame={startGame}/>}
      {gameStatus === 'UNJOINED' && <GameJoin title={"Color Guessr"} instructions={instructions} name={name} setName={setName} joinGame={joinGame}/>}

      {/* show all players */}
      {gameStatus !== 'UNJOINED' && <>
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Players</h3>
        <ul className="grid gap-2">
          {Object.entries(players).map(([playerName, playerData]) => (
            <li key={playerName} className="">
              <span className="text-white bg-dt-500 dark:bg-dt-300 dark:text-black rounded-md p-1 me-1">{playerName}{playerName === name && ' (you)'}{playerData.played_color && gameStatus !== 'EVALUATING' && ' (played)'}{playerData.acknowledged && ' (ready)'}</span> {playerData.points} Points
            </li>
          ))}
          <li><span onClick={() => lifecycle.showHowToPlay(howToPlay)} className="bg-cc-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">How to Play</span></li>
          <li><span onClick={() => lifecycle.promptLeave(leaveGame)} className="bg-ns-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">Leave Game</span></li>
        </ul>
      </>}

      {gameStatus === 'PLAYING' && <>
        {/* round counter */}
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Round {roundId}/10</h3>

        {/* color to guess */}
        <div className="flex gap-2">
          <div className="w-20 h-20 rounded-md" style={{ backgroundColor: `#${color}` }}></div>
          <p className="my-auto">Guess the color!</p>
        </div>

        {/* input box for hex code */}
        <form onSubmit={submitGuess} className="my-4">
          <input
            autoFocus
            name="color"
            type="text"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            placeholder='Enter hex code...'
            className="transition duration-500 bg-white dark:bg-gray-700 rounded-md me-2"/>
          {/* submit guess */}
          <button onClick={submitGuess} className="my-2 p-2 rounded-md bg-ew-500 hover:opacity-80 text-white">Submit Guess</button>
        </form>
        </>}

      {/* played card */}
      {gameStatus === 'EVALUATING' && <>
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">The color was #{color}! Players guessed:</h3>
        <ul className="grid gap-2">
          {Object.entries(players).map(([name, playerData]) => (
          <li key={name} className={`list-none p-4 border-[1px] rounded-md bg-white/50 dark:bg-gray-700/50`}>
            {/* left side should be player name and color, right side should be the guessed color */}
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-md" style={{ backgroundColor: `#${color}` }}></div>
              <div className="w-10 h-10 rounded-md" style={{ backgroundColor: `#${playerData.played_color}` }}></div>
              <span className="my-auto">#{playerData.played_color} ({name})</span>
              <span className="my-auto ms-auto">Score: {playerData.added_score}</span>
            </div>
          </li>))
          }
        </ul>
      </>}

      {/* acknowledge */}
      {gameStatus === 'EVALUATING' && <>
        <button autoFocus onClick={acknowledge} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white my-2">Ready</button></>}
    </div>
  </>;
}

export default ColorGuessr;
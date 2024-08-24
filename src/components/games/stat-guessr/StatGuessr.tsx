import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import gamesData from '../../../data/games/games.json';
import Swal from 'sweetalert2';
import 'leaflet/dist/leaflet.css';
import lifecycle from '../common/GameLifecycle';
import GameStart from '../common/GameStart';
import GameTitle from '../common/GameTitle';
import GameJoin from '../common/GameJoin';

const instructions = gamesData['stat-guessr'].heroText;

type PlayerData = {
  points: number;
  guess: number;
  added_score: number;
  acknowledged: boolean;
}

function StatGuessr({ id, deck }: { id: string, deck: any }) {
  const WS_URL = `${import.meta.env.PUBLIC_WS}/api/games/stat-guessr/${id}`;
  const deckData = deck.data;
  const fields = Object.keys(deckData[0]);
  fields.shift(); // remove the name from the list of fields

  const [players, setPlayers] = React.useState({} as {[name: string]: PlayerData});
  const [name, setName] = React.useState('');
  const [gameStatus, setGameStatus] = React.useState('UNJOINED');
  const [value, setValue] = React.useState(null as number | null);
  const [guess, setGuess] = React.useState('');
  const [roundId, setRoundId] = React.useState(0);
  const [fieldId, setFieldId] = React.useState(-1 as number);
  const [itemId, setItemId] = React.useState(-1 as number);

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
    if (message.value !== undefined) setValue(_ => message.value);
    if (message.round_id !== undefined) setRoundId(_ => message.round_id);
    if (message.field_id !== undefined) setFieldId(_ => message.field_id);
    if (message.item_id !== undefined) setItemId(_ => message.item_id);

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
      setGuess('');
      Swal.fire({
        icon: 'info',
        title: `Round ${message.round_id}!`,
        text: `What is the ${fields[message.field_id]} of ${deckData[message.item_id].name}?`,
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
        title: `The value was ${message.value}!`,
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
              <td class="px-6 py-4 font-light">${playerData.guess}</td>
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
    sendJsonMessage({ method: 'join', name, field_count: fields.length, item_count: deckData.length });
    setGameStatus('JOINED');
  };

  const leaveGame = () => {
    sendJsonMessage({ method: 'leave', name });
    setGameStatus('UNJOINED');
  };

  const startGame = () => {
    sendJsonMessage({ method: 'start' });
    setGameStatus('PLAYING')
  }

  const submitGuess = (e: any) => {
    e.preventDefault();

    if (!guess) return;
    // validate guess must be number
    if (isNaN(parseFloat(guess))) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please make a numeric guess!'
      });
      return;
    }

    lifecycle.showSubmitSwal()
    sendJsonMessage({ method: 'play', guess: parseFloat(guess), name: name, value: deckData[itemId][fields[fieldId]] });
    setGuess('');
    setGameStatus('PLAYED');
  }

  const acknowledge = () => {
    sendJsonMessage({ method: 'acknowledge', name });
    lifecycle.showAcknowledgeSwal();
  };

  const howToPlay = "Guess the given statistic! Your score is calculated based on how close you are to the actual value. The player with the highest score at the end of 10 rounds wins!";

  return <>
    <div className="p-2 max-w-3xl mx-auto">
      {gameStatus !== 'UNJOINED' && <GameTitle title={deck.title}/>}
      {gameStatus === 'JOINED' && <GameStart instructions={instructions} startGame={startGame}/>}
      {gameStatus === 'UNJOINED' && <GameJoin title={deck.title} instructions={instructions} name={name} setName={setName} joinGame={joinGame}/>}

      {/* show all players */}
      {gameStatus !== 'UNJOINED' && <>
      <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Players</h3>
      <ul className="grid gap-2">
        {Object.entries(players).map(([playerName, playerData]) => (
          <li key={playerName} className="">
            <span className="text-white bg-dt-500 dark:bg-dt-300 dark:text-black rounded-md p-1 me-1">{playerName}{playerName === name && ' (you)'}{playerData.guess && gameStatus !== 'EVALUATING' && ' (played)'}{playerData.acknowledged && ' (ready)'}</span> {playerData.points} Points
          </li>
        ))}
        <li><span onClick={() => lifecycle.showHowToPlay(howToPlay)} className="bg-cc-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">How to Play</span></li>
        <li><span onClick={() => lifecycle.promptLeave(leaveGame)} className="bg-ns-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">Leave Game</span></li>
      </ul>
      </>}

      {gameStatus === 'PLAYING' && <>
        {/* round counter */}
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Round {roundId}/10: What's the {fields[fieldId]} of {deckData[itemId] ? deckData[itemId].name : ''}?</h3>

        {/* input box for frequency */}
        <form onSubmit={submitGuess} className="">
          <input
            autoFocus
            name="frequency"
            type="text"
            value={guess || ''}
            onChange={(e) => setGuess(e.target.value)}
            placeholder='Enter guess...'
            className="transition duration-500 bg-white dark:bg-gray-700 rounded-md me-2"/>
          <button onClick={submitGuess} className="my-2 p-2 rounded-md bg-cc-500 hover:opacity-80 text-white">Submit Guess</button>
        </form>
        </>}

      {/* played card */}
      {gameStatus === 'EVALUATING' && <>
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl mt-4">Round {roundId}/10: the "{fields[fieldId]}" of "{deckData[itemId].name}" was "{value}"!</h3>
        <ul className="grid gap-2 mt-4">
          {Object.entries(players).map(([name, playerData], index) => (
          <li key={name} className={`list-none p-4 border-[1px] rounded-md bg-white/50 dark:bg-gray-700/50`}>
            <div className="grid grid-cols-3 gap-2">
              <span className="my-auto">{name}</span>
              <span className="my-auto ms-auto">Guess: {playerData.guess}</span>
              <span className="my-auto ms-auto">Score: {playerData.added_score}</span>
            </div>
          </li>))
          }
        </ul>

        <button autoFocus onClick={acknowledge} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white my-4">Ready</button>
      </>}
    </div>
  </>;
}

export default StatGuessr;
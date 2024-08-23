import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import gamesData from '../../../data/games/games.json';
import Swal from 'sweetalert2';
import GameTitle from '../common/GameTitle';
import GameStart from '../common/GameStart';
import GameJoin from '../common/GameJoin';
import lifecycle from '../common/GameLifecycle';

const instructions = gamesData['data-hedger'].heroText;

type PlayerData = {
  points: number;
  guess: string;
  added_score: number;
  acknowledged: boolean;
}

function BlurryBattle({ id, deck, deckName }: { id: string, deck: any, deckName: string }) {
  const WS_URL = `${import.meta.env.PUBLIC_WS}/api/games/blurry-battle/${deckName}/${id}`;
  const deckData = deck.data;

  const [players, setPlayers] = React.useState({} as {[name: string]: PlayerData});
  const [name, setName] = React.useState('');
  const [gameStatus, setGameStatus] = React.useState('UNJOINED');
  const [answerId, setAnswerId] = React.useState(0);
  const [guess, setGuess] = React.useState('');
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

    if (message.players) setPlayers(_ => message.players);
    if (message.answer_id) setAnswerId(_ => message.answer_id);
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
      Swal.fire({
        icon: 'info',
        title: `Round ${message.round_id}!`,
        text: `Guess what the blurred text says!`,
        timer: 1500,
      })
    } else if (method === 'evaluate') {
      setGameStatus('EVALUATING');

      // check who played the same cards
      message.players[name].added_score

      Swal.fire({
        icon: 'info',
        title: `The answer was: ${deckData[answerId]}`,
        html: `
          <table class="w-full text-sm text-left rtl:text-right text-gray-700 mt-4">
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
          </table>
        `,
        timer: 5000,
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
    sendJsonMessage({ method: 'start', deck_size: deckData.length });
    setGameStatus('PLAYING')
  }

  const submitGuess = () => {
    sendJsonMessage({ method: 'play', guess, name: name, answer: deckData[answerId] });
    setGameStatus('PLAYED');
    lifecycle.showSubmitSwal();
  }

  const acknowledge = () => {
    sendJsonMessage({ method: 'acknowledge', name });
    lifecycle.showAcknowledgeSwal();
  };

  const howToPlay = `Try and guess what the blurred text says! If you get a perfect match, you get 2 points. If not, then you can get a maximum of 1 point based on how close you are to the answer. The player with the most points at the end of 10 rounds wins!`;

  const namesLength = deckData.map((name: string) => name.length).reduce((a: number, b: number) => a + b, 0);

  return <>
    <p className="fixed h-screen inset-0 overflow-clip font-mono transition duration-500 text-gray-200/50 dark:text-gray-700 px-2 text-center bg-gray-100 dark:bg-gray-800 w-full -z-10 text-wrap">
      {Array.from({ length: Math.floor(10000/namesLength) }, () => deckData.map((name: string) => name).join(' ')).join(' ')}
    </p>
    <div className="p-2 max-w-6xl mx-auto">
      {gameStatus !== 'UNJOINED' && <GameTitle title={deck.title}/>}
      {gameStatus === 'JOINED' && <GameStart instructions={instructions} startGame={startGame}/>}
      {gameStatus === 'UNJOINED' && <GameJoin title={deck.title} instructions={instructions} name={name} setName={setName} joinGame={joinGame}/>}

      {/* show all players */}
      {gameStatus !== 'UNJOINED' && <>
      <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Players</h3>
      <ul className="grid gap-2">
        {Object.entries(players).map(([playerName, playerData]) => (
          <li key={playerName} className="">
            <span className="text-white bg-dt-500 dark:bg-dt-300 dark:text-black rounded-md p-1 me-1">{playerName}{playerName === name && ' (you)'}{playerData.guess && ' (played)'}{playerData.acknowledged && ' (ready)'}</span> {playerData.points} Points
          </li>
        ))}
        <li><span onClick={() => lifecycle.showHowToPlay(howToPlay)} className="bg-cc-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">How to Play</span></li>
        <li><span onClick={() => lifecycle.promptLeave(leaveGame)} className="bg-ns-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">Leave Game</span></li>
      </ul>
      </>}

      {/* playing */}
      {(gameStatus === 'PLAYING' || gameStatus === 'EVALUATING') && <>
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Round {roundId}/10</h3>
      </>}

      {/* blurred answer */}
      {(gameStatus === 'PLAYING' || gameStatus === 'EVALUATING') && <>
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Guess what this says:</h3>
        <span className="dark:text-white p-2 my-4 rounded-md blur-md text-6xl">{deckData[answerId]}</span>
      </>}

      {/* guess */}
      {(gameStatus === 'PLAYING' || gameStatus === 'EVALUATING') && <>
        <br/>
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Your Guess:</h3>
        <input type="text" value={guess} onChange={e => setGuess(e.target.value)} className="p-2 rounded-md border-[1px] border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"/>
      </>}

      {/* play selected card */}
      {gameStatus === 'PLAYING' && <>
        <button onClick={submitGuess} className="my-2 p-2 rounded-md bg-ew-500 hover:opacity-80 text-white">Play Card</button>
      </>}

      {/* played card */}
      {gameStatus === 'EVALUATING' && <>
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Players played:</h3>
        <ul className="grid gap-2">
          {Object.entries(players).map(([name, playerData]) => (
          <li key={name} className={`list-none p-4 border-[1px] rounded-md bg-white/50 dark:bg-gray-700/50`}>
            <div className='flex w-full'>
              <h3 className={`flex text-xl font-bold text-dt-500`}>
                {name} guessed "{playerData.guess}"
              </h3>
              <span className="ms-auto my-auto">Score: {playerData.added_score}</span>
            </div>
          </li>))
          }
        </ul>
      </>}

      {/* acknowledge */}
      {gameStatus === 'EVALUATING' && <>
        <button onClick={acknowledge} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white my-2">Ready</button></>}
    </div>
  </>;
}

export default BlurryBattle;
import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import gamesData from '../../../data/games/games.json';
import Swal from 'sweetalert2';
import { capitalise } from '../../../utils/string';
import GameTitle from '../common/GameTitle';
import GameStart from '../common/GameStart';
import GameJoin from '../common/GameJoin';
import lifecycle from '../common/GameLifecycle';

const instructions = gamesData['data-hedger'].heroText;

type PlayerData = {
  points: number;
  played: { card_id: number, data: number[] };
  acknowledged: boolean;
}

type FieldWinnerData = {
  best_value: number;
  winners: string[];
}

function DataHedger({ id, deck, deckName }: { id: string, deck: any, deckName: string }) {
  const deckData = deck.data;
  const fields = Object.keys(deckData[0]);
  fields.shift(); // remove the name from the list of fields

  const [players, setPlayers] = React.useState({} as {[name: string]: PlayerData});
  const [name, setName] = React.useState('');
  const [gameStatus, setGameStatus] = React.useState('UNJOINED');
  const [options, setOptions] = React.useState([] as number[])
  const [selectedCard, setSelectedCard] = React.useState({} as number);
  const [roundId, setRoundId] = React.useState(0);
  const [isHigher, setIsHigher] = React.useState(false);
  const [winningValues, setWinningValues] = React.useState([] as number[]);

  const WS_URL = `${import.meta.env.PUBLIC_WS}/api/games/data-hedger/${deckName}+${id}/${deckData.length}`;
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
    if (message.options) setOptions(_ => message.options);
    if (message.round_id) setRoundId(_ => message.round_id);
    setIsHigher(_ => message.is_higher);

    if (method === 'connect') {
      lifecycle.handleConnect(setGameStatus);
    } else if (method === 'join') {
      if (message.game_state === 'lobby') setGameStatus('JOINED');
      if (message.game_state === 'start') setGameStatus('PLAYING');
    } else if (method === 'leave') {
      lifecycle.handleLeave(message.name === name, setGameStatus);
    } else if (method === 'start') {
      setGameStatus('PLAYING');
    } else if (method === 'next') {
      setGameStatus('PLAYING');
      console.log(isHigher);
      Swal.fire({
        icon: 'info',
        title: `Round ${message.round_id}!`,
        text: `${message.is_higher ? 'Highest' : 'Lowest'} card wins!`,
        timer: 1500,
      })
    } else if (method === 'evaluate') {
      setGameStatus('EVALUATING');

      // check who played the same cards
      const mostPopularCard = message.most_popular_card;
      const failedPlayers = message.failed_players;

      const winners: FieldWinnerData[] = message.winners;

      const entries = [];
      const newWinningValues = [];
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const fieldWinners = winners[i];
        newWinningValues.push(fieldWinners.best_value);
        entries.push({
          field: capitalise(field),
          value: fieldWinners.best_value,
          winners: fieldWinners.winners.join(', ')
        });
      }
      setWinningValues(newWinningValues);

      const playerWonAllFields = winners.every((fieldWinner) => fieldWinner.winners.includes(name));
      if (playerWonAllFields) {
        var audio = new Audio(`/sound/quizzes/fuiyoh.mp3`);
        audio.play();
      }

      Swal.fire({
        icon: 'info',
        title: `Winners of each field`,
        html: `
          <table class="w-full text-sm text-left rtl:text-right text-gray-700 mt-4">
            <thead class="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" class="px-6 py-3">Field</th>
                <th scope="col" class="px-6 py-3">Value</th>
                <th scope="col" class="px-6 py-3">Winners</th>
              </tr>
            </thead>
            ${entries.map((entry) => `
              <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${entry.field}</th>
                <td class="px-6 py-4 font-light">${entry.value}</td>
                <td class="px-6 py-4 font-light">${entry.winners}</td>
              </tr>
            `).join('')}
          </table>
        `,
        timer: 5000,
      }).then(() => {
        if (mostPopularCard != -1) {
          // notify that these players have played the same card, and lose 3 points
          if (failedPlayers.includes(name)) {
            var audio = new Audio(`/sound/quizzes/haiya.mp3`);
            audio.play();
          }

          Swal.fire({
            icon: 'warning',
            title: `Popular!`,
            text: `Players who played the most popular card lose 3 points: ${failedPlayers.join(', ')}`,
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
    const seed = Math.floor(Math.random() * 16777215);
    sendJsonMessage({ method: 'start', seed });
    setGameStatus('PLAYING')
  }

  const submitCard = () => {
    sendJsonMessage({ method: 'play', played: { card_id: selectedCard, data: Object.values(deckData[selectedCard]).slice(1) }, name: name });
    setGameStatus('PLAYED');
    lifecycle.showSubmitSwal();
  }

  const acknowledge = () => {
    sendJsonMessage({ method: 'acknowledge', name });
    lifecycle.showAcknowledgeSwal();
  };

  const fieldsString = fields.join(', ');
  const howToPlay = `Each card has a set of fields (${fieldsString}). Pick a card that will win the most fields! But be warned... if you make the most popular choice, you will lose 3 points!`;

  const names = deckData.map((card: {name: string}) => card.name).map((s: string, index: number) => <span className={options.includes(index) ? 'text-gray-500/30' : ''}>{s} </span>);
  const namesLength = deckData.map((card: {name: string}) => card.name.length).reduce((a: number, b: number) => a + b, 0);

  return <>
    <p className="fixed h-screen inset-0 overflow-clip font-mono transition duration-500 text-gray-200/50 dark:text-gray-700 px-2 text-center bg-gray-100 dark:bg-gray-800 w-full -z-10 text-wrap">
      {Array.from({length: Math.floor(10000/namesLength) }, () => names)}
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
            <span className="text-white bg-dt-500 dark:bg-dt-300 dark:text-black rounded-md p-1 me-1">{playerName}{playerName === name && ' (you)'}{playerData.played && ' (played)'}{playerData.acknowledged && ' (ready)'}</span> {playerData.points} Points
          </li>
        ))}
        <li><span onClick={() => lifecycle.showHowToPlay(howToPlay)} className="bg-cc-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">How to Play</span></li>
        <li><span onClick={() => lifecycle.promptLeave(leaveGame)} className="bg-ns-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">Leave Game</span></li>
      </ul>
      </>}

      {/* selected card */}
      {(gameStatus === 'PLAYING' || gameStatus === 'EVALUATING') && <>
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Round {roundId}/10: {isHigher ? 'Highest': 'Lowest'} wins!</h3>
      </>}

      {(gameStatus === 'PLAYING' || gameStatus === 'EVALUATING') && <div className='flex flex-wrap gap-2'>
        {options.map((option) => (
          <li key={option} onClick={() => {setSelectedCard(option);}} className={`list-none text-white ${selectedCard === option ? 'bg-ew-500 dark:bg-ew-300 hover:bg-ew-300 dark:hover:bg-ew-500' : 'bg-dt-500 dark:bg-dt-300 hover:bg-dt-300 dark:hover:bg-dt-500'} dark:text-black rounded-md p-2 me-1 cursor-pointer`}>
            <h3 className={`my-auto`}>
              {deckData[option].name}
            </h3>
          </li>))
          }</div>}

      {/* play selected card */}
      {gameStatus === 'PLAYING' && <>
        <button onClick={submitCard} className="my-2 p-2 rounded-md bg-ew-500 hover:opacity-80 text-white">Play Card</button>
      </>}

      {/* played card */}
      {gameStatus === 'EVALUATING' && <>
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Players played:</h3>
        <ul className="grid gap-2">
          {Object.entries(players).map(([name, playerData]) => (
          <li key={name} className={`list-none p-4 border-[1px] rounded-md bg-white/50 dark:bg-gray-700/50`}>
            <div className='flex w-full'>
              <h3 className={`flex text-xl font-bold mb-2 text-dt-500`}>
                {deckData[playerData.played.card_id].name} ({name})
              </h3>
            </div>
            <ul className={`grid gap-2 text-gray-900 dark:text-white md:grid-cols-4 grid-cols-2`}>
              {fields.map((fieldName, index) => <p className="" key={fieldName}>
                <><span key={fieldName} className={`font-bold ${deckData[playerData.played.card_id][fieldName] == winningValues[index] ? 'bg-dt-500' : 'bg-gray-500/20'} rounded-md p-1`}>{capitalise(fieldName)}</span> <span className={`font-medium`}>{deckData[playerData.played.card_id][fieldName]}</span></>
              </p>)}
            </ul>
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

export default DataHedger;
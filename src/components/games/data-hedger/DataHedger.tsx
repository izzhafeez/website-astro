import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import gamesData from '../../../data/games/games.json';
import Swal from 'sweetalert2';
import { capitalise } from '../../../utils/string';

const copySvg = <svg className="invert dark:invert-0" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z" fill="#0F0F0F"/>
  <path d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z" fill="#0F0F0F"/>
</svg>;

const startSvg = <svg className="invert" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z" stroke="#000000" strokeWidth="2" strokeLinejoin="round"/>
</svg>;

const instructions = gamesData['data-hedger'].heroText;

type PlayerData = {
  points: number;
  played_card: number;
  acknowledged: boolean;
}

type FieldWinnerData = {
  best_value: number;
  winners: string[];
}

function DataHedger({ id, deck, deckName }: { id: string, deck: any, deckName: string }) {
  const title = deckName;
  const WS_URL = `${import.meta.env.PUBLIC_WS}/api/games/data-hedger/${deckName}/${id}`;
  const deckData = deck.data;
  const fields = Object.keys(deckData[0]);
  fields.shift();
  const [players, setPlayers] = React.useState({} as {[name: string]: PlayerData});
  const [name, setName] = React.useState('');
  const [gameStatus, setGameStatus] = React.useState('UNJOINED');
  const [options, setOptions] = React.useState([] as number[])
  const [selectedCard, setSelectedCard] = React.useState({} as number);
  const [roundId, setRoundId] = React.useState(0);
  const [isHigher, setIsHigher] = React.useState(false);
  const [winningValues, setWinningValues] = React.useState([] as number[]);

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
      Swal.fire({
        icon: 'info',
        title: `Connecting...`,
        timer: 1500,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      setGameStatus('UNJOINED');
    } else if (method === 'join') {
      setGameStatus('JOINED');
    } else if (method === 'leave') {
      if (message.name === name) {
        Swal.fire({
          icon: 'info',
          title: `Leaving...`,
          timer: 1500,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        setGameStatus('UNJOINED');
      }
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
      Swal.fire({
        icon: 'info',
        title: `Game Over! ${message.winner} Wins!`,
        text: `The game will end in 5 seconds...`,
        timer: 5000,
      })
      setGameStatus('JOINED');
    } else if (method === 'connect_error') {
      Swal.fire({
        icon: 'info',
        title: `Game not found!`,
        text: `Creating a new game at ${id}...`,
        timerProgressBar: true,
        timer: 2000
      });
      setGameStatus('UNJOINED');
    } else if (method === 'join_error') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message.message
      });
      setGameStatus('UNJOINED');
    } else if (method === 'start_error') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message.message
      });
      setGameStatus('JOINED');
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

  const copyGameLink = () => {
    navigator.clipboard.writeText(window.location.href);
    const toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    toast.fire({
      icon: "success",
      title: "Link Copied!"
    });
  }

  const promptLeave = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will be removed from the game!',
      showCancelButton: true,
      confirmButtonText: 'Yes, leave!',
      cancelButtonText: 'No, stay!'
    }).then((result) => {
      if (result.isConfirmed) {
        leaveGame();
      }
    });
  }

  const submitCard = () => {
    Swal.fire({
      title: 'Waiting for other players...',
      didOpen: () => {
        Swal.showLoading();
      }
    })
    sendJsonMessage({ method: 'play', card_id: selectedCard, data: Object.values(deckData[selectedCard]).slice(1), name: name });
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

  const fieldsString = fields.join(', ');

  const showHowToPlay = () => {
    Swal.fire({
      icon: 'info',
      title: 'How to Play',
      text: `Each card has a set of fields (${fieldsString}). Pick a card that will win the most fields! But be warned... if you make the most popular choice, you will lose 5 points!`,
    });
  }

  const names = deckData.map((card: {name: string}) => card.name).map((s: string, index: number) => <span className={options.includes(index) ? 'text-gray-500/30' : ''}>{s} </span>);
  const namesLength = deckData.map((card: {name: string}) => card.name.length).reduce((a: number, b: number) => a + b, 0);

  return <>
    <p className="fixed h-screen inset-0 overflow-clip font-mono transition duration-500 text-gray-200/50 dark:text-gray-700 px-2 text-center bg-gray-100 dark:bg-gray-800 w-full -z-10 text-wrap">
      {Array.from({length: Math.floor(10000/namesLength) }, () => names)}
    </p>
    <div className="p-2 max-w-6xl mx-auto">
      {gameStatus !== 'UNJOINED' && <>
        <h1 className="animate-linear bg-[length:200%_auto] bg-gradient-to-r from-dt-500 to-dt-300 text-transparent bg-clip-text text-6xl font-extrabold my-4 inline-block">Data Hedger</h1>
        </>}
      {gameStatus === 'JOINED' && <>
        <p className="max-w-3xl mb-4 ">{instructions} Deck: <span className="text-dt-500 dark:text-dt-300 font-bold">{title}</span></p>
        <div className="flex gap-2 mx-auto my-4">
          {/* start */}
          <button onClick={startGame} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white flex gap-1"><span className="my-auto">{startSvg}</span> Start Game</button>
          {/* copy link */}
          <button onClick={copyGameLink} className="p-2 rounded-md bg-dt-500 dark:bg-dt-300 dark:text-black hover:opacity-80 text-white flex gap-1"><span className="my-auto">{copySvg}</span> Copy Link</button>
        </div>
        </>}
      {gameStatus === 'UNJOINED' && <div className="mt-40 text-center">
        <h1 className="animate-linear bg-[length:200%_auto] bg-gradient-to-r from-dt-500 to-dt-300 text-transparent bg-clip-text text-6xl font-extrabold my-4 inline-block">Data Hedger</h1>
        <p className="max-w-3xl mx-auto mb-4 ">{instructions} Deck: <span className="text-dt-500 dark:text-dt-300 font-bold">{title}</span></p>
        <input
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Enter your name...'
          className="transition duration-500 bg-white dark:bg-gray-700 rounded-md me-2"/>
        <button onClick={joinGame} className="p-2 rounded-md bg-dt-500 dark:bg-dt-300 dark:text-black hover:opacity-80 text-white">Join Game</button>
      </div>}

      {/* show all players */}
      {gameStatus !== 'UNJOINED' && <>
      <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Players</h3>
      <ul className="grid gap-2">
        {Object.entries(players).map(([playerName, playerData]) => (
          <li key={playerName} className="">
            <span className="text-white bg-dt-500 dark:bg-dt-300 dark:text-black rounded-md p-1 me-1">{playerName}{playerName === name && ' (you)'}{playerData.played_card && ' (played)'}{playerData.acknowledged && ' (ready)'}</span> {playerData.points} Points
          </li>
        ))}
        <li><span onClick={showHowToPlay} className="bg-cc-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">How to Play</span></li>
        <li><span onClick={promptLeave} className="bg-ns-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">Leave Game</span></li>
      </ul>
      </>}

      {/* selected card */}
      {gameStatus === 'PLAYING' && <>
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Round {roundId}/10: {isHigher ? 'Highest': 'Lowest'} wins!</h3>
      </>}

      {gameStatus === 'PLAYING' && <div className='flex flex-wrap gap-2'>
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
                {deckData[playerData.played_card].name} ({name})
              </h3>
            </div>
            <ul className={`grid gap-2 text-gray-900 dark:text-white md:grid-cols-4 grid-cols-2`}>
              {fields.map((fieldName, index) => <p className="" key={fieldName}>
                <><span key={fieldName} className={`font-bold ${deckData[playerData.played_card][fieldName] == winningValues[index] ? 'bg-dt-500' : 'bg-gray-500/20'} rounded-md p-1`}>{capitalise(fieldName)}</span> <span className={`font-medium`}>{deckData[playerData.played_card][fieldName]}</span></>
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
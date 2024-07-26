import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import gamesData from '../../../data/games/games.json';
import Swal from 'sweetalert2';

const copySvg = <svg className="invert dark:invert-0" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z" fill="#0F0F0F"/>
  <path d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z" fill="#0F0F0F"/>
</svg>;

const startSvg = <svg className="invert" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z" stroke="#000000" strokeWidth="2" strokeLinejoin="round"/>
</svg>;

const instructions = gamesData['frequency-guessr'].heroText;

type PlayerData = {
  points: number;
  played_frequency: number;
  added_score: number;
  acknowledged: boolean;
}

function FrequencyGuessr({ id }: { id: string }) {
  const WS_URL = `${import.meta.env.PUBLIC_WS}/api/games/frequency-guessr/${id}`;
  const [players, setPlayers] = React.useState({} as {[name: string]: PlayerData});
  const [name, setName] = React.useState('');
  const [gameStatus, setGameStatus] = React.useState('UNJOINED');
  const [frequency, setFrequency] = React.useState(0);
  const [selectedFrequency, setSelectedFrequency] = React.useState('');
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
    if (message.frequency) setFrequency(_ => message.frequency);
    if (message.round_id) setRoundId(_ => message.round_id);

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
      setSelectedFrequency('');
      Swal.fire({
        icon: 'info',
        title: `Round ${message.round_id}!`,
        text: `Guess that frequency!`,
        timer: 1500,
      })
    } else if (method === 'evaluate') {
      setGameStatus('EVALUATING');
      Swal.fire({
        icon: 'info',
        title: `The frequency was ${frequency}Hz!`,
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
              <td class="px-6 py-4 font-light">${playerData.played_frequency}Hz</td>
              <td class="px-6 py-4 font-light">${playerData.added_score}</td>
            </tr>
          `).join('')}
        </table>`
      })
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

  const submitGuess = () => {
    // check if the frequency is a valid integer > 0
    if (!selectedFrequency) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a valid frequency!'
      });
      return;
    }

    const parsedFrequency = parseInt(selectedFrequency);

    if (isNaN(parsedFrequency) || parsedFrequency <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a valid frequency!'
      });
      return;
    }

    Swal.fire({
      title: 'Waiting for other players...',
      didOpen: () => {
        Swal.showLoading();
      }
    })
    sendJsonMessage({ method: 'play', frequency: parsedFrequency, name: name });
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

  const showHowToPlay = () => {
    Swal.fire({
      icon: 'info',
      title: 'How to Play',
      text: `Based on the given sound, guess its frequency. The number of points you get is based on how close you are to the actual frequency. The player with the most points at the end of the game wins!`,
    });
  }

  const playSoundFor1Second = (freq: number) => {
    let context = new AudioContext();
    let o = context.createOscillator();
    o.frequency.value = freq;
    o.type = "sine";
    var g = context.createGain();
    g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 2)
    o.connect(g);
    g.connect(context.destination);
    o.start(0);
    setTimeout(() => {
      o.stop(0);
    }, 2000);
  }

  return <>
    <div className="p-2 max-w-3xl mx-auto">
      {gameStatus !== 'UNJOINED' && <>
        <h1 className="animate-linear bg-[length:200%_auto] bg-gradient-to-r from-dt-500 to-dt-300 text-transparent bg-clip-text text-6xl font-extrabold my-4 inline-block">Frequency Guessr</h1>
        </>}
      {gameStatus === 'JOINED' && <>
        <div className="flex gap-2 mx-auto my-4">
          {/* start */}
          <button onClick={startGame} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white flex gap-1"><span className="my-auto">{startSvg}</span> Start Game</button>
          {/* copy link */}
          <button onClick={copyGameLink} className="p-2 rounded-md bg-dt-500 dark:bg-dt-300 dark:text-black hover:opacity-80 text-white flex gap-1"><span className="my-auto">{copySvg}</span> Copy Link</button>
        </div>
        </>}
      {gameStatus === 'UNJOINED' && <div className="mt-40 text-center">
        <h1 className="animate-linear bg-[length:200%_auto] bg-gradient-to-r from-dt-500 to-dt-300 text-transparent bg-clip-text text-6xl font-extrabold my-4 inline-block">Frequency Guessr</h1>
        <p className="max-w-3xl mx-auto mb-4 ">{instructions}</p>
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
            <span className="text-white bg-dt-500 dark:bg-dt-300 dark:text-black rounded-md p-1 me-1">{playerName}{playerName === name && ' (you)'}{playerData.played_frequency && gameStatus !== 'EVALUATING' && ' (played)'}{playerData.acknowledged && ' (ready)'}</span> {playerData.points} Points
          </li>
        ))}
        <li><span onClick={showHowToPlay} className="bg-cc-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">How to Play</span></li>
        <li><span onClick={promptLeave} className="bg-ns-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">Leave Game</span></li>
      </ul>
      </>}

      {gameStatus === 'PLAYING' && <>
        {/* round counter */}
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Round {roundId}/10</h3>

        {/* frequency to guess */}
        <div className="flex gap-2">
          {/* frequency */}
          <p className="my-auto">Guess the frequency!</p>

          {/* button to play the sound */}
          <button onClick={() => playSoundFor1Second(frequency)} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white flex gap-1"><span className="my-auto">{startSvg}</span> Play Sound</button>
        </div>

        {/* input box for frequency */}
        <input
          name="frequency"
          type="text"
          value={selectedFrequency}
          onChange={(e) => setSelectedFrequency(e.target.value)}
          placeholder='Enter frequency (Hz)...'
          className="transition duration-500 bg-white dark:bg-gray-700 rounded-md me-2"/>
        
        {/* submit guess */}
        <button onClick={submitGuess} className="my-2 p-2 rounded-md bg-cc-500 hover:opacity-80 text-white">Submit Guess</button>
        </>}

      {/* played card */}
      {gameStatus === 'EVALUATING' && <>
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">The frequency was {frequency}Hz! Players guessed:</h3>
        <ul className="grid gap-2">
          {Object.entries(players).map(([name, playerData]) => (
          <li key={name} className={`list-none p-4 border-[1px] rounded-md bg-white/50 dark:bg-gray-700/50`}>
            {/* left side should be player name and frequency, right side should be the guessed frequency */}
            <div className="flex gap-2">
              <span className="my-auto me-4">{name}</span>
              
              {/* two buttons: one for correct, one for guessed */}
              <button onClick={() => playSoundFor1Second(frequency)} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white flex gap-1"><span className="my-auto">{startSvg}</span> {frequency}Hz</button>
              <button onClick={() => playSoundFor1Second(playerData.played_frequency)} className="p-2 rounded-md bg-cc-500 hover:opacity-80 text-white flex gap-1"><span className="my-auto">{startSvg}</span> {playerData.played_frequency}Hz</button>

              <span className="my-auto ms-auto">Score: {playerData.added_score}</span>
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

export default FrequencyGuessr;
import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import Swal from 'sweetalert2';
import gamesData from '../../../data/games/games.json';

const copySvg = <svg className="invert dark:invert-0" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z" fill="#0F0F0F"/>
  <path d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z" fill="#0F0F0F"/>
</svg>;

const startSvg = <svg className="invert" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z" stroke="#000000" strokeWidth="2" strokeLinejoin="round"/>
</svg>;

const allCards = [
  { rep: 'f(x) = -1', fn: (x: number) => -1 },
  { rep: 'f(x) = 0', fn: (x: number) => 0 },
  { rep: 'f(x) = 1', fn: (x: number) => 1 },
  { rep: 'f(x) = 2', fn: (x: number) => 2 },
  { rep: 'f(x) = 3', fn: (x: number) => 3 },
  { rep: 'f(x) = 5', fn: (x: number) => 5 },
  { rep: 'f(x) = 10', fn: (x: number) => 10 },
  { rep: 'f(x) = 100', fn: (x: number) => 100 },
  { rep: 'f(x) = 1000', fn: (x: number) => 1000 },
  { rep: 'f(x) = 10000', fn: (x: number) => 10000 },
  { rep: 'f(x) = x', fn: (x: number) => x },
  { rep: 'f(x) = πx', fn: (x: number) => Math.PI*x },
  { rep: 'f(x) = x + 5', fn: (x: number) => x+5 },
  { rep: 'f(x) = x + 10', fn: (x: number) => x+10 },
  { rep: 'f(x) = x - 5', fn: (x: number) => x-5 },
  { rep: 'f(x) = x - 10', fn: (x: number) => x-10 },
  { rep: 'f(x) = -x', fn: (x: number) => -x },
  { rep: 'f(x) = 2x', fn: (x: number) => 2*x },
  { rep: 'f(x) = 3x', fn: (x: number) => 3*x },
  { rep: 'f(x) = 2x - 2', fn: (x: number) => 2*x - 2 },
  { rep: 'f(x) = -2x + 2', fn: (x: number) => -2*x + 2},
  { rep: 'f(x) = 3x - 3', fn: (x: number) => 3*x - 3 },
  { rep: 'f(x) = -3x + 3', fn: (x: number) => -3*x + 3 },
  { rep: 'f(x) = 4x - 4', fn: (x: number) => 4*x - 4 },
  { rep: 'f(x) = -4x + 4', fn: (x: number) => -4*x + 4 },
  { rep: 'f(x) = 1000x', fn: (x: number) => 1000*x },
  { rep: 'f(x) = x/2', fn: (x: number) => x/2 },
  { rep: 'f(x) = x^2', fn: (x: number) => x**2 },
  { rep: 'f(x) = x^3', fn: (x: number) => x**3 },
  { rep: 'f(x) = x^x', fn: (x: number) => x**x },
  { rep: 'f(x) = 2x^2 - x', fn: (x: number) => 2*(x**2) - x },
  { rep: 'f(x) = 3x^2 - 2x + 1', fn: (x: number) => 3*(x**2) - 2*x + 1 },
  { rep: 'f(x) = -x^2 + 3x + 5', fn: (x: number) => -(x**2) + 3*x + 5 },
  { rep: 'f(x) = sqrt(|x|)', fn: (x: number) => Math.abs(x)**0.5 },
  { rep: 'f(x) = sqrt(|2x + 1|)', fn: (x: number) => Math.abs(2*x + 1)**0.5 },
  { rep: 'f(x) = 200sin(x)', fn: (x: number) => 200*Math.sin(x) },
  { rep: 'f(x) = 200cos(x)', fn: (x: number) => 200*Math.cos(x) },
  { rep: 'f(x) = tan(x)', fn: (x: number) => Math.tan(x) },
  { rep: 'f(x) = 10/sin(x)', fn: (x: number) => 10/Math.sin(x) },
  { rep: 'f(x) = 10/cos(x)', fn: (x: number) => 10/Math.cos(x) },
  { rep: 'f(x) = 10/tan(x)', fn: (x: number) => 10/Math.tan(x) },
  { rep: 'f(x) = 1/x', fn: (x: number) => 1/x },
  { rep: 'f(x) = ln(|x|+1)', fn: (x: number) => Math.log(Math.abs(x)+1) },
  { rep: 'f(x) = e^x', fn: (x: number) => Math.exp(x) },
  { rep: 'f(x) = 1.5^x', fn: (x: number) => 1.5**x },
  { rep: 'f(x) = 2^x', fn: (x: number) => 2**x },
  { rep: 'f(x) = 0.5^x', fn: (x: number) => 0.5**x },
  { rep: 'f(x) = 10*sigmoid(x)', fn: (x: number) => 10/(1 + Math.exp(-x)) },
  { rep: 'f(x) = relu(x)', fn: (x: number) => Math.max(0, x) },
  { rep: 'f(x) = step(x)', fn: (x: number) => x > 0 ? 1 : 0 },
  { rep: 'f(x) = x mod 2', fn: (x: number) => x % 2 },
  { rep: 'f(x) = round(x)', fn: (x: number) => Math.round(x) },
  { rep: 'f(x) = 10^x', fn: (x: number) => 10**x },
  { rep: 'f(x) = -10x', fn: (x: number) => -10*x },
  { rep: 'f(x) = -1000x', fn: (x: number) => -1000*x },
  { rep: 'f(x) = sin(x)', fn: (x: number) => Math.sin(x) },
  { rep: 'f(x) = cos(x)', fn: (x: number) => Math.cos(x) },
  { rep: 'f(x) = x - 10', fn: (x: number) => x - 10 },
  { rep: 'f(x) = -100', fn: (x: number) => -100 },
  { rep: 'f(x) = 1/(fractional part of x)', fn: (x: number) => 1/(x - Math.floor(x)) },
];

const instructions = gamesData['math-attack'].heroText;

enum PlayerStates {
  UNJOINED = 'UNJOINED',
  LOBBY = 'LOBBY',
  TURN = 'TURN',
  WAITING = 'WAITING',
  DEAD = 'DEAD',
  SPECTATING = 'SPECTATING',
}

enum GameStates {
  LOBBY = 'LOBBY',
  PLAYING = 'PLAYING',
}

enum GameResponses {
  JOIN = 'JOIN',
  CONNECT = 'CONNECT',
  PLAY = 'PLAY',
  END = 'END',
  JOIN_ERROR = 'JOIN_ERROR',
  START_ERROR = 'START_ERROR',
  CONNECT_ERROR = 'CONNECT_ERROR',
  RECONNECT = 'RECONNECT',
  SPECTATE = 'SPECTATE',
  LEAVE = 'LEAVE',
  WAIT = 'WAIT',
  TURN = 'TURN',
  LOSE = 'LOSE',
}

function MathAttack({ id }: { id: string }) {
  const WS_URL = `${import.meta.env.PUBLIC_WS}/api/games/math-attack/`;
  const [hand, setHand] = React.useState([] as number[]);
  const [selectedCard, setSelectedCard] = React.useState(-1);
  const [playerState, setPlayerState] = React.useState(PlayerStates.UNJOINED);
  const [gameState, setGameState] = React.useState(GameStates.LOBBY);
  const [players, setPlayers] = React.useState([] as string[]);
  const [currentPlayer, setCurrentPlayer] = React.useState('' as string);
  const [name, setName] = React.useState('');
  const [number, setNumber] = React.useState(0);
  const [lastPlayed, setLastPlayed] = React.useState(-1);

  const { sendJsonMessage, lastMessage } = useWebSocket(WS_URL+id, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    share: true
  });
  // const sendJsonMessage = () => {};
  // const lastMessage = null;

  const joinGame = () => {
    sendJsonMessage({ method: 'join', name })
    setPlayerState(PlayerStates.LOBBY);
  };

  const leaveGame = () => {
    sendJsonMessage({ method: 'leave', name });
    setPlayerState(PlayerStates.UNJOINED);
  };

  const startGame = () => {
    sendJsonMessage({ method: 'start' });
    setGameState(GameStates.PLAYING);
    setPlayerState(PlayerStates.WAITING);
  }

  const playCard = () => {
    console.log(selectedCard);
    if (selectedCard === -1) {
      Swal.fire({
        icon: 'error',
        title: 'No card selected!',
        text: 'Select a card to play...'
      });
      return;
    }

    const card = allCards[selectedCard];
    const newNumber = card.fn(number);
    sendJsonMessage({ method: 'play', card_id: selectedCard, number: newNumber, name });
    setPlayerState(PlayerStates.WAITING);
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

  const handleSelect = (cardId: number) => {
    if (playerState !== PlayerStates.TURN) return;
    setSelectedCard(cardId);
  }

  const STARTING_NUMBER = 0
  const LOWEST_NUMBER = -100
  const HIGHEST_NUMBER = 100
  useEffect(() => {
    if (!lastMessage) return;
    const message = JSON.parse(lastMessage.data);
    console.log(message);
    if (message.players) setPlayers(_ => message.players);
    if (message.hand) setHand(_ => message.hand);
    if (message.state) setGameState(_ => message.state);
    if (message.number) setNumber(_ => message.number);
    if (message.player) setCurrentPlayer(_ => message.player);
    if (message.last_played) setLastPlayed(_ => message.last_played);
    if (message.players && message.players[name]) setPlayerState(_ => message.players[name]);
    const method = message.method;

    if (method === GameResponses.CONNECT) {
      Swal.fire({
        icon: 'info',
        title: `Connecting...`,
        timer: 1500,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    } else if (method === GameResponses.JOIN) {
    } else if (method === GameResponses.LEAVE) {
      if (message.name === name) {
        Swal.fire({
          icon: 'info',
          title: `Leaving...`,
          timer: 1500,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      }
    } else if (method === GameResponses.WAIT) {
      Swal.fire({
        icon: 'info',
        title: `Wait for ${currentPlayer}`,
        timer: 1000,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    } else if (method === GameResponses.TURN) {
      Swal.fire({
        icon: 'info',
        title: 'Your Turn!',
        text: 'Select a card to play...',
        timer: 1500
      });
    } else if (method === GameResponses.PLAY) {
      const lastPlayer = message.last_player;
      const lastPlayed = message.last_played;
      const number = message.number;
      if (number > HIGHEST_NUMBER || number < LOWEST_NUMBER) {
        Swal.fire({
          icon: 'error',
          title: `${lastPlayer} lost!`,
          text: 'They burst the limit!',
          timer: 5000
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: `${lastPlayer} played ${allCards[lastPlayed].rep}!`,
          text: `The number is now ${number}`,
          timer: 3000
        });
      }
    } else if (method === GameResponses.LOSE) {
      Swal.fire({
        icon: 'error',
        title: 'You lost!',
        text: 'You burst the limit!',
        timer: 5000
      })
      setPlayerState(PlayerStates.DEAD);
    } else if (method === GameResponses.END) {
      Swal.fire({
        icon: 'info',
        title: `Game Over! ${message.winner} Wins!`,
        text: `The game will end in 5 seconds...`,
        timer: 5000,
      });
      setPlayerState(PlayerStates.LOBBY);
    } else if (method === GameResponses.CONNECT_ERROR) {
      Swal.fire({
        icon: 'info',
        title: `Game not found!`,
        text: `Creating a new game at ${id}...`,
        timerProgressBar: true,
        timer: 2000
      });
    } else if (method === GameResponses.JOIN_ERROR) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message.message
      });
    } else if (method === GameResponses.START_ERROR) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message.message
      });
    } else if (method === GameResponses.SPECTATE) {
      Swal.fire({
        icon: 'info',
        title: 'Spectating...',
        text: 'You are now spectating the game.',
        timerProgressBar: true,
        timer: 2000
      });
    }
  }, [lastMessage]);

  return (
    <div className="p-2 max-w-6xl mx-auto">
      {playerState !== PlayerStates.UNJOINED && <>
      <h1 className="animate-linear bg-[length:200%_auto] bg-gradient-to-r from-dt-500 to-dt-300 text-transparent bg-clip-text text-6xl font-extrabold my-4 inline-block">Math Attack</h1>
      </>}
      {playerState === PlayerStates.UNJOINED && <div className="mt-40 text-center">
        <h1 className="animate-linear bg-[length:200%_auto] bg-gradient-to-r from-dt-500 to-dt-300 text-transparent bg-clip-text text-6xl font-extrabold my-4 inline-block">Math Attack</h1>
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
      {playerState !== PlayerStates.UNJOINED && <>
      <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Players</h3>
      <ul className="grid gap-2">
        {Object.entries(players).map(([playerName, is_alive]) => (
          <li key={playerName} className=""><span className="text-white bg-dt-500 dark:bg-dt-300 dark:text-black rounded-md p-1 me-1">{playerName}{playerName === name && ' (you)'}</span> {!is_alive && '(Lost)'}</li>
        ))}
        <li><span onClick={promptLeave} className="bg-ns-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">Leave Game</span></li>
      </ul>
      </>}
      {playerState === PlayerStates.LOBBY && <>
      <div className="flex gap-2 mx-auto my-4">
        {/* start */}
        <button onClick={startGame} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white flex gap-1"><span className="my-auto">{startSvg}</span> Start Game</button>
        {/* copy link */}
        <button onClick={copyGameLink} className="p-2 rounded-md bg-dt-500 dark:bg-dt-300 dark:text-black hover:opacity-80 text-white flex gap-1"><span className="my-auto">{copySvg}</span> Copy Link</button>
      </div>
      </>}
      {(playerState === PlayerStates.WAITING || playerState === PlayerStates.TURN) && <div className="my-4">
          <b>Current Number:</b> {number}<br/> <b>Limits:</b> {LOWEST_NUMBER}, {HIGHEST_NUMBER}<br/>
          <b>Current player:</b> {currentPlayer}
        </div>}
      {(playerState === PlayerStates.TURN || playerState === PlayerStates.WAITING) && <div className="grid grid-cols-3 gap-4 max-w-xl">
        {hand.map(cardId => <div className={`border-2 border-cc-500 aspect-square p-4 rounded-xl flex ${playerState === PlayerStates.TURN && 'cursor-pointer'} ${cardId === selectedCard && 'bg-cc-500'}`} onClick={() => handleSelect(cardId)}>
          <div className={`m-auto`}>{allCards[cardId].rep}</div>
          </div>)}
        </div>}
      {playerState === PlayerStates.TURN && <button onClick={() => playCard()} className="px-2 py-1 rounded-md bg-ew-mrt my-2">Play Card</button>}
    </div>
  );
};

export default MathAttack;
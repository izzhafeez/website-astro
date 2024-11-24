import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import gamesData from '../../../data/games/games.json';
import Swal from 'sweetalert2';
import GameTitle from '../common/GameTitle';
import GameStart from '../common/GameStart';
import GameJoin from '../common/GameJoin';
import lifecycle from '../common/GameLifecycle';

const instructions = gamesData['number-nightmare'].heroText;

type PlayerData = {
  points: number;
  played: number;
  satisfy_count: number;
  acknowledged: boolean;
}

// numbers from 1 to 99
const convertNumberToEnglish = (num: number) => {
  const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num % 10 === 0) return tens[num / 10];
  return `${tens[Math.floor(num / 10)]} ${ones[num % 10]}`;
}

const convertNumberToStrokes = (num: number) => {
  const numOfStrokes = [0, 1, 2, 3, 5, 4, 4, 2, 2, 2];
  if (num < 10) return numOfStrokes[num];
  if (num === 10) return 2;
  if (num % 10 === 0) return numOfStrokes[num / 10] + 2;
  return numOfStrokes[Math.floor(num / 10)] + numOfStrokes[num % 10] + 2;
}

const getRadicals = (num: number) => {
  const radicals = ["", "一", "二", "一", "囗", "二", "八", "一", "八", "丿"];
  if (num < 10) return [radicals[num]];
  if (num % 10 === 0) return [radicals[num / 10], "十"];
  return [radicals[Math.floor(num / 10)], radicals[num % 10], "十"];
}

const isPrime = (num: number) => {
  if (num < 2) return false;
  for (let i = 2; i < num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

type Condition = {
  rep: string;
  condition: (num: number) => boolean;
}

const conditions: Condition[] = [
  { rep: "Name contains 'e'", condition: (num: number) => convertNumberToEnglish(num).includes('e') },
  { rep: "Name contains 'i'", condition: (num: number) => convertNumberToEnglish(num).includes('i') },
  { rep: "Name contains 'o'", condition: (num: number) => convertNumberToEnglish(num).includes('o') },
  { rep: "Name contains 'u'", condition: (num: number) => convertNumberToEnglish(num).includes('u') },
  { rep: "Name contains 'y'", condition: (num: number) => convertNumberToEnglish(num).includes('y') },
  { rep: "Name contains 'f'", condition: (num: number) => convertNumberToEnglish(num).includes('f') },
  { rep: "Name contains 'g'", condition: (num: number) => convertNumberToEnglish(num).includes('g') },
  { rep: "Name contains 'h'", condition: (num: number) => convertNumberToEnglish(num).includes('h') },
  { rep: "Name contains 'n'", condition: (num: number) => convertNumberToEnglish(num).includes('n') },
  { rep: "Name contains 'r'", condition: (num: number) => convertNumberToEnglish(num).includes('r') },
  { rep: "Name contains 's'", condition: (num: number) => convertNumberToEnglish(num).includes('s') },
  { rep: "Name contains 't'", condition: (num: number) => convertNumberToEnglish(num).includes('t') },
  { rep: "Name doesn't contain 'e'", condition: (num: number) => !convertNumberToEnglish(num).includes('e') },
  { rep: "Name doesn't contain 'i'", condition: (num: number) => !convertNumberToEnglish(num).includes('i') },
  { rep: "Name doesn't contain 'o'", condition: (num: number) => !convertNumberToEnglish(num).includes('o') },
  { rep: "Name doesn't contain 'u'", condition: (num: number) => !convertNumberToEnglish(num).includes('u') },
  { rep: "Name doesn't contain 'y'", condition: (num: number) => !convertNumberToEnglish(num).includes('y') },
  { rep: "Name doesn't contain 'f'", condition: (num: number) => !convertNumberToEnglish(num).includes('f') },
  { rep: "Name doesn't contain 'g'", condition: (num: number) => !convertNumberToEnglish(num).includes('g') },
  { rep: "Name doesn't contain 'h'", condition: (num: number) => !convertNumberToEnglish(num).includes('h') },
  { rep: "Name doesn't contain 'n'", condition: (num: number) => !convertNumberToEnglish(num).includes('n') },
  { rep: "Name doesn't contain 'r'", condition: (num: number) => !convertNumberToEnglish(num).includes('r') },
  { rep: "Name doesn't contain 's'", condition: (num: number) => !convertNumberToEnglish(num).includes('s') },
  { rep: "Name doesn't contain 't'", condition: (num: number) => !convertNumberToEnglish(num).includes('t') },
  { rep: "Multiple of 2", condition: (num: number) => num % 2 === 0 },
  { rep: "Multiple of 3", condition: (num: number) => num % 3 === 0 },
  { rep: "Multiple of 5", condition: (num: number) => num % 5 === 0 },
  { rep: "Multiple of 7", condition: (num: number) => num % 7 === 0 },
  { rep: "Multiple of 11", condition: (num: number) => num % 11 === 0 },
  { rep: "Multiple of 13", condition: (num: number) => num % 13 === 0 },
  { rep: "Multiple of 17", condition: (num: number) => num % 17 === 0 },
  { rep: "Multiple of 19", condition: (num: number) => num % 19 === 0 },
  { rep: "Less than 20", condition: (num: number) => num < 20 },
  { rep: "Less than 40", condition: (num: number) => num < 40 },
  { rep: "Less than 60", condition: (num: number) => num < 60 },
  { rep: "Less than 80", condition: (num: number) => num < 80 },
  { rep: "Greater than 80", condition: (num: number) => num > 80 },
  { rep: "Greater than 60", condition: (num: number) => num > 60 },
  { rep: "Greater than 40", condition: (num: number) => num > 40 },
  { rep: "Greater than 20", condition: (num: number) => num > 20 },
  { rep: "Prime Number", condition: (num: number) => {
    if (num < 2) return false;
    for (let i = 2; i < num; i++) {
      if (num % i === 0) return false;
    }
    return true;
  }},
  { rep: "Square Number", condition: (num: number) => Math.sqrt(num) % 1 === 0 },
  { rep: "Cube Number", condition: (num: number) => Math.cbrt(num) % 1 === 0 },
  { rep: "Even Number", condition: (num: number) => num % 2 === 0 },
  { rep: "Odd Number", condition: (num: number) => num % 2 !== 0 },
  { rep: "Perfect Number", condition: (num: number) => {
    let sum = 0;
    for (let i = 1; i < num; i++) {
      if (num % i === 0) sum += i;
    }
    return sum === num;
  }},
  { rep: "Triangle Number", condition: (num: number) => {
    let sum = 0;
    for (let i = 1; i <= num; i++) {
      sum += i;
      if (sum === num) return true;
    }
    return false;
  }},
  { rep: "Fibonacci Number", condition: (num: number) => {
    const listOfFibonacciUnder99 = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    return listOfFibonacciUnder99.includes(num);
  }},
  { rep: "sin(x) > 0", condition: (num: number) => Math.sin(num) > 0 },
  { rep: "cos(x) > 0", condition: (num: number) => Math.cos(num) > 0 },
  { rep: "tan(x) > 0", condition: (num: number) => Math.tan(num) > 0 },
  { rep: "sin(x) < 0", condition: (num: number) => Math.sin(num) < 0 },
  { rep: "cos(x) < 0", condition: (num: number) => Math.cos(num) < 0 },
  { rep: "tan(x) < 0", condition: (num: number) => Math.tan(num) < 0 },
  { rep: "Name has < 6 letters", condition: (num: number) => convertNumberToEnglish(num).split(' ').join('').length < 6 },
  { rep: "Name has < 8 letters", condition: (num: number) => convertNumberToEnglish(num).split(' ').join('').length < 8 },
  { rep: "Name has < 10 letters", condition: (num: number) => convertNumberToEnglish(num).split(' ').join('').length < 10 },
  { rep: "Name has < 12 letters", condition: (num: number) => convertNumberToEnglish(num).split(' ').join('').length < 12 },
  { rep: "Name has > 4 letters", condition: (num: number) => convertNumberToEnglish(num).split(' ').join('').length > 4 },
  { rep: "Name has > 6 letters", condition: (num: number) => convertNumberToEnglish(num).split(' ').join('').length > 6 },
  { rep: "Name has > 8 letters", condition: (num: number) => convertNumberToEnglish(num).split(' ').join('').length > 8 },
  { rep: "Name has > 10 letters", condition: (num: number) => convertNumberToEnglish(num).split(' ').join('').length > 10 },
  { rep: "Name has repeated letters", condition: (num: number) => {
    const letters = convertNumberToEnglish(num).split(' ').join('');
    return new Set(letters).size !== letters.length;
  }},
  { rep: "Name has no repeated letters", condition: (num: number) => {
    const letters = convertNumberToEnglish(num).split(' ').join('');
    return new Set(letters).size === letters.length;
  }},
  { rep: "Name has 2 vowels", condition: (num: number) => {
    const letters = convertNumberToEnglish(num).split(' ').join('');
    return letters.match(/[aeiou]/g)?.length === 2;
  }},
  { rep: "Name has 3 vowels", condition: (num: number) => {
    const letters = convertNumberToEnglish(num).split(' ').join('');
    return letters.match(/[aeiou]/g)?.length === 3;
  }},
  { rep: "Name has 4 vowels", condition: (num: number) => {
    const letters = convertNumberToEnglish(num).split(' ').join('');
    return letters.match(/[aeiou]/g)?.length === 4;
  }},
  { rep: "Palindrome Number", condition: (num: number) => {
    if (num < 10) return true;
    const str = num.toString();
    if (str[0] === str[1]) return true;
    return false;
  }},
  { rep: "Name starts with vowel", condition: (num: number) => {
    const letters = convertNumberToEnglish(num).split(' ').join('');
    return ['a', 'e', 'i', 'o', 'u'].includes(letters[0]);
  }},
  { rep: "Name starts with consonant", condition: (num: number) => {
    const letters = convertNumberToEnglish(num).split(' ').join('');
    return !['a', 'e', 'i', 'o', 'u'].includes(letters[0]);
  }},
  { rep: "Name ends with vowel", condition: (num: number) => {
    const letters = convertNumberToEnglish(num).split(' ').join('');
    return ['a', 'e', 'i', 'o', 'u'].includes(letters[letters.length - 1]);
  }},
  { rep: "Name ends with consonant", condition: (num: number) => {
    const letters = convertNumberToEnglish(num).split(' ').join('');
    return !['a', 'e', 'i', 'o', 'u'].includes(letters[letters.length - 1]);
  }},
  { rep: "Tens digit > Ones digit", condition: (num: number) => Math.floor(num / 10) > num % 10 },
  { rep: "Tens digit < Ones digit", condition: (num: number) => Math.floor(num / 10) < num % 10 },
  { rep: "Tens digit is even", condition: (num: number) => Math.floor(num / 10) % 2 === 0 },
  { rep: "Tens digit is odd", condition: (num: number) => Math.floor(num / 10) % 2 !== 0 },
  { rep: "Ones digit < 5", condition: (num: number) => num % 10 < 5 },
  { rep: "Ones digit > 5", condition: (num: number) => num % 10 > 5 },
  { rep: "Ones digit is prime", condition: (num: number) => isPrime(num % 10) },
  { rep: "Ones digit is not prime", condition: (num: number) => !isPrime(num % 10) },
  { rep: "Tens digit is prime", condition: (num: number) => isPrime(Math.floor(num / 10)) },
  { rep: "Tens digit is not prime", condition: (num: number) => !isPrime(Math.floor(num / 10)) },
  { rep: "Chinese name has < 3 strokes", condition: (num: number) => convertNumberToStrokes(num) < 3 },
  { rep: "Chinese name has < 5 strokes", condition: (num: number) => convertNumberToStrokes(num) < 5 },
  { rep: "Chinese name has < 7 strokes", condition: (num: number) => convertNumberToStrokes(num) < 7 },
  { rep: "Chinese name has < 9 strokes", condition: (num: number) => convertNumberToStrokes(num) < 9 },
  { rep: "Chinese name has > 3 strokes", condition: (num: number) => convertNumberToStrokes(num) > 3 },
  { rep: "Chinese name has > 5 strokes", condition: (num: number) => convertNumberToStrokes(num) > 5 },
  { rep: "Chinese name has > 7 strokes", condition: (num: number) => convertNumberToStrokes(num) > 7 },
  { rep: "Chinese name has > 9 strokes", condition: (num: number) => convertNumberToStrokes(num) > 9 },
  { rep: "Chinese name contains '一' radical", condition: (num: number) => getRadicals(num).includes("一") },
  { rep: "Chinese name contains '二' radical", condition: (num: number) => getRadicals(num).includes("二") },
  { rep: "Chinese name contains '八' radical", condition: (num: number) => getRadicals(num).includes("八") },
]

function NumberNightmare({ id }: { id: string }) {
  const WS_URL = `${import.meta.env.PUBLIC_WS}/api/games/number-nightmare/${id}/${conditions.length}`;

  const [players, setPlayers] = React.useState({} as {[name: string]: PlayerData});
  const [name, setName] = React.useState('');
  const [gameStatus, setGameStatus] = React.useState('UNJOINED');
  const [options, setOptions] = React.useState([] as any[])
  const [selectedNumber, setSelectedNumber] = React.useState('' );
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
    if (message.options) setOptions(_ => message.options);
    if (message.round_id) setRoundId(_ => message.round_id);

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
      Swal.fire({
        icon: 'info',
        title: `Round ${message.round_id}!`,
        text: `Satisfy as many conditions as possible to win!`,
        timer: 1500,
      })
    } else if (method === 'evaluate') {
      setGameStatus('EVALUATING');

      // check who played the same cards
      const failedPlayers = message.failed_players;

      Swal.fire({
        icon: 'info',
        title: `What each person played`,
        html: `
          <table class="w-full text-sm text-left rtl:text-right text-gray-700 mt-4">
            <thead class="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" class="px-6 py-3">Name</th>
                <th scope="col" class="px-6 py-3">Number</th>
                <th scope="col" class="px-6 py-3">Points</th>
              </tr>
            </thead>
            ${Object.entries(message.players as {[name: string]: PlayerData}).map(([name, playerData]) => `
              <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${name}</th>
                <td class="px-6 py-4 font-light">${playerData.played}</td>
                <td class="px-6 py-4 font-light">${playerData.satisfy_count}</td>
              </tr>
            `).join('')}
          </table>
        `,
        timer: 5000,
      }).then(() => {
        if (failedPlayers.length > 0) {
          // notify that these players have played the same numbers, and they lose 3 points
          if (failedPlayers.includes(name)) {
            var audio = new Audio(`/sound/quizzes/haiya.mp3`);
            audio.play();
          }

          Swal.fire({
            icon: 'warning',
            title: `Clash!`,
            text: `Players who played clashing numbers lose 3 points!`,
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

  const submitCard = (e: any) => {
    e.preventDefault();
    if (!selectedNumber) return;

    // if not number
    if (isNaN(parseInt(selectedNumber))) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid number!',
        text: 'You must select a whole number to play!',
      });
      return;
    }

    // if not between 1 and 99
    if (parseInt(selectedNumber) < 1 || parseInt(selectedNumber) > 99) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid number!',
        text: 'You must select a number between 1 and 99 inclusive!',
      });
      return;
    }

    const satisfied_conditions = options.filter(option => conditions[option].condition(parseInt(selectedNumber)));

    sendJsonMessage({ method: 'play', played: selectedNumber, satisfy_count: satisfied_conditions.length, name });
    setGameStatus('PLAYED');
    setSelectedNumber('');
    lifecycle.showSubmitSwal();
  }

  const acknowledge = () => {
    sendJsonMessage({ method: 'acknowledge', name });
    lifecycle.showAcknowledgeSwal();
  };

  const howToPlay = `Pick a number from 1 to 99 that will satisfy the most conditions. If you play the same number as someone else, you will lose 3 points!`;

  const names = conditions.map((condition) => condition.rep).map((s: string, index: number) => <span className={options.includes(index) ? 'text-gray-500/30' : ''}>{s} </span>);
  const namesLength = conditions.map((condition) => condition.rep.length).reduce((a: number, b: number) => a + b, 0);

  return <>
    <p className="fixed h-screen inset-0 overflow-clip font-mono transition duration-500 text-gray-200/50 dark:text-gray-700 px-2 text-center bg-gray-100 dark:bg-gray-800 w-full -z-10 text-wrap">
      {Array.from({length: Math.floor(10000/namesLength) }, () => names)}
    </p>
    <div className="p-2 max-w-6xl mx-auto">
      {gameStatus !== 'UNJOINED' && <GameTitle title={"Number Nightmare"}/>}
      {gameStatus === 'JOINED' && <GameStart instructions={instructions} startGame={startGame}/>}
      {gameStatus === 'UNJOINED' && <GameJoin title={"Number Nightmare"} instructions={instructions} name={name} setName={setName} joinGame={joinGame}/>}

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
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Round {roundId}/10</h3>
      </>}

      {(gameStatus === 'PLAYING' || gameStatus === 'EVALUATING') && <div className='flex flex-wrap gap-2'>
        {options.map((option) => (
          <li key={option} className={`list-none text-white dark:text-black rounded-md p-2 me-1 bg-dt-300`}>
            <h3 className={`my-auto`}>
              {conditions[option].rep}
            </h3>
          </li>))
          }</div>}

      {/* input box to selectNumber */}
      {gameStatus === 'PLAYING' && <>
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Select a number between 1 and 99 inclusive:</h3>
        <form onSubmit={submitCard}>
          <input type="number" value={selectedNumber} onChange={(e) => setSelectedNumber(e.target.value)} className="p-2 rounded-md border-[1px] border-dt-500 dark:border-dt-300 bg-white dark:bg-gray-700" />
          <button onClick={submitCard} className="my-2 p-2 rounded-md bg-ew-500 hover:opacity-80 text-white ms-2">Play Card</button>
        </form>
      </>}

      {/* played card */}
      {gameStatus === 'EVALUATING' && <>
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Players played:</h3>
        <ul className="grid gap-2">
          {Object.entries(players).map(([name, playerData]) => (
          <li key={name} className={`list-none p-4 border-[1px] rounded-md bg-white/50 dark:bg-gray-700/50`}>
            <div className='flex w-full'>
              <h3 className={`flex text-xl font-bold mb-2 text-dt-500 my-auto`}>
                {name} ({playerData.played})
              </h3>
              <span className="my-auto ms-auto">Score: {playerData.satisfy_count}</span>
            </div>
            <div className="flex gap-2">
              {options.filter(option => conditions[option].condition(playerData.played)).map((option, index) => (
                <span key={index} className="bg-ew-500 text-white rounded-md p-1">{conditions[option].rep}</span>
              ))}
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

export default NumberNightmare;
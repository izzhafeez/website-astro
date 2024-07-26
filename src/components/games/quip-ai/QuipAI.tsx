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

const instructions = gamesData['quip-ai'].heroText;

type PlayerData = {
  points: number;
  vote: string;
  acknowledged: boolean;
  gained_points: number;
}

type RoundData = {
  prompt: string;
  responses: { [name: string]: string };
  votes: { [name: string]: string[] };
}

function QuipAI({ id }: { id: string }) {
  const WS_URL = `${import.meta.env.PUBLIC_WS}/api/games/quip-ai/${id}`;
  const [players, setPlayers] = React.useState({} as {[name: string]: PlayerData});
  const [name, setName] = React.useState('');
  const [gameStatus, setGameStatus] = React.useState('UNJOINED');
  const [prompts, setPrompts] = React.useState([] as string[]);
  const [rounds, setRounds] = React.useState([] as RoundData[]);
  const [response, setResponse] = React.useState('');
  const [currentRound, setCurrentRound] = React.useState(0);
  const [responses, setResponses] = React.useState([] as string[]);
  const [purpose, setPurpose] = React.useState('');
  const [information, setInformation] = React.useState('');
  const [currentVotingRound, setCurrentVotingRound] = React.useState(0);
  const [vote, setVote] = React.useState('');
  const [winner, setWinner] = React.useState('');

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
    if (message.prompts) setPrompts(_ => message.prompts);
    if (message.rounds) setRounds(_ => message.rounds);
    if (message.current_voting_round) setCurrentVotingRound(_ => message.current_voting_round);

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
      setResponse('');
      Swal.fire({
        icon: 'info',
        title: `Quip AI`,
        text: `Come up with your best quips!`,
        timer: 1500,
      })
    } else if (method === 'vote_start') {
      setGameStatus('VOTING');
      setVote('');
      Swal.fire({
        icon: 'info',
        title: `Voting Round ${message.current_voting_round + 1}`,
        text: rounds[message.current_voting_round].prompt,
        timer: 1500,
      })
    } else if (method === 'vote_results') {
      setGameStatus('VOTE_ENDED');
      const rounds = message.rounds;
      const currentVotingRound = message.current_voting_round;
      const round = rounds[currentVotingRound];
      Swal.fire({
        icon: 'info',
        title: `Here are the results of the voting!`,
        html: `<table class="w-full text-sm text-left rtl:text-right text-gray-700 mt-4">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" class="px-6 py-3">Player</th>
              <th scope="col" class="px-6 py-3">Score Added</th>
            </tr>
          </thead>
          ${Object.entries(round.votes as {[name: string]: string[]}).map(([name, votesData]) => `
            <tr class="bg-white border-b">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${name}</th>
              <td class="px-6 py-4 font-light">${votesData.length}</td>
            </tr>
          `).join('')}
        </table>`,
        timer: 3000,
      })
    } else if (method === 'evaluate') {
      setGameStatus('EVALUATING');
    } else if (method === 'end') {
      setWinner(_ => message.winner);
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
    if (purpose === '') {
      Swal.fire('Purpose is required', 'Please enter a purpose for the game.', 'error');
      return;
    }

    if (information === '') {
      Swal.fire('Participant Description is required', "Please describe who the participants are.", 'error');
      return;
    }

    sendJsonMessage({
      method: 'start',
      deck_size: 100,
      purpose,
      information
    });
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

  const submitAnswer = () => {
    // check if provided
    if (response === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a response!'
      });
      return;
    }

    // check if too long (max 50 characters)
    if (response.length > 50) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Your response is too long! Please keep it under 50 characters.'
      });
      return;
    }

    if (currentRound == 1) {
      finaliseAnswer();
      setResponse('');
    } else {
      setResponses(_ => [response]);
      setCurrentRound(currentRound + 1);
      setResponse('');
    }
  }

  const finaliseAnswer = () => {
    setGameStatus('PLAYED');
    Swal.fire({
      title: 'Waiting for other players...',
      didOpen: () => {
        Swal.showLoading();
      }
    })
    sendJsonMessage({ method: 'play', responses: [...responses, response], name });
  }

  const submitVote = () => {
    if (vote === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please vote for your favourite response!'
      });
      return;
    }

    sendJsonMessage({ method: 'vote', vote, name });
    Swal.fire({
      icon: 'info',
      title: 'Waiting for other players to vote...',
      didOpen: () => {
        Swal.showLoading();
      }
    })
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
      text: `You are given two prompts, and you're supposed to come up with the funniest response to it!`,
    });
  }

  return <>
    <div className="p-2 max-w-3xl mx-auto">
      {gameStatus !== 'UNJOINED' && <>
        <h1 className="text-white text-6xl font-extrabold my-4 inline-block">Quip AI</h1>
        </>}

      {gameStatus === 'UNJOINED' && <div className="text-center mt-40">
        <h1 className="text-white text-6xl font-extrabold my-4 inline-block">Quip AI</h1>
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
            <span className="text-white bg-dt-500 dark:bg-dt-300 dark:text-black rounded-md p-1 me-1">{playerName}{playerName === name && ' (you)'}</span> {playerData.points} Points
          </li>
        ))}
        <li><span onClick={showHowToPlay} className="bg-cc-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">How to Play</span></li>
        <li><span onClick={promptLeave} className="bg-ns-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">Leave Game</span></li>
      </ul>
      </>}

      {gameStatus === 'JOINED' && <>
        <div className="text-left my-4">
          <p className="max-w-3xl mb-4 text-white">Create a new Quip AI game by filling out the form below. We will take your preferences into account and give you a custom experience.</p>
          <div className="grid gap-2">
            <div className="grid">
              <label className="text-left font-bold min-w-10 text-white">Purpose:</label>
              <textarea
                name="purpose"
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                placeholder='e.g. Social networking event for Freshmen...'
                className="transition duration-500 bg-white text-black rounded-md"/>
            </div>
            <div className="grid">
              <label className="text-left font-bold min-w-10 text-white">Participant Description:</label>
              <textarea
                name="information"
                value={information}
                onChange={e => setInformation(e.target.value)}
                placeholder='e.g. People who like learning and meeting new people...'
                className="transition duration-500 bg-white text-black rounded-md"/>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mx-auto my-4">
          {/* start */}
          <button onClick={startGame} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white flex gap-1"><span className="my-auto">{startSvg}</span> Start Game</button>
          {/* copy link */}
          <button onClick={copyGameLink} className="p-2 rounded-md bg-dt-500 dark:bg-dt-300 dark:text-black hover:opacity-80 text-white flex gap-1"><span className="my-auto">{copySvg}</span> Copy Link</button>
        </div>
        </>}

      {/* previous game's result, with details on previous rounds */}
      {gameStatus === 'JOINED' && rounds.length > 0 && <div className="grid gap-2 my-4">
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Previous Game</h3>
        <p className="my-2">Winner: {winner}</p>

        {/* round data */}
        {<div className="grid gap-2">
          {rounds.map((round, index) => (
            <div key={index} className="border-2 border-cc-500 rounded-lg p-2">
              <h4 className="text-3xl">Round {index + 1}</h4>
              <p>Prompt: {round.prompt}</p>
              <p>Responses:</p>
              <ul>
                {Object.entries(round.responses).map(([name, response]) => (
                  <li key={name}>{name}: {response}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>}
      </div>}

      {gameStatus === 'PLAYING' && <>
        {/* round counter */}
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">{prompts[currentRound]}</h3>

        {/* input box for hex code */}
        <input
          name="color"
          type="text"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder='Enter your best quip...'
          className="transition duration-500 bg-white dark:bg-gray-700 rounded-md me-2"/>
        
        {/* submit guess */}
        <button onClick={submitAnswer} className="my-2 p-2 rounded-md bg-ew-500 hover:opacity-80 text-white">Submit Quip</button>
        </>}

      {gameStatus === 'VOTING' && <>
        {/* Voting round */}
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Voting Round {currentVotingRound+1}</h3>

        {/* prompt */}
        <p className="">{rounds[currentVotingRound].prompt}</p>

        {/* responses, and can vote on the best response */}
        <div className="flex gap-4 my-4">
          {Object.entries(rounds[currentVotingRound].responses).map(([playerName, response], index) => (
            <button onClick={() => setVote(playerName)} className={`border-2 border-cc-500 ${playerName == vote && 'bg-cc-500'} rounded-lg h-60 w-60 text-center flex`}><span className="my-auto mx-auto">{response}</span></button>
          ))}
        </div>

        {/* submit vote */}
        <button onClick={submitVote} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white">Submit Vote</button>
      </>}

      {gameStatus === 'VOTE_ENDED' && <>
        {/* prompt */}
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">{rounds[currentVotingRound].prompt}</h3>

        {/* responses, and who voted on them */}
        <div className="grid gap-4 my-4 font-bold">
          {Object.entries(rounds[currentVotingRound].responses).map(([playerName, response], index) => (
            <div className="border-2 border-cc-500 rounded-lg p-2">
              <h4 className="text-3xl">{playerName}</h4>
              <p>Quip: {response}</p>
              Voters: {rounds[currentVotingRound].votes[playerName].join(", ")}
            </div>
          ))}
        </div>

        {/* acknowledge */}
        <button onClick={acknowledge} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white">Ready</button>
      </>}
    </div>
  </>;
}

export default QuipAI;
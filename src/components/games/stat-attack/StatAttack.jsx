import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { capitalise } from '../../../utils/string';
import gamesData from '../../../data/games/games.json';
import Swal from 'sweetalert2';
import party from 'party-js';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {SortableItem} from './SortableItem';

const crownSvg = <svg className="my-auto ms-1" width="20px" height="20px" viewBox="0 0 24 24" fill="#FA9E0D" xmlns="http://www.w3.org/2000/svg">
  <path d="M21.609 13.5616L21.8382 11.1263C22.0182 9.2137 22.1082 8.25739 21.781 7.86207C21.604 7.64823 21.3633 7.5172 21.106 7.4946C20.6303 7.45282 20.0329 8.1329 18.8381 9.49307C18.2202 10.1965 17.9113 10.5482 17.5666 10.6027C17.3757 10.6328 17.1811 10.6018 17.0047 10.5131C16.6865 10.3529 16.4743 9.91812 16.0499 9.04851L13.8131 4.46485C13.0112 2.82162 12.6102 2 12 2C11.3898 2 10.9888 2.82162 10.1869 4.46486L7.95007 9.04852C7.5257 9.91812 7.31351 10.3529 6.99526 10.5131C6.81892 10.6018 6.62434 10.6328 6.43337 10.6027C6.08872 10.5482 5.77977 10.1965 5.16187 9.49307C3.96708 8.1329 3.36968 7.45282 2.89399 7.4946C2.63666 7.5172 2.39598 7.64823 2.21899 7.86207C1.8918 8.25739 1.9818 9.2137 2.16181 11.1263L2.391 13.5616C2.76865 17.5742 2.95748 19.5805 4.14009 20.7902C5.32271 22 7.09517 22 10.6401 22H13.3599C16.9048 22 18.6773 22 19.8599 20.7902C21.0425 19.5805 21.2313 17.5742 21.609 13.5616Z" fill="#FA9E0D"/>
</svg>;

const copySvg = <svg className="invert dark:invert-0" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z" fill="#0F0F0F"/>
  <path d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z" fill="#0F0F0F"/>
</svg>;

const startSvg = <svg className="invert" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z" stroke="#000000" strokeWidth="2" strokeLinejoin="round"/>
</svg>;

const leaveSvg = <svg className="invert" width="20px" height="20px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Session-Leave">
          <rect id="Rectangle" fillRule="nonzero" x="0" y="0" width="24" height="24">

  </rect>
          <line x1="9" y1="12" x2="19" y2="12" id="Path" stroke="#0C0310" strokeWidth="2" strokeLinecap="round">

  </line>
          <path d="M16,8 L18.5858,10.5858 C19.3668,11.3668 19.3668,12.6332 18.5858,13.4142 L16,16" id="Path" stroke="#0C0310" strokeWidth="2" strokeLinecap="round">

  </path>
          <path d="M16,4 L6,4 C4.89543,4 4,4.89543 4,6 L4,18 C4,19.1046 4.89543,20 6,20 L16,20" id="Path" stroke="#0C0310" strokeWidth="2" strokeLinecap="round">

  </path>
      </g>
  </g>
</svg>;

const instructions = gamesData['stat-attack'].heroText;

function StatAttack({ id, deck, deckName }) {
  const WS_URL = `${import.meta.env.PUBLIC_WS}/api/games/stat-attack/${deckName}/`;
  const title = deck.title;
  const deckData = deck.data;
  const [players, setPlayers] = React.useState([]);
  const [name, setName] = React.useState('');
  const [gameStatus, setGameStatus] = React.useState(''); // UNJOINED, JOINED, PLAYING, PLAYED, SELECTING, SELECTED, END
  const [hand, setHand] = React.useState([]);
  const [playedCards, setPlayedCards] = React.useState([]);
  const [roundId, setRoundId] = React.useState(0);
  const [selectedCard, setSelectedCard] = React.useState(-1);
  const [allowSelect, setAllowSelect] = React.useState(false);
  const [isLost, setIsLost] = React.useState(false);
  const [isHigher, setIsHigher] = React.useState(true);
  const [isSpectating, setIsSpectating] = React.useState(false);

  const fields = Object.keys(deckData[0]); // we dont want 'name', so we remove it with shift
  fields.shift();
  const handSize = fields.length;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const {active, over} = event;
    
    if (active.id !== over.id) {
      setHand((hand) => {
        const oldIndex = hand.indexOf(active.id-1);
        const newIndex = hand.indexOf(over.id-1);
        
        return arrayMove(hand, oldIndex, newIndex);
      });
    }
  }

  const { sendJsonMessage, lastMessage } = useWebSocket(WS_URL+id, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    share: true
  });

  useEffect(() => {
    if (!lastMessage) return;
    const message = JSON.parse(lastMessage.data);
    const method = message.method;
    if ('is_higher' in message) setIsHigher(_ => message.is_higher);
    console.log(message);

    if (message.players) setPlayers(_ => message.players);

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
      setIsLost(false);
      setGameStatus('PLAYING');
    } else if (method === 'select') {
      setGameStatus('SELECTING');
      if (message.winner === name) {
        party.confetti(document.getElementById('winSelect'));
      }
      Swal.fire({
        icon: isSpectating ? 'info' : message.winner === name ? 'success' : 'error',
        title: message.winner === name ? `${capitalise(fields[message.round_id])}: You Win!` : `${capitalise(fields[message.round_id])}: ${message.winner} Wins!`,
        text: `${deckData[message.played_cards[0].card_id].name} has the ${isHigher ? 'highest' : 'lowest'} ${capitalise(fields[message.round_id])}!`,
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      });
      setRoundId(_ => message.round_id);
      setPlayedCards(_ => message.played_cards);
      setAllowSelect(_ => message.winner === name);
    } else if (method === 'next') {
      setGameStatus('PLAYING');
      setHand(_ => message.hand);
      setIsHigher(_ => message.is_higher);
    } else if (method === 'lose') {
      Swal.fire({
        icon: 'error',
        title: 'You lost! Not enough cards!',
        text: 'Wait for the surviving players to play their cards...',
        timer: 5000
      })
      setIsSpectating(true);
      setIsLost(true);
    } else if (method === 'end') {
      Swal.fire({
        icon: 'info',
        title: `Game Over! ${message.winner} Wins!`,
        text: `The game will end in 5 seconds...`,
        timer: 5000,
      })
      setIsSpectating(false);
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
    } else if (method === 'spectate') {
      Swal.fire({
        icon: 'info',
        title: 'Spectating...',
        text: 'You are now spectating the game.',
        timerProgressBar: true,
        timer: 2000
      });
      setGameStatus('SPECTATE');
      setIsSpectating(true);
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
    sendJsonMessage({ method: 'start', deck_size: deckData.length, hand_size: handSize });
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

  const play = () => {
    const handForJson = hand.map((id, index) => ({
      card_id: id,
      card_value: deckData[id][fields[index]]
    }));
    Swal.fire({
      title: 'Waiting for other players...',
      didOpen: () => {
        Swal.showLoading();
      }
    })
    sendJsonMessage({ method: 'play', hand: handForJson, name });
    setGameStatus('PLAYED');
  }

  const handleSelect = () => {
    sendJsonMessage({ method: 'select', card_id: selectedCard, name });
    setGameStatus('SELECTED');
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

  return (
    <div className="p-2 max-w-6xl mx-auto">
      {gameStatus !== 'UNJOINED' && <>
      <h1 className="animate-linear bg-[length:200%_auto] bg-gradient-to-r from-dt-500 to-dt-200 dark:to-dt-100 text-transparent bg-clip-text text-6xl font-extrabold my-4 inline-block">Stat Attack</h1>
      <p className="max-w-3xl mb-4 dark:text-white">{instructions} Deck: <span className="text-dt-500 dark:text-dt-200 font-bold">{title}</span></p>
      </>}
      {gameStatus === 'UNJOINED' && <div className="mt-40 text-center">
        <h1 className="animate-linear bg-[length:200%_auto] bg-gradient-to-r from-dt-500 to-dt-200 dark:to-dt-100 text-transparent bg-clip-text text-6xl font-extrabold my-4 inline-block">Stat Attack</h1>
        <p className="max-w-3xl mx-auto mb-4 dark:text-white">{instructions} Deck: <span className="text-dt-500 dark:text-dt-200 font-bold">{title}</span></p>
        <input
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Enter your name...'
          className="rounded-md me-2"/>
        <button onClick={joinGame} className="p-2 rounded-md bg-dt-500 dark:bg-dt-200 dark:text-black hover:opacity-80 text-white">Join Game</button>
      </div>}

      {/* show all players */}
      {gameStatus !== 'UNJOINED' && <>
      <h3 className="text-dt-500 dark:text-dt-200 font-bold text-xl my-2">Players</h3>
      <ul className="grid gap-1">
        {Object.entries(players).map(([playerName, { card_count, is_alive }]) => (
          <li key={playerName} className="dark:text-white"><span className="text-white bg-dt-500 dark:bg-dt-200 dark:text-black rounded-md p-1 me-1">{playerName}{playerName === name && ' (you)'}</span> {card_count} Cards {!is_alive && '(Lost)'}</li>
        ))}
        <li><span onClick={promptLeave} className="bg-ns-500 text-white dark:bg-ns-200 rounded-md p-1 hover:opacity-50 cursor-pointer">Leave Game</span></li>
      </ul>
      </>}

      {gameStatus === 'JOINED' && <>
      <h3 className="text-dt-500 dark:text-dt-200 font-bold text-xl my-2">Deck</h3>
      <ul className="grid gap-1">
        <li key="deckName" className="dark:text-white"><span className="text-white bg-dt-500 dark:bg-dt-200 dark:text-black rounded-md p-1 me-1">Deck Name</span> {title}</li>
        <li key="noCards" className="dark:text-white"><span className="text-white bg-dt-500 dark:bg-dt-200 dark:text-black rounded-md p-1 me-1">No. of Cards</span> {deckData.length}</li>
        <li key="statistics" className="dark:text-white"><span className="text-white bg-dt-500 dark:bg-dt-200 dark:text-black rounded-md p-1 me-1">Statistics</span> {Object.keys(deckData[0]).slice(1).map(capitalise).join(", ")}</li>
      </ul>
      <div className="flex gap-2 mx-auto my-4">
        {/* start */}
        <button onClick={startGame} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white flex gap-1"><span className="my-auto">{startSvg}</span> Start Game</button>
        {/* copy link */}
        <button onClick={copyGameLink} className="p-2 rounded-md bg-dt-500 dark:bg-dt-200 dark:text-black hover:opacity-80 text-white flex gap-1"><span className="my-auto">{copySvg}</span> Copy Link</button>
      </div>
      </>}

      {gameStatus === 'PLAYING' && !isLost && <h3 className="text-dt-500 dark:text-dt-200 text-xl font-bold my-2">Try to get the <span className="underline font-bold">{isHigher ? 'highest' : 'lowest'}</span> value for each statistic!</h3>}
      {gameStatus === 'PLAYED' && !isLost && <h3 className="text-dt-500 dark:text-dt-200 text-xl font-bold my-2">Waiting for other players...</h3>}
      {isLost && isSpectating && <h3 className="text-dt-500 dark:text-dt-200 text-xl font-bold my-2">You lost! So wait for the surviving players to play their cards!</h3>}
      {(gameStatus === 'PLAYING' || gameStatus === 'PLAYED') && !isLost && <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      ><SortableContext 
        items={hand.map(h => h+1)}
        strategy={verticalListSortingStrategy}
      >{hand.map((id, i) => <SortableItem field={fields[i]} key={id+1} id={id+1} data={deckData[id]} fields={fields}/>)}
      </SortableContext></DndContext>}
      {gameStatus === 'PLAYING' && <button onClick={play} className="py-2 px-4 rounded-md bg-ew-500 hover:opacity-80 text-white my-4">Play</button>}

      <div id="winSelect">{gameStatus === 'SELECTING' && (allowSelect
        ? <h3 className="text-dt-500 dark:text-dt-200 text-xl font-bold my-2">You won! Select a card to add to your deck!</h3>
        : <h3 className="text-dt-500 dark:text-dt-200 text-xl font-bold my-2 flex">Waiting for winner to pick a card...</h3>)}</div>
      {gameStatus === 'SELECTING' && <ul className="grid gap-2">
        {playedCards.map((card, index) => (
          <li key={card.name} onClick={() => {if (allowSelect) {setSelectedCard(card.card_id);}}} className={`animate-linear bg-[length:200%_auto] bg-dt-100/10 p-4 border-[1px] rounded-md ${allowSelect && 'hover:border-dt-300 cursor-pointer'} ${selectedCard === card.card_id ? 'bg-gradient-to-r from-dt-500 to-dt-300 text-white' : ''}`}>
            <h3 className={`flex text-xl font-bold mb-2 ${selectedCard === card.card_id ? 'text-white' : 'text-dt-500 dark:text-dt-200'}`}>{deckData[card.card_id].name} ({card.name}) {index === 0 && crownSvg}
            </h3>
            <ul className="grid gap-2">
            {fields.map((fieldName, index) => <p className="dark:text-white" key={fieldName}>
              <span key={fieldName} className={`font-bold ${selectedCard === card.card_id ? index === roundId ? 'bg-white text-dt-500 dark:text-dt-200' : '' : index === roundId ? 'bg-dt-500 dark:bg-dt-200 dark:text-black text-white' : 'bg-gray-500/20'} rounded-md p-1`}>{capitalise(fieldName)}</span> {deckData[card.card_id][fieldName]}
            </p>)}
            </ul>
          </li>
        ))}
      </ul>}
      {gameStatus === 'SELECTING' && allowSelect && <button onClick={handleSelect} className="py-2 px-4 rounded-md bg-ew-500 hover:opacity-80 text-white my-4">Select</button>}
    </div>
  );
}

export default StatAttack;
import React, { useState } from 'react';
import gamesData from "../../../data/games/games.json";
import Swal from 'sweetalert2';

function BurningBridgesRoomCreate() {
  const [gameId, setGameId] = useState('');
  const showInstructions = () => {
    Swal.fire({
      title: 'How to Play',
      icon: 'info',
      html: `<div class="text-left grid grid-cols-[auto_1fr] gap-2">
        ${gamesData['quip-ai'].instructions.map((line, index) => `<span><b>Step ${index}</b></span></span>${line}</span>`).join('')}
      </div>
      `,
      confirmButtonText: 'Got it!'
    });
  }

  return (
    <div className="p-4 md:p-6 rounded-3xl shadow-md max-w-3xl mx-auto bg-ne-500">
    <div className="text-left lg:text-center">
      <h1 className="text-white text-3xl lg:text-6xl font-extrabold my-4 inline-block">Quip AI</h1>
      <p className="max-w-3xl mb-4 text-white">{gamesData['quip-ai'].heroText} <span className="underline hover:text-ne-300 cursor-pointer" onClick={showInstructions}>How to Play.</span></p>
      <div className="flex flex-wrap lg:place-content-center">
        <input
          name="gameId"
          type="text"
          value={gameId}
          onChange={e => setGameId(e.target.value)}
          placeholder='Enter Game ID...'
          className="transition duration-500 bg-white rounded-md me-2 text-black"/>
        <a href={`${window.location.href}/${gameId}`} type="button" className="me-2 p-2 rounded-md bg-dt-500 dark:bg-dt-200 hover:opacity-80 text-white">Create Game</a>
        <a href={`${window.location.href}/${gameId}`} type="button" className="p-2 rounded-md bg-dt-500 dark:bg-dt-200 hover:opacity-80 text-white">Join Game</a>
      </div>
    </div>
    </div>
  );
}

export default BurningBridgesRoomCreate;
import React, { useState } from 'react';
import gamesData from "../../../data/games/games.json";

function StatAttackRoomCreate({ title, instructions }) {
  const [gameId, setGameId] = useState('');

  return (
    <div className="p-2 max-w-6xl mx-auto">
      <div className="mt-40 text-center">
        <h1 className="animate-linear bg-[length:200%_auto] bg-gradient-to-r from-dt-500 to-dt-300 text-transparent bg-clip-text text-6xl font-extrabold my-4 inline-block">Stat Attack</h1>
        <p className="max-w-3xl mx-auto mb-4 ">{gamesData['stat-attack'].heroText} {instructions} Deck: <span className="text-dt-500 dark:text-dt-200 font-bold">{title}</span></p>
        <div className="flex flex-wrap place-content-center">
          <input
            name="gameId"
            type="text"
            value={gameId}
            onChange={e => setGameId(e.target.value)}
            placeholder='Enter Game ID...'
            className="transition duration-500 bg-white dark:bg-gray-700 rounded-md me-2"/>
          <a href={`${window.location.href}/${gameId}`} type="button" className="me-2 p-2 rounded-md bg-dt-500 dark:bg-dt-200 dark:text-black hover:opacity-80 text-white">Create Game</a>
          <a href={`${window.location.href}/${gameId}`} type="button" className="p-2 rounded-md bg-dt-500 dark:bg-dt-200 dark:text-black hover:opacity-80 text-white">Join Game</a>
        </div>
      </div>
    </div>
  );
}

export default StatAttackRoomCreate;
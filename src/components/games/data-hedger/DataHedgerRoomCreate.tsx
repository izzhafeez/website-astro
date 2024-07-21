import React, { useState } from 'react';
import gamesData from "../../../data/games/games.json";

function DataHedgerRoomCreate() {
  const [gameId, setGameId] = useState('');

  return (
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
  );
}

export default DataHedgerRoomCreate;
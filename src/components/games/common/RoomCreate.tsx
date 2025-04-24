import React, { useState } from 'react';

const RoomCreate = () => {
  const [gameId, setGameId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameId) return;
    window.location.href = `${window.location.href}/${gameId}`;
  }

  return <div className="flex flex-wrap place-content-center">
    <form onSubmit={handleSubmit}>
      <input
        autoFocus
        name="gameId"
        type="text"
        value={gameId}
        onChange={e => setGameId(e.target.value)}
        placeholder='Enter Game ID...'
        className="transition duration-500 bg-gray-100 dark:bg-gray-700 rounded-md me-2"/>
    </form>
    <a href={`${window.location.href}/${gameId}`} type="button" className="me-2 p-2 rounded-md bg-dt-500 dark:bg-dt-200 dark:text-black hover:opacity-80 text-white">Create Game</a>
    <a href={`${window.location.href}/${gameId}`} type="button" className="p-2 rounded-md bg-dt-500 dark:bg-dt-200 dark:text-black hover:opacity-80 text-white">Join Game</a>
  </div>;
}

export default RoomCreate;
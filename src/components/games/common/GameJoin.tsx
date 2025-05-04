import React from 'react';

const GameJoin = ({ title, instructions, name, setName, joinGame }: { title: string, instructions: string, name: string, setName: (name: string) => void, joinGame: () => void }) => (
  <div className="mt-40 text-center">
    <h1 className="animate-linear bg-[length:200%_auto] bg-gradient-to-r from-dt-500 to-dt-300 text-transparent bg-clip-text text-6xl font-extrabold my-4 inline-block">{title}</h1>
    <p className="max-w-3xl mx-auto mb-4 ">{instructions}</p>
    <form onSubmit={joinGame}>
      <input
        autoFocus
        name="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Enter your name...'
        className="transition duration-500 bg-gray-100 dark:bg-gray-700 rounded-md me-2"/>
      <button
        type="submit"
        className="p-2 rounded-md bg-dt-500 dark:bg-dt-300 dark:text-black hover:opacity-80 text-white">Join Game</button>
    </form>
  </div>
);

export default GameJoin;
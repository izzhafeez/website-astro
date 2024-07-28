import React from 'react';

const GameTitle = ({ title }: { title: string }) => (
  <h1 className="animate-linear bg-[length:200%_auto] bg-gradient-to-r from-dt-500 to-dt-300 text-transparent bg-clip-text text-6xl font-extrabold my-4 inline-block">{title}</h1>
);

export default GameTitle;
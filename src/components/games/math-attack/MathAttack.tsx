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
  { rep: 'f(x) = 4', fn: (x: number) => 4 },
  { rep: 'f(x) = 5', fn: (x: number) => 5 },
  { rep: 'f(x) = 10', fn: (x: number) => 10 },
  { rep: 'f(x) = 100', fn: (x: number) => 100 },
  { rep: 'f(x) = floor(x)/2', fn: (x: number) => Math.floor(x)/2 },
  { rep: 'f(x) = round(x)', fn: (x: number) => Math.round(x) },
  { rep: 'f(x) = x', fn: (x: number) => x },
  { rep: 'f(x) = πx', fn: (x: number) => Math.PI*x },
  { rep: 'f(x) = x + 5', fn: (x: number) => x+5 },
  { rep: 'f(x) = 100x', fn: (x: number) => 100*x },
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
  { rep: 'f(x) = x^|x|', fn: (x: number) => x**Math.abs(x) }, // x^x
  { rep: 'f(x) = 2x^2 - x', fn: (x: number) => 2*(x**2) - x },
  { rep: 'f(x) = 3x^2 - 2x + 1', fn: (x: number) => 3*(x**2) - 2*x + 1 },
  { rep: 'f(x) = -x^2 + 3x + 5', fn: (x: number) => -(x**2) + 3*x + 5 },
  { rep: 'f(x) = sqrt(|x|)', fn: (x: number) => Math.abs(x)**0.5 },
  { rep: 'f(x) = sqrt(|2x + 1|)', fn: (x: number) => Math.abs(2*x + 1)**0.5 },
  { rep: 'f(x) = 150sin(x)', fn: (x: number) => 150*Math.sin(x) },
  { rep: 'f(x) = 150cos(x)', fn: (x: number) => 150*Math.cos(x) },
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
  { rep: 'f(x) = 1/(x % 1)', fn: (x: number) => 1/(x - Math.floor(x)) },
  { rep: 'f(x) = -100', fn: (x: number) => -100 },
  { rep: 'f(x) = 0.1', fn: (x: number) => 0.1 },
  { rep: 'f(x) = 1.5', fn: (x: number) => 1.5 },
  { rep: 'f(x) = π', fn: (x: number) => Math.PI },
  { rep: 'f(x) = e', fn: (x: number) => Math.E },
  { rep: 'f(x) = sin(πx)', fn: (x: number) => Math.sin(Math.PI*x) },
  { rep: 'f(x) = cos(πx)', fn: (x: number) => Math.cos(Math.PI*x) },
  { rep: 'f(x) = tan(πx)', fn: (x: number) => Math.tan(Math.PI*x) },
  { rep: 'f(x) = 1/log(|x|+1)', fn: (x: number) => 1/Math.log(Math.abs(x)+1) },
  { rep: 'f(x) = xe^(sinx)', fn: (x: number) => x*Math.exp(Math.sin(x)) },
  { rep: 'f(x) = e^(-x)sinx', fn: (x: number) => Math.exp(-x)*Math.sin(x) },
  { rep: 'f(x) = -50', fn: (x: number) => -50 },
  { rep: 'f(x) = 2x', fn: (x: number) => 2*x },
  { rep: 'f(x) = (x - 5)(x - 7)', fn: (x: number) => (x - 5)*(x - 7) },
  { rep: 'f(x) = x(x - 2)(x - 4)', fn: (x: number) => x*(x - 2)*(x - 4) },
  { rep: 'f(x) = cbrt(x)', fn: (x: number) => Math.cbrt(x) },
  { rep: 'f(x) = e^(-x^2)', fn: (x: number) => Math.exp(-(x**2)) },
  { rep: 'f(x) = max(1000x, 200sin(x))', fn: (x: number) => Math.max(1000*x, 200*Math.sin(x)) },
  { rep: 'f(x) = min(1000x, 200sin(x))', fn: (x: number) => Math.min(1000*x, 200*Math.sin(x)) },
  { rep: 'f(x) = 1/(x % 2)', fn: (x: number) => 1/(x % 2) },
  { rep: 'f(x) = |100sin(x)| + 50', fn: (x: number) => Math.abs(100*Math.sin(x)) + 50 },
  { rep: 'f(x) = 25x + 25', fn: (x: number) => 25*x + 25 },
  { rep: 'f(x) = sqrt(tan(x))', fn: (x: number) => Math.tan(x)**0.5 },
  { rep: 'f(x) = max(tan(x), 150sin(x), 150cos(x))', fn: (x: number) => Math.max(Math.tan(x), 150*Math.sin(x), 150*Math.cos(x)) },
  { rep: 'f(x) = 200sin(πx)', fn: (x: number) => 200*Math.sin(Math.PI*x) },
  { rep: 'f(x) = e^-100', fn: (x: number) => Math.exp(-100) },
  { rep: 'f(x) = x^-10', fn: (x: number) => x**-10 },
  { rep: 'f(x) = 2.5', fn: (x: number) => 2.5 },
  { rep: 'f(x) = 0.01', fn: (x: number) => 0.01 },
  { rep: 'f(x) = x + 1', fn: (x: number) => x + 1 },
  { rep: 'f(x) = x + 2', fn: (x: number) => x + 2 },
  { rep: 'f(x) = x + 3', fn: (x: number) => x + 3 },
  { rep: 'f(x) = round(x)', fn: (x: number) => Math.round(x) },
  { rep: 'f(x) = floor(x)', fn: (x: number) => Math.floor(x) },
  { rep: 'f(x) = 19', fn: (x: number) => 19 },
  { rep: 'f(x) = 100x - 200', fn: (x: number) => 100*x - 200 },
  { rep: 'f(x) = 10x - 20', fn: (x: number) => 10*x - 20 },
  { rep: 'f(x) = -x + 1', fn: (x: number) => -x + 1 },
  { rep: 'f(x) = 1/sigmoid(x)', fn: (x: number) => 1 + Math.exp(-x) },
  { rep: 'f(x) = x + 25', fn: (x: number) => x + 25 },
  { rep: 'f(x) = x + 100', fn: (x: number) => x + 100 },
  { rep: 'f(x) = x - 100', fn: (x: number) => x - 100 },
  { rep: 'f(x) = sinh(x)', fn: (x: number) => Math.sinh(x) },
  { rep: 'f(x) = cosh(x)', fn: (x: number) => Math.cosh(x) },
  { rep: 'f(x) = tanh(x)', fn: (x: number) => Math.tanh(x) },
  { rep: 'f(x) = sech(x)', fn: (x: number) => 1/Math.cosh(x) },
  { rep: 'f(x) = csch(x)', fn: (x: number) => 1/Math.sinh(x) },
  { rep: 'f(x) = sigmoid(x)', fn: (x: number) => 1/(1 + Math.exp(-x)) },
  { rep: 'f(x) = 1000relu(x)', fn: (x: number) => 1000*Math.max(0, x) },
  { rep: 'f(x) = x - 6', fn: (x: number) => x - 6 },
  { rep: 'f(x) = x / 2', fn: (x: number) => x / 2 },
  { rep: 'f(x) = x / 1000', fn: (x: number) => x / 1000 },
  { rep: 'f(x) = 0.1x + 5', fn: (x: number) => 0.1*x + 5 },
  { rep: 'f(x) = 0.1x^2 + x', fn: (x: number) => 0.1*(x**2) + x },
  { rep: 'f(x) = (x - 10)(x + 10)', fn: (x: number) => (x - 10)*(x + 10) },
  { rep: 'f(x) = 2xsin(x)', fn: (x: number) => 2*x*Math.sin(x) },
  { rep: 'f(x) = 2xcos(x)', fn: (x: number) => 2*x*Math.cos(x) },
  { rep: 'f(x) = πfloor(x)', fn: (x: number) => Math.PI*Math.floor(x) },
  { rep: 'f(x) = πceil(x)', fn: (x: number) => Math.PI*Math.ceil(x) },
  { rep: 'f(x) = πround(x)', fn: (x: number) => Math.PI*Math.round(x) },
  { rep: 'f(x) = nCr(round(x), 2)', fn: (x: number) => Math.round(x)*(Math.round(x)-1)/2 },
  { rep: 'f(x) = nCr(round(x), 3)', fn: (x: number) => Math.round(x)*(Math.round(x)-1)*(Math.round(x)-2)/6 },
  { rep: 'f(x) = tan(x)^round(x)', fn: (x: number) => Math.tan(x)**Math.round(x) },
  { rep: 'f(x) = random() * 150', fn: (x: number) => Math.random()*150 },
  { rep: 'f(x) = 1 / random()', fn: (x: number) => 1/Math.random() },
  { rep: 'f(x) = arctan(x)', fn: (x: number) => Math.atan(x) },
  { rep: 'f(x) = max(x^2, 10x)', fn: (x: number) => Math.max(x**2, 10*x) },
  { rep: 'f(x) = x + 190', fn: (x: number) => x + 190 },
  { rep: 'f(x) = x - 190', fn: (x: number) => x - 190 },
  { rep: 'f(x) = tan(πx/2)', fn: (x: number) => Math.tan(Math.PI*x/2) },
  { rep: 'f(x) = 10x + 10/x', fn: (x: number) => 10*x + 10/x },
  { rep: 'f(x) = 1/(x - 10)(x + 10)', fn: (x: number) => 1/((x - 10)*(x + 10)) },
  { rep: 'f(x) = 100/(sin(x) + cos(x))', fn: (x: number) => 100/(Math.sin(x) + Math.cos(x)) },
  { rep: 'f(x) = 0.1^x', fn: (x: number) => 0.1**x },
  { rep: 'f(x) = x - x', fn: (x: number) => 0 },
  { rep: 'f(x) = 2^(x^2)', fn: (x: number) => 2**(x**2) },
  { rep: 'f(x) = min(200relu(x), 200relu(-x))', fn: (x: number) => Math.min(200*Math.max(0, x), 200*Math.max(0, -x)) },
  { rep: 'f(x) = 100sin(x) + 100cos(x)', fn: (x: number) => 100*Math.sin(x) + 100*Math.cos(x) },
  { rep: 'f(x) = 150sin(2x)', fn: (x: number) => 150*Math.sin(2*x) },
  { rep: 'f(x) = 1/sin(100x)', fn: (x: number) => 1/Math.sin(100*x) },
  { rep: 'f(x) = x^3 - 10x^2', fn: (x: number) => x**3 - 10*(x**2) },
  { rep: 'f(x) = 0.1x^3 - x^2 + 10x', fn: (x: number) => 0.1*(x**3) - (x**2) + 10*x },
  { rep: 'f(x) = x^100', fn: (x: number) => x**100 },
  { rep: 'f(x) = 2x - 6', fn: (x: number) => 2*x - 6 },
  { rep: 'f(x) = 1.5x - 4', fn: (x: number) => 1.5*x - 4 },
  { rep: 'f(x) = 0.75x + 4', fn: (x: number) => 0.75*x + 4 },
  { rep: 'f(x) = 0.001e^x', fn: (x: number) => 0.001*Math.exp(x) },
  { rep: 'f(x) = sinh(x) + cosh(x)', fn: (x: number) => Math.sinh(x) + Math.cosh(x) },
  { rep: 'f(x) = 100sin(x)cos(x)tan(x)', fn: (x: number) => 100*Math.sin(x)*Math.cos(x)*Math.tan(x) },
  { rep: 'f(x) = 0', fn: (x: number) => 0 },
  { rep: 'f(x) = 1 + e^(-x)', fn: (x: number) => 1 + Math.exp(-x) },
  { rep: 'f(x) = 1 - e^(-x)', fn: (x: number) => 1 - Math.exp(-x) },
  { rep: 'f(x) = (1 + 1/x)^round(x)', fn: (x: number) => (1 + 1/x)**Math.round(x) },
  { rep: 'f(x) = 1.01^(100x)', fn: (x: number) => 1.01**(100*x) },
  { rep: 'f(x) = 150sin(x - 1)', fn: (x: number) => 150*Math.sin(x - 1) },
  { rep: 'f(x) = 150sin(x + 1)', fn: (x: number) => 150*Math.sin(x + 1) },
  { rep: 'f(x) = 1/(x + 1)', fn: (x: number) => 1/(x+1) },
  { rep: 'f(x) = 1/(x - 100)', fn: (x: number) => 1/(x-100) },
  { rep: 'f(x) = 10/x', fn: (x: number) => 10/x },
  { rep: 'f(x) = 5000/x', fn: (x: number) => 5000/x },
  { rep: 'f(x) = 10000/(x - 100)', fn: (x: number) => 10000/(x-100) },
  { rep: 'f(x) = (x - 60)(x - 70)', fn: (x: number) => (x - 60)*(x - 70) },
  { rep: 'f(x) = (x + 80)(x + 100)', fn: (x: number) => (x + 80)*(x + 100) },
  { rep: 'f(x) = x^2 - 10000', fn: (x: number) => x**2 - 10000 },
  { rep: 'f(x) = 99.99', fn: (x: number) => 99.99 },
  { rep: 'f(x) = -90', fn: (x: number) => -90 },
  { rep: 'f(x) = -67', fn: (x: number) => -67 },
  { rep: 'f(x) = x - 69', fn: (x: number) => x - 69 },
  { rep: 'f(x) = 1.2x - 100', fn: (x: number) => 1.2*x - 100 },
  { rep: 'f(x) = max(100, 1000x)', fn: (x: number) => Math.max(100, 1000*x) },
  { rep: 'f(x) = min(-100, 1000x)', fn: (x: number) => Math.min(100, 1000*x) },
  { rep: 'f(x) = x^4 / 1000', fn: (x: number) => (x**4)/1000 },
  { rep: 'f(x) = 0.5', fn: (x: number) => 0.5 },
  { rep: 'f(x) = 99 + 0.01x^2', fn: (x: number) => 99 + 0.01*(x**2) },
  { rep: 'f(x) = 90 + x^2', fn: (x: number) => 90 + (x**2) },
  { rep: 'f(x) = g', fn: (x: number) => 9.81 },
  { rep: 'f(x) = sqrt(2)', fn: (x: number) => Math.sqrt(2) },
  { rep: 'f(x) = sqrt(3)', fn: (x: number) => Math.sqrt(3) },
  { rep: 'f(x) = TREE(2)', fn: (x: number) => 3 },
  { rep: 'f(x) = apery\'s constant', fn: (x: number) => 1.2020569031595942854 },
  { rep: 'f(x) = euler-mascheroni constant', fn: (x: number) => 0.5772156649015328606 },
  { rep: 'f(x) = golden ratio', fn: (x: number) => 1.618033988749895 },
  { rep: 'f(x) = silver ratio', fn: (x: number) => 2.414213562373095 },
  { rep: 'f(x) = feigenbaum constant', fn: (x: number) => 4.669201609102990671853203820466201617258185577475768632745651343004134 },
  { rep: 'f(x) = khinchin constant', fn: (x: number) => 2.6854520010 },
  { rep: 'f(x) = planck constant', fn: (x: number) => 6.62607015e-34 },
  { rep: 'f(x) = number of stars in the solar system', fn: (x: number) => 1 },
  { rep: 'f(x) = -2', fn: (x: number) => -2 },
  { rep: 'f(x) = 0.5x + 0.5', fn: (x: number) => 0.5*x + 0.5 },
  { rep: 'f(x) = 1000/(50 - x)', fn: (x: number) => 1000/(50 - x) },
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

type HistoryState = {
  player: string;
  card_id: number;
  number: number;
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
  const [history, setHistory] = React.useState([] as HistoryState[]);

  const { sendJsonMessage, lastMessage } = useWebSocket(WS_URL+id, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    share: true
  });
  // const sendJsonMessage = () => {};
  // const lastMessage = null;

  const joinGame = () => {
    sendJsonMessage({ method: 'join', name, deck_size: allCards.length })
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
    setNumber(STARTING_NUMBER);
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
    console.log(number)
    let newNumber = card.fn(number);
    if (newNumber === Infinity || newNumber === -Infinity || isNaN(newNumber)) {
      // set to some ridiculously large number
      newNumber = 1000000000000000;
    }
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

  const STARTING_NUMBER = 0;
  const LOWEST_NUMBER = -100;
  const HIGHEST_NUMBER = 100;
  useEffect(() => {
    if (!lastMessage) return;
    const message = JSON.parse(lastMessage.data);
    console.log(message);
    if (message.players) setPlayers(_ => message.players);
    if (message.hand) setHand(_ => message.hand);
    if (message.state) setGameState(_ => message.state);
    if (message.number != undefined) setNumber(_ => message.number);
    if (message.player) setCurrentPlayer(_ => message.player);
    if (message.last_played) setLastPlayed(_ => message.last_played);
    if (message.players && message.players[name]) setPlayerState(_ => message.players[name]);
    if (message.history) setHistory(_ => message.history);
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

  const names = allCards.map(card => card.rep).join(' ');

  return (
    <div className="p-2 max-w-6xl mx-auto">
      <p className="fixed h-screen inset-0 overflow-clip font-mono transition duration-500 text-gray-200/50 dark:text-gray-700 px-2 text-center bg-white dark:bg-gray-800 w-full -z-10 text-wrap">
        {Array.from({length: Math.floor(10000/allCards.length) }, () => names)}
      </p>
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
          className="transition duration-500 bg-gray-100 dark:bg-gray-700 rounded-md me-2"/>
        <button onClick={joinGame} className="p-2 rounded-md bg-dt-500 dark:bg-dt-300 dark:text-black hover:opacity-80 text-white">Join Game</button>
      </div>}

      {/* show all players */}
      {playerState !== PlayerStates.UNJOINED && <>
      <h3 className="text-dt-700 dark:text-dt-300 font-bold text-xl my-2">Players</h3>
      <ul className="grid gap-2">
        {Object.entries(players).map(([playerName, is_alive]) => (
          <li key={playerName} className=""><span className="text-white bg-dt-500 dark:bg-dt-300 dark:text-black rounded-md p-1 me-1">{playerName}{playerName === name && ' (you)'}</span> {!is_alive && '(Lost)'}</li>
        ))}
        <li><span onClick={promptLeave} className="bg-ns-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">Leave Game</span></li>
      </ul>
      </>}
      {playerState === PlayerStates.LOBBY && <div className="my-4 max-w-xl">
      <h3 className="text-dt-700 dark:text-dt-300 font-bold text-xl my-2">Instructions</h3>
      <span>{instructions}</span>
      <div className="flex gap-2 mx-auto my-4">
        {/* start */}
        <button onClick={startGame} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white flex gap-1"><span className="my-auto">{startSvg}</span> Start Game</button>
        {/* copy link */}
        <button onClick={copyGameLink} className="p-2 rounded-md bg-dt-500 dark:bg-dt-300 dark:text-black hover:opacity-80 text-white flex gap-1"><span className="my-auto">{copySvg}</span> Copy Link</button>
      </div>
      </div>}
      {(playerState === PlayerStates.WAITING || playerState === PlayerStates.TURN) && <div className="my-4">
          <b>Current Number:</b> {number}<br/>
          <b>Limits:</b> {LOWEST_NUMBER}, {HIGHEST_NUMBER}<br/>
          <h3 className="text-dt-700 dark:text-dt-300 font-bold text-xl my-2">{currentPlayer === name ? "Your" : `${currentPlayer}'s`} turn!</h3>
        </div>}
      {(playerState === PlayerStates.TURN || playerState === PlayerStates.WAITING) && <div className="grid grid-cols-3 gap-4 max-w-xl">
        {hand.map(cardId => <div className={`border-2 border-cc-500 aspect-square p-4 rounded-xl flex ${playerState === PlayerStates.TURN && 'cursor-pointer'} ${cardId === selectedCard && 'bg-cc-500'}`} onClick={() => handleSelect(cardId)} key={cardId}>
          <div className={`m-auto`}>{allCards[cardId].rep}</div>
          </div>)}
        </div>}
      {playerState === PlayerStates.TURN && <button onClick={() => playCard()} className="px-2 py-1 rounded-md bg-ew-mrt my-2">Play Card</button>}

      {/* History */}
      {history.length > 0 && playerState !== PlayerStates.UNJOINED && <>
      <h3 className="text-dt-700 dark:text-dt-300 font-bold text-xl my-2 mt-4">History</h3>
      <ul className="mb-8">
        {history.map(({player, card_id, number}, i) => (
          <li key={i}>{player} played {allCards[card_id].rep} to get {number}</li>
        ))}
      </ul></>}
    </div>
  );
};

export default MathAttack;
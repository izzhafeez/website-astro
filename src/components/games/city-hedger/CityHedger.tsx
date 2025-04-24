import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import gamesData from '../../../data/games/games.json';
import Swal from 'sweetalert2';
import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import lifecycle from '../common/GameLifecycle';
import GameStart from '../common/GameStart';
import GameTitle from '../common/GameTitle';
import GameJoin from '../common/GameJoin';
import countryCodes from '../../../data/games/city-hedger/country-codes.json';
import countryBounds from '../../../data/games/city-hedger/country-bounds.json';

const instructions = gamesData['city-hedger'].heroText;

type PlayerData = {
  points: number;
  played: { name: string, lat: number, lng: number };
  distance: number;
  acknowledged: boolean;
}

const colors = [
  '#FF3E00',
  '#673AB8',
  '#FA9E0D',
  '#139ECA',
  '#C6732F',
  '#00B8CC',
  '#FF0AFF',
  '#97C616',
  '#10C8FA'
];

function CityHedger({ id, title, country }: { id: string, title: string, country: string }) {
  const [players, setPlayers] = React.useState({} as {[name: string]: PlayerData});
  const [name, setName] = React.useState('');
  const [gameStatus, setGameStatus] = React.useState('UNJOINED');
  const [lat, setLat] = React.useState(0);
  const [lng, setLng] = React.useState(0);
  const [city, setCity] = React.useState('');
  const [roundId, setRoundId] = React.useState(0);
  const [gained, setGained] = React.useState({} as { [name: string]: { points: number } })
  const [mostPopularCity, setMostPopularCity] = React.useState('');
  const [failedPlayers, setFailedPlayers] = React.useState([] as string[]);

  const { min_lat, max_lat, min_lng, max_lng } = countryBounds[country as keyof typeof countryBounds];
  const WS_URL = `${import.meta.env.PUBLIC_WS}/api/games/city-hedger/${title.toUpperCase()}+${id}/${country}/${min_lat}/${max_lat}/${min_lng}/${max_lng}`;
  const distance = Math.sqrt((max_lat - min_lat)**2 + (max_lng - min_lng)**2);
  const zoom = Math.floor(8 - Math.log2(distance) + 1);

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
    if (message.lat) setLat(_ => message.lat);
    if (message.lng) setLng(_ => message.lng);
    if (message.round_id) setRoundId(_ => message.round_id);
    if (message.gained) setGained(_ => message.gained);
    if (message.most_popular) setMostPopularCity(_ => message.most_popular);
    if (message.failed) setFailedPlayers(_ => message.failed);

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
        text: `Choose a city closest to this point!`,
        timer: 1500,
      })
    } else if (method === 'evaluate') {
      setGameStatus('EVALUATING');
      Swal.fire({
        icon: 'info',
        title: `Results`,
        html: `<table class="w-full text-sm text-left rtl:text-right text-gray-700 mt-4">
          <thead class="text-xs text-gray-700 uppercase bg-white">
            <tr>
              <th scope="col" class="px-6 py-3">Player</th>
              <th scope="col" class="px-6 py-3">City</th>
              <th scope="col" class="px-6 py-3">Distance</th>
            </tr>
          </thead>
          ${Object.entries(message.players as {[name: string]: PlayerData}).sort(([_, playerData]) => playerData.distance).map(([name, playerData]) => `
            <tr class="bg-gray-100 border-b">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${name}</th>
              <td class="px-6 py-4 font-light">${playerData.played.name}</td>
              <td class="px-6 py-4 font-light">${playerData.distance.toFixed(1)}km</td>
            </tr>
          `).join('')}
        </table>`
      }).then(() => {
        if (message.most_popular_city != -1) {
          Swal.fire({
            icon: 'warning',
            title: `Popular!`,
            text: `Players who played the most popular city (${message.most_popular_city}) lose 50 points: ${message.failed.join(', ')}`,
            timer: 5000,
          });
        }
      });
    } else if (method === 'play_error') {
      setGameStatus('PLAYING');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Invalid city name! Please try again."
      })
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
    sendJsonMessage({ method: 'join', name });
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

  const submitGuess = () => {
    Swal.fire({
      title: 'Waiting for other players...',
      didOpen: () => {
        Swal.showLoading();
      }
    })
    
    sendJsonMessage({ method: 'play', name, played: city });
    setGameStatus('PLAYED');
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

  const howToPlay = `Based on the given name, guess the location on the map. The player with the closest guess gets a point!`;

  return <>
    <div className="p-2 max-w-3xl mx-auto">
      {gameStatus !== 'UNJOINED' && <GameTitle title={countryCodes[title.toUpperCase() as keyof typeof countryCodes]}/>}
      {gameStatus === 'JOINED' && <GameStart instructions={instructions} startGame={startGame}/>}
      {gameStatus === 'UNJOINED' && <GameJoin title={countryCodes[title.toUpperCase() as keyof typeof countryCodes]} instructions={instructions} name={name} setName={setName} joinGame={joinGame}/>}

      {/* show all players */}
      {gameStatus !== 'UNJOINED' && <>
      <h3 className="text-dt-700 dark:text-dt-300 font-bold text-xl my-2">Players</h3>
      <ul className="grid gap-2">
        {Object.entries(players).map(([playerName, playerData]) => (
          <li key={playerName} className="">
            <span className="text-white bg-dt-500 dark:bg-dt-300 dark:text-black rounded-md p-1 me-1">{playerName}{playerName === name && ' (you)'}{playerData.played && gameStatus !== 'EVALUATING' && ' (played)'}{playerData.acknowledged && ' (ready)'}</span> {playerData.points} Points
          </li>
        ))}
        <li><span onClick={() => lifecycle.showHowToPlay(howToPlay)} className="bg-cc-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">How to Play</span></li>
        <li><span onClick={() => lifecycle.promptLeave(leaveGame)} className="bg-ns-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">Leave Game</span></li>
      </ul>
      </>}

      {(gameStatus === 'PLAYING') && <>
        {/* round counter */}
        <h3 className="text-dt-700 dark:text-dt-300 font-bold text-xl my-2">Round {roundId}/10: Pick a city near to the location!</h3>
        </>}
      
      {gameStatus === 'PLAYING' && <>
        {/* city input */}
        <input
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="City Name"
          className="w-full p-2 rounded-md border-[1px] border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-ew-500 focus:border-transparent my-2 text-black"
        />

        {/* submit guess */}
        <button onClick={submitGuess} className="my-2 p-2 rounded-md bg-ew-500 hover:opacity-80 text-white">Submit Guess</button>

        {/* leaflet map to guess location */}
        <MapContainer
          center={[(max_lat+min_lat)/2, (max_lng+min_lng)/2]}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: "400px", width: "100%" }}
          className='mb-8'>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            // url="http://tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg"
            // url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {lat && lng && <CircleMarker center={[lat, lng]} radius={5}>
            <Tooltip>
              Target
            </Tooltip>
          </CircleMarker>}
        </MapContainer>
        </>}

      {/* played card */}
      {gameStatus === 'EVALUATING' && <>
        <h3 className="text-dt-700 dark:text-dt-300 font-bold text-xl mt-4">Round {roundId}/10</h3>
        <ul className="grid gap-2 mt-4">
          {Object.entries(players).filter(([_, playerData]) => !!playerData.played).map(([name, playerData], index) => (
          <li key={name} className={`list-none p-4 border-[1px] rounded-md bg-gray-100/50 dark:bg-gray-700/50`}>
            {/* left side should be player name and color, right side should be the guessed color */}
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-md" style={{ backgroundColor: `${colors[index]}` }}></div>
              <span className="my-auto">{name}</span>
              <span className="my-auto ms-auto">{playerData.played.name}</span>
              <span className="my-auto ms-2">{(playerData.distance ).toFixed(3)}km</span>
              <span className="my-auto ms-2">{(gained[name]).points} points</span>
            </div>
          </li>))
          }
        </ul>

        <button onClick={acknowledge} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white my-4">Ready</button>

        <MapContainer
          center={[(max_lat+min_lat)/2, (max_lng+min_lng)/2]}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: "400px", width: "100%" }}
          className="mb-8">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* show all players' guesses */}
          {Object.entries(players).filter(([_, playerData]) => !!playerData.played).map(([playerName, playerData], index) => (
            <CircleMarker key={playerName}
              center={[playerData.played.lat, playerData.played.lng]}
              radius={5}
              pathOptions={{ color: colors[index % 9] }}>
              <Tooltip>
                {playerName}
              </Tooltip>
            </CircleMarker>
          ))}

          {/* actual marker */}
          {lat && lng && <CircleMarker
            center={[lat, lng]}
            radius={5}
            pathOptions={{ color: 'black' }}>
            <Tooltip>
              Target
            </Tooltip>
          </CircleMarker>}
        </MapContainer>
      </>}
    </div>
  </>;
}

export default CityHedger;
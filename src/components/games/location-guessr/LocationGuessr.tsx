import React, { useEffect, useMemo } from 'react';
import useWebSocket from 'react-use-websocket';
import gamesData from '../../../data/games/games.json';
import Swal from 'sweetalert2';
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import lifecycle from '../common/GameLifecycle';
import GameStart from '../common/GameStart';
import GameTitle from '../common/GameTitle';
import GameJoin from '../common/GameJoin';

const instructions = gamesData['location-guessr'].heroText;

type PlayerData = {
  points: number;
  guess: [number, number];
  added_score: number;
  distance: number;
  acknowledged: boolean;
}

const colors = [
  '#3CA877',
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

function LocationGuessr({ id, data, title }: { id: string, data: {name: string, Latitude: number, Longitude: number}[], title: string }) {
  const [players, setPlayers] = React.useState({} as {[name: string]: PlayerData});
  const [name, setName] = React.useState('');
  const [gameStatus, setGameStatus] = React.useState('UNJOINED');
  const [locationId, setLocationId] = React.useState(null as number | null);
  const [guess, setGuess] = React.useState(null as [number, number] | null);
  const [roundId, setRoundId] = React.useState(0);
  const [midLat, setMidLat] = React.useState(1.35);
  const [midLng, setMidLng] = React.useState(103.85);
  const [zoom, setZoom] = React.useState(11);
  const [maxDistance, setMaxDistance] = React.useState(0);

  useMemo(() => {
    const latSorted = Object.values(data).map(locData => locData.Latitude).sort((a, b) => a - b);
    const lngSorted = Object.values(data).map(locData => locData.Longitude).sort((a, b) => a - b);
    const twentyPercentileLat = latSorted[Math.floor(latSorted.length * 0.2)];
    const eightyPercentileLat = latSorted[Math.floor(latSorted.length * 0.8)];
    const twentyPercentileLng = lngSorted[Math.floor(lngSorted.length * 0.2)];
    const eightyPercentileLng = lngSorted[Math.floor(lngSorted.length * 0.8)];
    const bufferLat = (eightyPercentileLat - twentyPercentileLat) * 0.2;
    const bufferLng = (eightyPercentileLng - twentyPercentileLng) * 0.2;

    const max_lat = eightyPercentileLat + bufferLat;
    const min_lat = twentyPercentileLat - bufferLat;
    const max_lng = eightyPercentileLng + bufferLng;
    const min_lng = twentyPercentileLng - bufferLng;

    setMidLat((max_lat + min_lat) / 2);
    setMidLng((max_lng + min_lng) / 2);
    // set zoom based on the distance between the max and min lat/lng
    const max_distance = 111.33 * Math.sqrt((max_lat - min_lat)**2 + (max_lng - min_lng)**2);
    setZoom(13 - Math.log2(max_distance));
    setMaxDistance(max_distance);
  }, [data]);

  const WS_URL = `${import.meta.env.PUBLIC_WS}/api/games/location-guessr/${title}+${id}/${data.length}/${maxDistance}`;

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
    if (message.target) setLocationId(_ => message.target);
    if (message.round_id) setRoundId(_ => message.round_id);

    if (method === 'connect') {
      lifecycle.handleConnect(setGameStatus);
    } else if (method === 'join') {
      const gameState = message.game_state;
      if (gameState === 'lobby') setGameStatus('JOINED');
      if (gameState == 'start') setGameStatus('PLAYING');
    } else if (method === 'leave') {
      lifecycle.handleLeave(message.name === name, setGameStatus);
    } else if (method === 'start') {
      setGameStatus('PLAYING');
    } else if (method === 'next') {
      setGameStatus('PLAYING');
      setGuess(null);
      Swal.fire({
        icon: 'info',
        title: `Round ${message.round_id}!`,
        text: `Find: ${data[message.target].name}!`,
        timer: 1500,
      })
    } else if (method === 'evaluate') {
      setGameStatus('EVALUATING');
      const players = JSON.parse(JSON.stringify(message.players)) as {[name: string]: PlayerData};
      const closest = Object.entries(players).sort(([_, playerData]) => playerData.distance)[0];
      const distance = closest[1].distance;
      const closestName = closest[0];
      Swal.fire({
        icon: 'info',
        title: `The closest person was ${closestName} with a distance of ${distance.toFixed(3)}km!`,
        html: `<table class="w-full text-sm text-left rtl:text-right text-gray-700 mt-4">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" class="px-6 py-3">Player</th>
              <th scope="col" class="px-6 py-3">Distance</th>
              <th scope="col" class="px-6 py-3">Points</th>
            </tr>
          </thead>
          ${Object.entries(message.players as {[name: string]: PlayerData}).sort(([_, playerData]) => playerData.distance).map(([name, playerData]) => `
            <tr class="bg-white border-b">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${name}</th>
              <td class="px-6 py-4 font-light">${playerData.distance.toFixed(3)}km</td>
              <td class="px-6 py-4 font-light">${playerData.added_score} points</td>
            </tr>
          `).join('')}
        </table>`
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
    sendJsonMessage({ method: 'join', name })
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
    // validate guess
    if (!guess) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a location!'
      });
      return;
    }

    Swal.fire({
      title: 'Waiting for other players...',
      didOpen: () => {
        Swal.showLoading();
      }
    })
    sendJsonMessage({ method: 'play', guess: { guess, target_coords: [data[locationId || 0].Latitude, data[locationId || 0].Longitude] }, name });
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

  const LocationFinderDummy = () => {
    const map = useMapEvents({
        click(e) {
            console.log(e.latlng);
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            setGuess(_ => ([lat, lng]));
        },
    });
    return null;
  };

  return <>
    <div className="p-2 max-w-3xl mx-auto">
      {gameStatus !== 'UNJOINED' && <GameTitle title={title}/>}
      {gameStatus === 'JOINED' && <GameStart instructions={instructions} startGame={startGame}/>}
      {gameStatus === 'UNJOINED' && <GameJoin title={title} instructions={instructions} name={name} setName={setName} joinGame={joinGame}/>}

      {/* show all players */}
      {gameStatus !== 'UNJOINED' && <>
      <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Players</h3>
      <ul className="grid gap-2">
        {Object.entries(players).map(([playerName, playerData]) => (
          <li key={playerName} className="">
            <span className="text-white bg-dt-500 dark:bg-dt-300 dark:text-black rounded-md p-1 me-1">{playerName}{playerName === name && ' (you)'}{playerData.guess && gameStatus !== 'EVALUATING' && ' (played)'}{playerData.acknowledged && ' (ready)'}</span> {playerData.points} Points
          </li>
        ))}
        <li><span onClick={() => lifecycle.showHowToPlay(howToPlay)} className="bg-cc-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">How to Play</span></li>
        <li><span onClick={() => lifecycle.promptLeave(leaveGame)} className="bg-ns-500 text-white rounded-md p-1 hover:opacity-50 cursor-pointer">Leave Game</span></li>
      </ul>
      </>}

      {(gameStatus === 'PLAYING' || gameStatus === 'EVALUATING') && <>
        {/* round counter */}
        <h3 className="text-dt-500 dark:text-dt-300 font-bold text-xl my-2">Round {roundId}/10: Find {locationId && data[locationId].name}</h3>
        </>}
      
      {gameStatus === 'PLAYING' && <>
        {/* submit guess */}
        <button onClick={submitGuess} className="my-2 p-2 rounded-md bg-ew-500 hover:opacity-80 text-white">Submit Guess</button>

        {/* leaflet map to guess location */}
        <MapContainer
          center={[midLat, midLng]}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: "400px", width: "100%" }}
          className='mb-8'>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {guess && <CircleMarker center={guess} radius={5}>
            <Tooltip>
              Your guess
            </Tooltip>
          </CircleMarker>}

          <LocationFinderDummy />
        </MapContainer>
        </>}

      {/* played card */}
      {gameStatus === 'EVALUATING' && <>
        <ul className="grid gap-2 mt-4">
          {Object.entries(players).map(([name, playerData], index) => (
          <li key={name} className={`list-none p-4 border-[1px] rounded-md bg-white/50 dark:bg-gray-700/50`}>
            {/* left side should be player name and color, right side should be the guessed color */}
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-md" style={{ backgroundColor: `${colors[index]}` }}></div>
              <span className="my-auto">{name}</span>
              <span className="my-auto ms-auto">{playerData.distance.toFixed(3)}km</span>
              <span className="my-auto ms-auto">{playerData.added_score} points</span>
            </div>
          </li>))
          }
        </ul>

        <button onClick={acknowledge} className="p-2 rounded-md bg-ew-500 hover:opacity-80 text-white my-4">Ready</button>

        <MapContainer
          center={[1.35, 103.85]}
          zoom={11}
          scrollWheelZoom={true}
          style={{ height: "400px", width: "100%" }}
          className="mb-8">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* show all players' guesses */}
          {Object.entries(players).map(([playerName, playerData], index) => (
            <CircleMarker key={playerName}
              center={playerData.guess}
              radius={5}
              pathOptions={{ color: colors[index % 10] }}>
              <Tooltip>
                {playerName}
              </Tooltip>
            </CircleMarker>
          ))}

          {/* actual marker */}
          {locationId && <CircleMarker
            center={[data[locationId].Latitude, data[locationId].Longitude]}
            radius={5}
            pathOptions={{ color: 'black' }}>
            <Tooltip>
              {data[locationId].name}
            </Tooltip>
          </CircleMarker>}
        </MapContainer>
      </>}
    </div>
  </>;
}

export default LocationGuessr;
import Swal from "sweetalert2";

const handleConnectError = (id: string, setGameStatus: (status: string) => void) => {
  Swal.fire({
    icon: 'info',
    title: `Game not found!`,
    text: `Creating a new game at ${id}...`,
    timerProgressBar: true,
    timer: 2000
  });
  setGameStatus('UNJOINED');
};

const handleJoinError = (message: string, setGameStatus: (status: string) => void) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message
  });
  setGameStatus('UNJOINED');
}

const handleStartError = (message: string, setGameStatus: (status: string) => void) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message
  });
  setGameStatus('JOINED');
};

const handleEndGame = (winner: string, setGameStatus: (status: string) => void) => {
  Swal.fire({
    icon: 'info',
    title: `Game Over! ${winner} Wins!`,
    text: `The game will end in 5 seconds...`,
    timer: 5000,
  })
  setGameStatus('JOINED');
}

const promptLeave = (leaveGame: () => void) => {
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

const showHowToPlay = (instructions: string) => {
  Swal.fire({
    icon: 'info',
    title: 'How to Play',
    text: instructions,
  });
}

const handleConnect = (setGameStatus: (status: string) => void) => {
  Swal.fire({
    icon: 'info',
    title: `Connecting...`,
    timer: 1500,
    didOpen: () => {
      Swal.showLoading();
    }
  });
  setGameStatus('UNJOINED');
}

const handleLeave = (playerIsLeaving: boolean, setGameStatus: (status: string) => void) => {
  if (playerIsLeaving) {
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
}

const showSubmitSwal = () => {
  Swal.fire({
    title: 'Waiting for other players...',
    didOpen: () => {
      Swal.showLoading();
    }
  })
}

const showAcknowledgeSwal = () => {
  Swal.fire({
    icon: 'info',
    title: 'Waiting for other players to press ready...',
    didOpen: () => {
      Swal.showLoading();
    }
  })
}

const lifecycle = {
  handleConnectError,
  handleJoinError,
  handleStartError,
  handleEndGame,
  promptLeave,
  showHowToPlay,
  handleConnect,
  handleLeave,
  showSubmitSwal,
  showAcknowledgeSwal
};

export default lifecycle;
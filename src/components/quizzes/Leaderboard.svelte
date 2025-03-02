<script>
  import axios from "axios";
  import Swal from "sweetalert2";
  export let type;
  export let key;
  export let params;
  export let settingsLabel = "Settings";

  let leaderboard;

  async function getLeaderboard() {
    const url = `https://script.google.com/macros/s/AKfycbzrruwSggCRGCwUducgQD3YiUFVLp5cKGt3IFcX7z-34QDR4XkceBhpKtQMQByZExRZjQ/exec?siteUrl=__quizzes__${type}__${key}&params=${params}&toRetrieve=true`;
    await axios.get(
      url
      ).then(res => {
        return res.data;
      }).then(data => {
        try {
          leaderboard = JSON.parse(data.slice(0, -108));
        } catch (e) {
          leaderboard = {
            plays: 0,
            players: []
          };
        }
      });
    }

  // run on mount
  getLeaderboard();

  async function showLeaderboard() {
    if (!leaderboard) {
      Swal.fire({
        title: "Please wait...",
        didOpen: () => {
          Swal.showLoading();
        }
      })
      await getLeaderboard();
    }
    Swal.fire({
      title: "Leaderboard",
      html: `
        <span class="text-white text-left"># Plays: ${leaderboard.plays}</span>
        <table class="w-full text-sm text-left rtl:text-right text-gray-700 mt-4">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" class="px-6 py-3">Player</th>
              <th scope="col" class="px-6 py-3">${settingsLabel}</th>
              <th scope="col" class="px-6 py-3">Score</th>
            </tr>
          </thead>
          ${leaderboard.players.map((player, index) => `
            <tr class="bg-white border-b">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${player.name}</th>
              <td class="px-6 py-4 font-light">${player.params}</td>
              <td class="px-6 py-4 font-light">${Math.abs(player.score)}</td>
            </tr>
          `).join('')}
        </table>
      `,
      confirmButtonText: 'Close',
      showCloseButton: true
    })
  }
</script>

<button on:click={() => showLeaderboard()} class='bg-dt-300/20 py-1 px-2 rounded-md text-dt-500 dark:text-dt-300 hover:bg-dt-300/50'>
  Leaderboard
</button>
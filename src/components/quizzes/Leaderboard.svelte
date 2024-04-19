<script>
  import axios from "axios";
  export let type;
  export let key;

  async function showLeaderboard() {
    Swal.fire({
      title: 'Please wait...',
      didOpen: () => {
        Swal.showLoading()
      }
    });
    await axios.get(
      `${import.meta.env.PUBLIC_MM}/api/quizzes/${type}/${key}`
      ).then(
        res => {
          return res.data
        }
      ).then(data => {
        const { plays, players } = data;
        Swal.fire({
          title: "Leaderboard",
          html: `
            # Plays: ${plays}
            <table class="w-full text-sm text-left rtl:text-right text-gray-700 mt-4">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" class="px-6 py-3">Rank</th>
                  <th scope="col" class="px-6 py-3">Player</th>
                  <th scope="col" class="px-6 py-3">Score</th>
                </tr>
              </thead>
              ${players.map((player, index) => `
                <tr class="bg-white border-b">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${index + 1}</th>
                  <td class="px-6 py-4 font-light">${player.name}</td>
                  <td class="px-6 py-4 font-light">${player.score}</td>
                </tr>
              `).join('')}
            </table>
          `,
          confirmButtonText: 'Close',
          showCloseButton: true
        })
      });
    }
</script>

<button on:click={showLeaderboard} class='bg-dt-300/20 py-1 px-2 rounded-md text-dt-500 dark:text-dt-300 hover:bg-dt-300/50'>
  Leaderboard
</button>
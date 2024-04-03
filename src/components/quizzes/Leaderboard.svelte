<script>
  import axios from "axios";
  export let type;
  export let key;

  async function showLeaderboard() {
    await axios.get(
      `${import.meta.env.PUBLIC_QUIZ}/api/${type}/${key}`
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
            <table class="table-auto border-separate border-spacing-2">
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
              </tr>
              ${players.map((player, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${player.name}</td>
                  <td>${player.score}</td>
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
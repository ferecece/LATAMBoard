import { url, spanishAndLatinAmericanCountries } from './constants.js';
import { escapeHTML, formatTime, humanizeDate, gradient } from './utils.js';

export async function fetchLeaderboard() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const playerMap = new Map();
    data.data.players.data.forEach(player => playerMap.set(player.id, player));

    const tbody = document.querySelector('#leaderboard tbody');
    let position = 1;

    data.data.runs.forEach(run => {
      const playerId = run.run.players[0].id;
      const player = playerMap.get(playerId);

      if (!player) return;

      const playerCountryCode = player?.location?.country?.code?.toLowerCase();
      if (!spanishAndLatinAmericanCountries.includes(playerCountryCode)) return;

      const username = player.names.international;
      const nameStyle = player['name-style'];
      let display_name;

      if (nameStyle.style === 'gradient') {
        const startL = nameStyle['color-from'].light.match(/\w\w/g).map(c => parseInt(c, 16));
        const endL = nameStyle['color-to'].light.match(/\w\w/g).map(c => parseInt(c, 16));
        const name_gradientL = gradient(startL, endL, username.length);

        display_name = `<span>${name_gradientL.map((c, i) => 
          `<span style="color:#${c}">${escapeHTML(username[i])}</span>`).join('')}</span>`;
      } else {
        const color = nameStyle.color.light;
        display_name = `<span style="color:${color}">${escapeHTML(username)}</span>`;
      }

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${position}</td>
        <td>
          <img src="https://www.speedrun.com/images/flags/${playerCountryCode}.png" 
               width="18" height="12" style="margin-right: 8px;">
          ${display_name}
        </td>
        <td>${formatTime(run.run.times.primary_t)}</td>
        <td>${humanizeDate(run.run.date)}</td>
      `;
      tbody.appendChild(row);
      position++;
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
}

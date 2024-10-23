const url = 'https://www.speedrun.com/api/v1/leaderboards/yo1yv1q5/category/xk9g1w6d?var-yn2wk42n=21gzep8l&embed=players';


const spanishAndLatinAmericanCountries = [
  "ar", "bo", "br", "cl", "co", "cr", "cu", "do", "ec",
  "sv", "gt", "hn", "mx", "ni", "pa", "py", "pe", "uy",
  "ve", "es", "gq", "ht", "gf"
];

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function(match) {
    const escape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return escape[match];
  });
}

function gradient(startColor, endColor, length) {
  const result = [];
  for (let i = 0; i < length; i++) {
    const ratio = i / (length - 1);
    const color = startColor.map((start, j) =>
      Math.round(start + ratio * (endColor[j] - start))
    );
    result.push(color.map(c => c.toString(16).padStart(2, '0')).join(''));
  }
  return result;
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}h ${m}m ${s}s`; // Mostrar horas, minutos y segundos
  } else if (m > 0) {
    return `${m}m ${s}s`; // Mostrar solo minutos y segundos
  } else {
    return `${s}s`; // Mostrar solo segundos
  }
}

function humanizeDate(dateString) {
  const eventDate = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - eventDate) / 1000);

  const rtf = new Intl.RelativeTimeFormat(navigator.language, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return rtf.format(-minutes, 'minute');
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return rtf.format(-hours, 'hour');
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return rtf.format(-days, 'day');
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return rtf.format(-months, 'month');
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return rtf.format(-years, 'year');
  }
}

async function fetchLeaderboard() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Mapa de jugadores por ID
    const playerMap = new Map();
    data.data.players.data.forEach(player => {
      playerMap.set(player.id, player);
    });

    const tbody = document.querySelector('#leaderboard tbody');

    let position = 1;
    data.data.runs.forEach((run, index) => {
      const playerId = run.run.players[0].id;
      const player = playerMap.get(playerId);

      let positionContent;
      if (position === 1) {
        positionContent = '<img src="/images/places/1st.png" alt="1st" width="24" height="24">';
      } else if (position === 2) {
        positionContent = '<img src="/images/places/2nd.png" alt="2nd" width="24" height="24">';
      } else if (position === 3) {
        positionContent = '<img src="/images/places/3rd.png" alt="3rd" width="24" height="24">';
      } else {
        positionContent = position;
      }
      const playerCountryCode = player?.location?.country?.code?.toLowerCase();

      if (spanishAndLatinAmericanCountries.includes(playerCountryCode)) {
        const username = player.names.international;
        let nameStyle = player['name-style'];
        let display_name;

        if (nameStyle.style === 'gradient') {
          const startL = nameStyle['color-from'].light.match(/\w\w/g).map(c => parseInt(c, 16));
          const endL = nameStyle['color-to'].light.match(/\w\w/g).map(c => parseInt(c, 16));
          const name_gradientL = gradient(startL, endL, username.length);

          display_name = `<span>${name_gradientL.map((c, i) => 
            `<span style="color:#${c}">${escapeHTML(username[i])}</span>`).join('')}</span>`;
        } else if (nameStyle.style === 'solid') {
          const color = nameStyle.color.light;
          display_name = `<span style="color:${color}">${escapeHTML(username)}</span>`;
        } else {
          display_name = `<span>${escapeHTML(username)}</span>`;
        }

        let positionContent;
        if (position === 1) {
          positionContent = '<img src="/images/places/1st.png" alt="1st" width="24" height="24">';
        } else if (position === 2) {
          positionContent = '<img src="/images/places/2nd.png" alt="2nd" width="24" height="24">';
        } else if (position === 3) {
          positionContent = '<img src="/images/places/3rd.png" alt="3rd" width="24" height="24">';
        } else {
          positionContent = position;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${positionContent}</td>
          <td>
            <img src="https://www.speedrun.com/images/flags/${playerCountryCode}.png"
                 alt="${playerCountryCode}" 
                 width="18" height="12" 
                 style="margin-right: 8px;">
            ${display_name}
          </td>
          <td>${formatTime(run.run.times.primary_t)}</td>
          <td>${humanizeDate(run.run.date)}</td>

        `;
        tbody.appendChild(row);
        position++;
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
}

fetchLeaderboard();


// Detectar el idioma del navegador o usar "en" como predeterminado
const userLang = navigator.language || 'en';
const lang = userLang.split('-')[0]; // Solo tomar la parte del idioma (ej: 'es' de 'es-ES')

// Función para cargar el archivo de traducción adecuado
async function loadTranslations() {
  try {
    const response = await fetch(`/lang/${lang}.json`);
    const translations = await response.json();
    applyTranslations(translations);
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

// Aplicar las traducciones al contenido de la página
function applyTranslations(translations) {
  document.querySelector('#title').textContent = translations.title;
  document.querySelector('#player-header').textContent = translations.player;
  document.querySelector('#time-header').textContent = translations.time;
  document.querySelector('#date-header').textContent = translations.date;
}

window.addEventListener('DOMContentLoaded', loadTranslations);
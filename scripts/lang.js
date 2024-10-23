export async function loadLang() {
    const userLang = navigator.language.split('-')[0] || 'en';
    try {
      const response = await fetch(`/lang/${userLang}.json`);
      const translations = await response.json();
      applyTranslations(translations);
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }
  
  function applyTranslations(translations) {
    document.querySelector('#title').textContent = translations.title;
    document.querySelector('#player-header').textContent = translations.player;
    document.querySelector('#time-header').textContent = translations.time;
    document.querySelector('#date-header').textContent = translations.date;
  }
  
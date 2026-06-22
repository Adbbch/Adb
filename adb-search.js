/* ============================================
   ADB — Bouton de recherche : comportement
   À inclure juste avant </body>, après le bloc HTML du bouton.
   ============================================ */

(function () {
  const wrap   = document.getElementById('adbSearch');
  const toggle = document.getElementById('adbToggle');
  const input  = document.getElementById('adbInput');

  if (!wrap || !toggle || !input) return;

  // Sécurité : si ce script est inclus deux fois par erreur sur la même page,
  // on évite de brancher les événements une seconde fois (ça causait le bug
  // "il faut cliquer plusieurs fois" : un clic ouvrait ET refermait aussitôt).
  if (wrap.dataset.adbSearchInit === 'true') return;
  wrap.dataset.adbSearchInit = 'true';

  function openSearch() {
    wrap.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    setTimeout(() => input.focus(), 200);
  }

  function closeSearch() {
    wrap.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    input.value = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = wrap.classList.contains('is-open');
    (isOpen && document.activeElement !== input) ? closeSearch() : openSearch();
  });

  input.addEventListener('blur', () => {
    if (!input.value) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
  });

  // ---- Recherche en direct (dès 1 lettre) ----
  const results = document.createElement('div');
  results.className = 'adb-search-results';
  wrap.appendChild(results);

  function renderResults(query) {
    const q = query.trim().toLowerCase();

    if (q.length < 1 || typeof ADB_CATALOG === 'undefined') {
      results.classList.remove('is-visible');
      results.innerHTML = '';
      return;
    }

    const matches = ADB_CATALOG.filter((item) =>
      item.title.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      results.innerHTML = '<p class="adb-search-empty">Aucun résultat.</p>';
    } else {
      results.innerHTML = matches.map((item) => `
        <a href="${item.href}" class="adb-search-result">
          <img src="${item.poster}" alt="${item.title}">
          <span>${item.title}</span>
        </a>
      `).join('');
    }

    results.classList.add('is-visible');
  }

  input.addEventListener('input', () => renderResults(input.value));

  // mousedown se déclenche AVANT le blur de l'input : on force la navigation
  // immédiatement au lieu de compter sur le clic, qui pouvait arriver trop tard.
  results.addEventListener('mousedown', (e) => {
    const link = e.target.closest('.adb-search-result');
    if (link) {
      e.preventDefault();
      window.location.href = link.getAttribute('href');
    }
  });

  input.addEventListener('blur', () => {
    setTimeout(() => {
      results.classList.remove('is-visible');
    }, 150);
  });

  // Optionnel : branche ici ta logique de recherche réelle
  wrap.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    // ex: window.location.href = `/recherche?q=${encodeURIComponent(query)}`;
    console.log('Recherche ADB :', query);
  });
})();
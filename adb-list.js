/* ============================================
   ADB — Ma liste (localStorage)
   Enregistre les ajouts dans le navigateur du visiteur.
   ============================================ */

(function () {
  const STORAGE_KEY = 'adbMyList';

  function getList() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveList(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  // ---- Boutons "Ajouter à la liste" (sur les pages de détail) ----
  document.querySelectorAll('.btn-addlist').forEach((btn) => {
    const item = {
      title: btn.dataset.title,
      poster: btn.dataset.poster,
      href: btn.dataset.href
    };

    // état initial : déjà dans la liste ?
    if (getList().some((i) => i.href === item.href)) {
      btn.textContent = '✅ Dans ma liste';
      btn.classList.add('is-active');
    }

    btn.addEventListener('click', () => {
      let list = getList();
      const exists = list.some((i) => i.href === item.href);

      if (exists) {
        // retire de la liste si on reclique
        list = list.filter((i) => i.href !== item.href);
        saveList(list);
        btn.textContent = '🔖 Ajouter à la liste';
        btn.classList.remove('is-active');
      } else {
        list.push(item);
        saveList(list);
        btn.textContent = '✅ Dans ma liste';
        btn.classList.add('is-active');
      }
    });
  });

  // ---- Icônes "Ajouter à la liste" directement sur les vignettes ----
  document.querySelectorAll('.poster-card-addlist').forEach((btn) => {
    const item = {
      title: btn.dataset.title,
      poster: btn.dataset.poster,
      href: btn.dataset.href
    };

    if (getList().some((i) => i.href === item.href)) {
      btn.classList.add('is-active');
    }

    btn.addEventListener('click', (e) => {
      // empêche le clic d'ouvrir la fiche (le bouton est à l'intérieur du lien <a>)
      e.preventDefault();
      e.stopPropagation();

      let list = getList();
      const exists = list.some((i) => i.href === item.href);

      if (exists) {
        list = list.filter((i) => i.href !== item.href);
        saveList(list);
        btn.classList.remove('is-active');
      } else {
        list.push(item);
        saveList(list);
        btn.classList.add('is-active');
      }
    });
  });

  // ---- Rendu de la grille sur liste.html ----
  const grid = document.getElementById('myListGrid');
  if (grid) {
    const list = getList();

    if (list.length === 0) {
      grid.innerHTML = '<p class="empty-list">Ta liste est vide pour le moment. Ajoute des animes depuis leur page.</p>';
    } else {
      grid.innerHTML = list.map((item) => `
        <a href="${item.href}" class="poster-card">
          <img src="${item.poster}" alt="${item.title}">
          <span class="poster-card-title">${item.title}</span>
        </a>
      `).join('');
    }
  }
})();
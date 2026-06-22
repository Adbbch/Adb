/* ============================================
   ADB — Filtre par thème (catalogue.html)
   ============================================ */

(function () {
  const buttons = document.querySelectorAll('.theme-filter');
  const cards = document.querySelectorAll('.poster-card');

  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;

      // état visuel actif du bouton
      buttons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      cards.forEach((card) => {
        const show = theme === 'tout' || card.classList.contains('theme-' + theme);
        card.style.display = show ? '' : 'none';
      });
    });
  });
})();
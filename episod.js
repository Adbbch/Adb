document.querySelectorAll('.saison-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
        const saison = tab.dataset.saison;

        // Retire is-active de tous les boutons et tous les groupes
        document.querySelectorAll('.saison-tab').forEach(t => t.classList.remove('is-active'));
        document.querySelectorAll('.saison-panel').forEach(p => p.classList.remove('is-active'));

        // Ajoute is-active uniquement sur le bouton cliqué et son groupe correspondant
        tab.classList.add('is-active');
        document.querySelector(`.saison-panel[data-saison="${saison}"]`).classList.add('is-active');
    });
});
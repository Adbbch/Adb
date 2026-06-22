/* ============================================
   ADB — Lecteur vidéo personnalisé
   Contrôles maison branchés sur un <video>, plus le changement
   d'épisode en un clic (un seul lecteur partagé sur la page).
   ============================================ */

(function () {
  document.querySelectorAll('.adb-player').forEach((player) => {
    const video    = player.querySelector('video');
    const playBtn  = player.querySelector('.adb-play-btn');
    const muteBtn  = player.querySelector('.adb-mute-btn');
    const fsBtn    = player.querySelector('.adb-fs-btn');
    const bar      = player.querySelector('.adb-progress-bar');
    const fill     = player.querySelector('.adb-progress-fill');
    const timeEl   = player.querySelector('.adb-time');

    if (!video) return;

    function formatTime(sec) {
      if (!isFinite(sec)) return '0:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    function togglePlay() {
      if (video.paused) {
        video.play();
        if (playBtn) playBtn.textContent = '⏸';
      } else {
        video.pause();
        if (playBtn) playBtn.textContent = '▶';
      }
    }

    if (playBtn) playBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? '🔇' : '🔊';
      });
    }

    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (player.requestFullscreen) player.requestFullscreen();
      });
    }

    video.addEventListener('timeupdate', () => {
      const pct = (video.currentTime / video.duration) * 100 || 0;
      if (fill) fill.style.width = pct + '%';
      if (timeEl) timeEl.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    });

    if (bar) {
      bar.addEventListener('click', (e) => {
        const rect = bar.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        video.currentTime = ratio * video.duration;
      });
    }

    video.addEventListener('ended', () => {
      if (playBtn) playBtn.textContent = '▶';
    });
  });

  // ---- Changement d'épisode : clique sur une vignette, charge la vidéo dans le lecteur ----
  document.querySelectorAll('.episode-thumb-link[data-video]').forEach((link) => {
    link.addEventListener('click', () => {
      const player = document.querySelector('.adb-player');
      if (!player) return;

      const video   = player.querySelector('video');
      const playBtn = player.querySelector('.adb-play-btn');

      video.src = link.dataset.video;
      video.load();
      video.play();
      if (playBtn) playBtn.textContent = '⏸';

      player.classList.remove('is-hidden');

      document.querySelectorAll('.episode-thumb-link').forEach((l) => l.classList.remove('is-playing'));
      link.classList.add('is-playing');

      player.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
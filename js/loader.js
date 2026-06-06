// Splash Screen Loader
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const splashScreen = document.getElementById('splashScreen');
    const loaderBar = document.getElementById('loaderBar');
    const loaderMessage = document.getElementById('loaderMessage');
    const loaderPercent = document.getElementById('loaderPercent');

    if (!splashScreen) return;

    // Ensure progress elements exist (fallback to timed fade if missing)
    const hasProgress = !!(loaderBar && loaderMessage && loaderPercent);

    const messages = [
      { at: 0, text: 'Preparing a focused cancer care experience…' },
      { at: 20, text: 'Aligning research insights with patient-first care.' },
      { at: 45, text: 'Curating program highlights and key abstracts.' },
      { at: 70, text: 'Strengthening the cancer care continuum theme.' },
      { at: 90, text: 'Finalizing conference navigation…' },
      { at: 100, text: 'Ready to explore YROC 2027.' }
    ];

    const setProgressUI = (percent) => {
      const clamped = Math.max(0, Math.min(100, percent));
      if (loaderBar) loaderBar.style.width = clamped + '%';
      if (loaderPercent) loaderPercent.textContent = clamped + '%';

      if (loaderMessage) {
        // pick the latest message with at <= percent
        let current = messages[0];
        for (const m of messages) {
          if (clamped >= m.at) current = m;
        }
        loaderMessage.textContent = current.text;
      }
    };

    // Splash duration: 7 seconds
    const totalMs = 7000;
    const start = performance.now();

    if (!hasProgress) {
      setTimeout(() => {
        splashScreen.classList.add('fade-out');
        document.body.classList.remove('splash-active');
        setTimeout(() => splashScreen.remove(), 600);
      }, totalMs);
      return;
    }

    // Smooth progress toward 100%
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / totalMs);
      // Use easing so it feels smooth and purposeful
      const percent = Math.round(easeOutCubic(t) * 100);

      setProgressUI(percent);

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        // small buffer so user sees 100%
        setTimeout(() => {
          setProgressUI(100);
          splashScreen.classList.add('fade-out');
          document.body.classList.remove('splash-active');
          setTimeout(() => splashScreen.remove(), 600);
        }, 180);
      }
    };

    // Initialize UI quickly
    setProgressUI(0);
    requestAnimationFrame(tick);
  });
})();


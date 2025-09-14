let settings = {
  enabled: true,
  skipIntro: true,
  skipRecap: true,
  skipCredits: true,
};

browser.storage.local.get(settings, (data) => {
  settings = data;
});

browser.storage.onChanged.addListener((changes) => {
  browser.storage.local.get(settings, (data) => {
    settings = data;
  });
});

const observer = new MutationObserver((mutations) => {
  if (!settings.enabled) {
    return;
  }

  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      let selector = '';
      if (settings.skipIntro) {
        selector += '[data-uia="player-skip-intro"], ';
      }
      if (settings.skipRecap) {
        selector += '[data-uia="player-skip-recap"], ';
      }
      if (settings.skipCredits) {
        selector += '.skip-credits a, .watch-video--skip-content-button, ';
      }

      if (selector) {
        // remove trailing comma and space
        selector = selector.slice(0, -2);
        const skipButton = document.querySelector(selector);
        if (skipButton) {
          skipButton.click();
        }
      }
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

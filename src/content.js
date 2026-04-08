let settings = {
  enabled: true,
  skipIntro: true,
  skipRecap: true,
  skipCredits: true,
};

let selector = '';

function buildSelector() {
  const parts = [];
  if (settings.skipIntro) {
    parts.push('[data-uia="player-skip-intro"]');
  }
  if (settings.skipRecap) {
    parts.push('[data-uia="player-skip-recap"]');
  }
  if (settings.skipCredits) {
    parts.push('.skip-credits a', '.watch-video--skip-content-button');
  }
  selector = parts.join(', ');
}

browser.storage.local.get(settings, (data) => {
  settings = data;
  buildSelector();
});

browser.storage.onChanged.addListener(() => {
  browser.storage.local.get(settings, (data) => {
    settings = data;
    buildSelector();
  });
});

const observer = new MutationObserver((mutations) => {
  if (!settings.enabled || !selector) {
    return;
  }

  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      const skipButton = document.querySelector(selector);
      if (skipButton) {
        skipButton.click();
        return;
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

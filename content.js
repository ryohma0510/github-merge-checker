function highlightNonSquashMergeOptions() {
  const mergeButtons = document.querySelectorAll('.merge-box-button');
  mergeButtons.forEach(button => {
    if (!button.innerText.includes('Squash and merge')) {
      button.style.backgroundColor = 'red';
      button.style.color = 'white';
    }
  });
}

function waitForMergeButtonsAndHighlight() {
  const observer = new MutationObserver((mutations, obs) => {
    const mergeButtons = document.querySelectorAll('.merge-box-button');
    if (mergeButtons.length) {
      highlightNonSquashMergeOptions();
      obs.disconnect(); // 監視を停止
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function getLabelNames() {
  const labelSelector = '.IssueLabel';
  const labels = document.querySelectorAll(labelSelector);
  const labelNames = Array.from(new Set(Array.from(labels).map(label => label.innerText.trim())));

  return labelNames;
}

function checkURLAndRun() {
  const urlPattern = /^https:\/\/(github\.com|github\.[a-zA-Z0-9]+\.com)\/.+\/.+\/pull\/.+$/;

  if (!urlPattern.test(window.location.href)) {
    return;
  }

  const labelNames = getLabelNames();

  // 「Squash and merge」ラベルが存在するかチェック
  if (labelNames.includes('squash and merge')) {
    waitForMergeButtonsAndHighlight();
  }
}

window.onload = checkURLAndRun;

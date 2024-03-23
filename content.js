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
  console.log(labelNames);
}

window.onload = checkURLAndRun;

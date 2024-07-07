// Constants and selectors definition
// If Github changes the class names, update the below selectors
const labelSelector = '.IssueLabel';
const labelButtonClassMap = {
  'squash-and-merge': 'btn-group-squash',
  'create-a-merge-commit': 'btn-group-merge',
  'rebase-and-merge': 'btn-group-rebase',
};

function setupMutationObserver() {
  const targetNode = document.body;
  const config = { childList: true, subtree: true };
  const callback = function (mutationsList, observer) {
    highlightBasedOnLabels();
  };
  const observer = new MutationObserver(callback);

  observer.observe(targetNode, config);
}

// TODO: bugfix
function highlightMergeButton(label) {
  const btn = document.querySelector(`.${labelButtonClassMap[label]}`);
  if (!btn) {
    return;
  }

  btn.style.backgroundColor = 'red';
  btn.style.color = 'white';
}

// Find the allowed merge label from the PR page
function findAllowedLabel() {
  const labelNames = Array.from(new Set(Array.from(document.querySelectorAll(labelSelector)).map(label => label.innerText.trim().toLowerCase())));

  // No Support for multiple labels
  let allowedMergeLabel;
  Object.keys(labelButtonClassMap).forEach(label => {
    if (labelNames.includes(label)) {
      allowedMergeLabel = label;

      return;
    }
  });

  return allowedMergeLabel;
}

function highlightBasedOnLabels() {
  const allowedMergeLabel = findAllowedLabel();

  if (allowedMergeLabel) {
    Object.entries(labelButtonClassMap).forEach(([key, value]) => {
      if (key !== allowedMergeLabel) {
        highlightMergeButton(key);
      }
    });
  }
}

function main() {
  // Check if the current URL is a Github OR Github Enterprize PR page.
  const urlPattern = /^https:\/\/github\..+\/.+\/.+\/pull\/.+$/;
  if (urlPattern.test(window.location.href)) {
    console.log('Github PR page detected');
    setupMutationObserver();
  }
}

window.onload = main;

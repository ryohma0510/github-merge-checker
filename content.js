// Constants and selectors definition
// If Github changes the class names, update the below selectors
const labelSelector = '.IssueLabel';
const mergeButtonSelector = '.merge-box-button';
const labelButtonClassMap = {
  'squash-and-merge': 'btn-group-squash',
  'create-a-merge-commit': 'btn-group-merge',
  'rebase-and-merge': 'btn-group-rebase',
};

function highlightOtherMergeOptionsExcluding(excludedLabel) {
  const mergeButtons = document.querySelectorAll(mergeButtonSelector);
  mergeButtons.forEach(button => {
    if (!button.classList.contains(labelButtonClassMap[excludedLabel])) {
      button.style.backgroundColor = 'red';
      button.style.color = 'white';
    }
  });
}

// Github PR page dynamically add DOM, so we need to observe the DOM changes to highlight the merge options
function observeDOMAndHighlightExcludedOption(excludedLabel) {
  const observer = new MutationObserver(mutations => {
    const mergeButtons = document.querySelectorAll(mergeButtonSelector);
    if (mergeButtons.length) {
      highlightOtherMergeOptionsExcluding(excludedLabel);
      observer.disconnect(); // Stop observing once buttons are found
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function highlightBasedOnLabels() {
  const labelNames = Array.from(new Set(Array.from(document.querySelectorAll(labelSelector)).map(label => label.innerText.trim().toLowerCase())));

  Object.keys(labelButtonClassMap).forEach(label => {
    if (labelNames.includes(label)) {
      observeDOMAndHighlightExcludedOption(label);

      // No Support for multiple labels
      return;
    }
  });
}

function checkURLAndHighlightMergeOptions() {
  // Check if the current URL is a Github OR Github Enterprize PR page.
  const urlPattern = /^https:\/\/(github\.com|github\.[a-zA-Z0-9]+\.com)\/.+\/.+\/pull\/.+$/;
  if (urlPattern.test(window.location.href)) {
    highlightBasedOnLabels();
  }
}

window.onload = checkURLAndHighlightMergeOptions;

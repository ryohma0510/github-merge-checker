// Constants and selectors definition
// If Github changes the class names, update the below selectors
const labelSelector = '.IssueLabel';
const labelButtonClassMap = {
  'squash-and-merge': 'btn-group-squash',
  'create-a-merge-commit': 'btn-group-merge',
  'rebase-and-merge': 'btn-group-rebase',
};

function setupMutationObserver() {
  // 監視対象のノードを指定 (document.bodyを監視対象とする)
  const targetNode = document.body;

  // MutationObserverの設定
  const config = { childList: true, subtree: true };

  // MutationObserverのコールバック関数
  const callback = function(mutationsList, observer) {
    // ラベルに基づいてマージオプションをハイライト
    highlightBasedOnLabels();
    // 必要に応じて監視を解除
    // observer.disconnect();
  };

  // MutationObserverのインスタンスを作成
  const observer = new MutationObserver(callback);

  // 監視を開始
  observer.observe(targetNode, config);
}

function highlightOtherMergeOptionsExcluding(label) {
  const btn = document.querySelector(`.${labelButtonClassMap[label]}`);
  console.log('Highlighting button:', btn);

  btn.style.backgroundColor = 'red';
  btn.style.color = 'white';
}

function highlightBasedOnLabels() {
  const labelNames = Array.from(new Set(Array.from(document.querySelectorAll(labelSelector)).map(label => label.innerText.trim().toLowerCase())));

  let allowedMergeLabel;
  Object.keys(labelButtonClassMap).forEach(label => {
    if (labelNames.includes(label)) {
      allowedMergeLabel = label;

      // No Support for multiple labels
      return;
    }
  });

  if (allowedMergeLabel) {
    console.log('Allowed merge label:', allowedMergeLabel);

    Object.entries(labelButtonClassMap).forEach(([key, value]) => {
      if (key !== allowedMergeLabel) {
        highlightOtherMergeOptionsExcluding(key);
      }
    });
  }
}

function checkURLAndHighlightMergeOptions() {
  // TODO: domain should be configurable
  // Check if the current URL is a Github OR Github Enterprize PR page.
  const urlPattern = /^https:\/\/github\.hoge\.jp\/.+\/.+\/pull\/.+$/;
  if (urlPattern.test(window.location.href)) {
    console.log('Github PR page detected');
    setupMutationObserver();
  }
}

window.onload = checkURLAndHighlightMergeOptions;

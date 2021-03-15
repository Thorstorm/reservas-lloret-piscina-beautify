let toggleActiveExtension = true;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    toggleActiveExtension: true
  }, () => { })
  reloadWindow()
})

chrome.storage.sync.get([
  'toggleActiveExtension'
], (result) => {
  toggleActiveExtension = result.toggleActiveExtension;
})

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.toggleActiveExtension) {
      toggleActiveExtension = changes.toggleActiveExtension.newValue;
      reloadWindow()
    }
  }
})

chrome.webNavigation.onCompleted.addListener((details) => {
  if (!details.frameId) {
    if (toggleActiveExtension) {

      chrome.tabs.executeScript(details.tabId, { file: './foreground.js' }, () => {
        console.log('foreground script loaded')
      })
    }
  }
  return { cancel: false }
})

function reloadWindow() {

  // reload active tab
  chrome.tabs.getSelected(null, function (tab) {
    if (tab.url.includes("lloret.poliwincloud.com/")) {
      const code = 'window.location.reload();';
      chrome.tabs.executeScript(tab.id, {
        code: code
      }, () => console.log('tab.id', tab.id));
    }
  });
}

function checkForValidUrl(tabId, changeInfo, tab) {
if (tab.url.indexOf('https://source.chromium.org/') > -1) {
  // ... show the page action.
    chrome.Action.show(tabId);
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

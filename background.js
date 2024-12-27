chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('mangotree.tw/pages/')) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['shopObserver.js']
    });
  }
  if (changeInfo.status === 'complete' && tab.url.includes('mangotree.tw/products/')) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['itemObserver.js']
    });
  }
});
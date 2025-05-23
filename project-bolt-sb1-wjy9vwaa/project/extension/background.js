// Background script for the Phishing Website Detector extension

// Variables to store state
let currentURL = '';

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    currentURL = tab.url;
  }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    currentURL = tab.url;
  });
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentURL') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        sendResponse({ url: tabs[0].url });
      } else {
        sendResponse({ url: '' });
      }
    });
    return true; // Keep the message channel open for async response
  }
});
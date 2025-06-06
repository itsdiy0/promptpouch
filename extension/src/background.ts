// background.ts
console.log('Background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Handle messages between content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  
  // Forward messages if needed
  if (message.action === 'newChatGPTConversation') {
    // This message is typically sent from content script to popup
    // The background script can log it for debugging
    console.log('New ChatGPT conversation data:', message.data);
  }
  
  return true;
});
let timerInterval = null;
let seconds = 0;
let isPaused = false;
let currentTabId = null;

// Initialize Badge Style on Install
chrome.runtime.onInstalled.addListener(() => {
  setupBadgeStyle();
  chrome.action.setBadgeText({ text: "00:00" });
});

// Helper function to set badge colors
function setupBadgeStyle() {
  chrome.action.setBadgeBackgroundColor({ color: '#1A1A1A' });
  if (chrome.action.setBadgeTextColor) {
    chrome.action.setBadgeTextColor({ color: '#00FF66' });
  }
}

// Communication with Content Script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_TIMER") {
    currentTabId = sender.tab ? sender.tab.id : null;
    startGlobalTimer();
  } else if (message.action === "STOP_TIMER") {
    stopGlobalTimer();
  } else if (message.action === "GET_TIME") {
    sendResponse({ seconds, isPaused });
  }
  return true;
});

function startGlobalTimer() {
  setupBadgeStyle();
  if (timerInterval) clearInterval(timerInterval);
  seconds = 0;
  isPaused = false;

  timerInterval = setInterval(() => {
    if (!isPaused) {
      seconds++;
      updateBadge(seconds);
    }
  }, 1000);
}

function stopGlobalTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  seconds = 0;
  chrome.action.setBadgeText({ text: "00:00" });
}

function updateBadge(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  chrome.action.setBadgeText({ text: `${m}:${s}` });
}

// Auto-Pause when switching tabs inside Chrome
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (currentTabId) {
    isPaused = (activeInfo.tabId !== currentTabId);
  }
});

// Reset timer when leaving LeetCode problem pages (e.g. going back to problem set)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === currentTabId && changeInfo.status === 'complete' && tab.url) {
    const isProblemPage = tab.url.includes('leetcode.com/problems/');

    if (!isProblemPage) {
      stopGlobalTimer();
      currentTabId = null;
    }
  }
});
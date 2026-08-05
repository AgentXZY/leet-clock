let timerInterval = null;
let seconds = 0;
let isPaused = false;
let currentTabId = null;

// Initialize Badge State
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: "00:00" });
  chrome.action.setBadgeBackgroundColor({ color: "#FFA116" });
});

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
  chrome.action.setBadgeText({ text: "00:00" });
}

function updateBadge(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  // Chrome action badge fits ~4-5 chars cleanly
  chrome.action.setBadgeText({ text: `${m}:${s}` });
}

// Auto Pause when tab changes or window loses focus
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  isPaused = (activeInfo.tabId !== currentTabId);
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  isPaused = (windowId === chrome.windows.WINDOW_ID_NONE);
});
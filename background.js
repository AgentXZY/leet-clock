let timerInterval = null;
let seconds = 0;
let currentTabId = null;

/* ---------- Formatting ---------- */
function formatTime(totalSeconds) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/* ---------- Badge Styling ---------- */
function updateBadge() {
  chrome.action.setBadgeText({ text: formatTime(seconds) });
}

function setupBadge() {
  chrome.action.setBadgeBackgroundColor({ color: "#1A1A1A" });
  if (chrome.action.setBadgeTextColor) {
    chrome.action.setBadgeTextColor({ color: "#00FF66" });
  }
}

// onInstalled only fires on install/update - the service worker also unloads
// when idle and reloads later, so re-apply the badge style every time this
// file runs, not just on install.
setupBadge();
chrome.runtime.onInstalled.addListener(() => {
  setupBadge();
  chrome.action.setBadgeText({ text: "00:00" });
});

/* ---------- Timer Control ---------- */
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  seconds = 0;
  updateBadge();
  chrome.storage.local.set({ isRunning: true, elapsedTime: formatTime(0) });

  timerInterval = setInterval(() => {
    seconds++;
    updateBadge();
    chrome.storage.local.set({ elapsedTime: formatTime(seconds) });
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  seconds = 0; // keep popup's GET_TIME reads in sync with the badge - otherwise
               // the popup shows the frozen last value instead of 00:00
  chrome.storage.local.set({ isRunning: false, elapsedTime: formatTime(0) });
  chrome.action.setBadgeText({ text: "00:00" });
}

/* ---------- Messaging ---------- */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "START_TIMER") {
    currentTabId = sender.tab ? sender.tab.id : null;
    startTimer();
  }
  else if (request.action === "STOP_TIMER_AND_SAVE") {
    // Grab the final time BEFORE stopping/resetting seconds
    const finalTime = formatTime(seconds);
    stopTimer();

    chrome.storage.local.get(["solvedProblems"], (data) => {
      const solved = data.solvedProblems || [];
      const newEntry = {
        id: request.problemId || "?",
        name: request.problemName || "LeetCode Problem",
        url: request.problemUrl,
        slug: request.problemSlug,
        duration: finalTime,
        timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Unique by slug, keep last 15
      const filtered = solved.filter(p => p.slug !== request.problemSlug);
      const updated = [newEntry, ...filtered].slice(0, 15);

      chrome.storage.local.set({
        solvedProblems: updated,
        lastSolvedTime: finalTime
      });
    });

    sendResponse({ success: true, finalTime });
  }
  else if (request.action === "GET_TIME") {
    sendResponse({ seconds, elapsedTime: formatTime(seconds) });
  }
  return true;
});

/* ---------- Navigation Handling ----------
   Deliberately NO chrome.tabs.onActivated / chrome.windows.onFocusChanged
   pause logic here. Switching to another tab or app must NOT pause or
   reset the timer - only actually leaving the LeetCode problem page does. */

// Reset the timer when the tab navigates fully away from a /problems/ URL
// (e.g. clicking back to the problem set list via a real page load).
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (currentTabId && tabId === currentTabId && changeInfo.status === 'complete' && tab.url) {
    if (!tab.url.includes('/problems/')) {
      stopTimer();
      currentTabId = null;
    }
  }
});

// If the LeetCode tab is closed outright, stop the timer so it doesn't
// keep ticking away in the background with nothing tracking it.
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === currentTabId) {
    stopTimer();
    currentTabId = null;
  }
});
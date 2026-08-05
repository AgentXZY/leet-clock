let isStarted = false;
let startTime = null;

// Extract Problem Number / ID from page DOM
function getProblemNumber() {
  // Finds the title element (e.g., "1. Two Sum" -> "1")
  const titleEl = document.querySelector('div[class*="title"]') || document.querySelector('a[href*="/problems/"]');
  if (titleEl) {
    const match = titleEl.textContent.match(/^(\d+)\./);
    if (match) return match[1];
  }
  
  // Fallback: extract slug if number isn't immediately found
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[1] || "Q";
}

// Auto-start when problem page opens
function initTimer() {
  if (!isStarted) {
    isStarted = true;
    startTime = new Date();
    chrome.runtime.sendMessage({ action: "START_TIMER" });
  }
}

// Observe for "Accepted" Verdict
function observeSubmission() {
  const observer = new MutationObserver(() => {
    const acceptedEl = document.querySelector('[data-e2e-locator="submission-result"]');
    if (acceptedEl && acceptedEl.textContent.toLowerCase().includes("accepted") && isStarted) {
      handleAccepted();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function handleAccepted() {
  isStarted = false;
  const endTime = new Date();
  
  chrome.runtime.sendMessage({ action: "GET_TIME" }, (res) => {
    const totalSec = res ? res.seconds : 0;
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const durationStr = `${m}m ${s}s`;
    
    const problemNum = getProblemNumber();
    const formattedDate = new Date().toLocaleDateString();

    // 1. Write to LeetCode Notes Area
    const noteEntry = `\n---\n[LeetClock Log]\nDate: ${formattedDate}\nStart: ${startTime.toLocaleTimeString()}\nEnd: ${endTime.toLocaleTimeString()}\nTime Taken: ${durationStr}\n---`;
    const noteArea = document.querySelector('textarea[placeholder*="note"], textarea');
    if (noteArea) {
      noteArea.value += noteEntry;
      noteArea.dispatchEvent(new Event("input", { bubbles: true }));
    }

    // 2. Save Problem Number to Chrome Local Storage (Last 10)
    chrome.storage.local.get({ solvedList: [] }, (data) => {
      let list = data.solvedList;
      list.unshift({ id: problemNum, duration: durationStr, date: formattedDate });
      if (list.length > 10) list = list.slice(0, 10);
      chrome.storage.local.set({ solvedList: list });
    });

    chrome.runtime.sendMessage({ action: "STOP_TIMER" });
  });
}

// Run immediately on problem open
initTimer();
observeSubmission();
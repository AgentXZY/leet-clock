// Dynamic CSS for Extension-Style Top-Right Popover
const style = document.createElement('style');
style.textContent = `
  @keyframes extPopDown {
    0% { transform: translateY(-30px) scale(0.8); opacity: 0; }
    20% { transform: translateY(0) scale(1.05); opacity: 1; }
    30% { transform: translateY(0) scale(1); opacity: 1; }
    85% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-20px) scale(0.9); opacity: 0; }
  }

  .leetclock-ext-banner {
    position: fixed;
    top: 12px;
    right: 20px;
    z-index: 99999999;
    padding: 14px 22px;
    border-radius: 16px;
    font-family: 'Arial Black', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 20px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    text-align: right;
    color: #FFFFFF;
    pointer-events: none;
    animation: extPopDown 2.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    box-shadow: 0 12px 30px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.4);
    text-shadow: 0 2px 4px rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }

  .leetclock-ext-success {
    background: linear-gradient(135deg, #00B09B 0%, #96C93D 100%);
    border: 2px solid #86EFAC;
  }

  .leetclock-ext-error {
    background: linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%);
    border: 2px solid #FCA5A5;
  }

  .leetclock-ext-subtext {
    font-size: 13px;
    font-weight: 700;
    margin-top: 3px;
    letter-spacing: 0px;
    color: #FFFFFF;
    opacity: 0.95;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
  }
`;
document.head.appendChild(style);

const ACCEPTED_MESSAGES = [
  { main: "SWEET! 🍬", sub: "Problem Crushed!" },
  { main: "DELICIOUS! ⚡", sub: "Speedrun Approved!" },
  { main: "TASTY! 🔥", sub: "Logic On Point!" },
  { main: "UNSTOPPABLE! ✅", sub: "Green Ticks Only!" },
  { main: "DIVINE! 👑", sub: "Clean Code Victory!" }
];

const REJECTED_MESSAGES = [
  { main: "OOPS! 💥", sub: "Corner Case Strike" },
  { main: "MISSED IT! 🛑", sub: "Check Test Cases" },
  { main: "TRY AGAIN! 🔍", sub: "Off By One Error?" },
  { main: "SO CLOSE! 💪", sub: "Debug & Tweak" }
];

function getRandomCandy(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function showExtensionBanner(data, isSuccess) {
  const existing = document.querySelector('.leetclock-ext-banner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.className = `leetclock-ext-banner ${isSuccess ? 'leetclock-ext-success' : 'leetclock-ext-error'}`;

  const mainTitle = document.createElement('div');
  mainTitle.textContent = data.main;

  const subTitle = document.createElement('div');
  subTitle.className = 'leetclock-ext-subtext';
  subTitle.textContent = data.sub;

  banner.appendChild(mainTitle);
  banner.appendChild(subTitle);
  document.body.appendChild(banner);

  setTimeout(() => {
    banner.remove();
  }, 2200);
}

// Global Tracking States to Prevent Loops
let currentProblemSlug = getProblemSlug(location.href);
let submissionHandled = false;

function getProblemSlug(url) {
  const match = url.match(/\/problems\/([^\/]+)/);
  return match ? match[1] : "";
}

function handleProblemChange() {
  submissionHandled = false;
  chrome.runtime.sendMessage({ action: "START_TIMER" });
}

// Initial Timer Start
if (currentProblemSlug) {
  handleProblemChange();
}

// Monitor Next/Prev Arrow Navigation & SPA URL changes
setInterval(() => {
  const newSlug = getProblemSlug(location.href);
  if (newSlug && newSlug !== currentProblemSlug) {
    currentProblemSlug = newSlug;
    handleProblemChange();
  }
}, 300);

// Submission Verdict Listener with Strict Lock
const observer = new MutationObserver(() => {
  if (submissionHandled) return;

  // Scan specifically for submission result elements
  const verdictElem = document.querySelector('[data-e2e-locator="submission-result"]');
  
  if (verdictElem) {
    const text = (verdictElem.innerText || "").trim();

    if (text.includes("Accepted")) {
      submissionHandled = true;
      showExtensionBanner(getRandomCandy(ACCEPTED_MESSAGES), true);
      chrome.runtime.sendMessage({ action: "STOP_TIMER" });
    } else if (
      text.includes("Wrong Answer") || 
      text.includes("Time Limit Exceeded") ||
      text.includes("Runtime Error") ||
      text.includes("Compile Error")
    ) {
      submissionHandled = true;
      showExtensionBanner(getRandomCandy(REJECTED_MESSAGES), false);
      
      // Allow re-submitting on errors after 5 seconds lock
      setTimeout(() => {
        submissionHandled = false;
      }, 5000);
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
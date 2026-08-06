(function () {
  "use strict";

  if (window.__leetClockLoaded) {
    console.log("[LeetClock] Already loaded, skipping duplicate injection.");
    return;
  }
  window.__leetClockLoaded = true;

  /* ===================== STYLES ===================== */
  const style = document.createElement("style");
  style.textContent = `
    @keyframes extPopDown {
      0%  { transform: translateY(-30px) scale(0.8); opacity: 0; }
      12% { transform: translateY(0)    scale(1.05); opacity: 1; }
      20% { transform: translateY(0)    scale(1);    opacity: 1; }
      85% { transform: translateY(0)    scale(1);    opacity: 1; }
      100%{ transform: translateY(-20px) scale(0.9); opacity: 0; }
    }

    .leetclock-ext-banner {
      position: fixed;
      top: 16px;
      right: 20px;
      z-index: 99999999;
      padding: 14px 22px;
      border-radius: 16px;
      font-family: 'Arial Black', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 18px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      text-align: right;
      color: #FFFFFF;
      pointer-events: none;
      animation: extPopDown 4.0s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      box-shadow: 0 12px 30px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.4);
      text-shadow: 0 2px 4px rgba(0,0,0,0.6);
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      max-width: 340px;
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
      font-size: 12px;
      font-weight: 700;
      margin-top: 4px;
      letter-spacing: 0px;
      color: #FFFFFF;
      opacity: 0.95;
      text-transform: none;
      text-shadow: 0 1px 2px rgba(0,0,0,0.8);
      line-height: 1.3;
    }
  `;
  document.head.appendChild(style);

  /* ===================== BANNER DATA ===================== */
  const ACCEPTED_MESSAGES = [
    { main: "SWEET! 🍬", sub: "\"I am inevitable.\" — Your O(1) Solution" },
    { main: "DELICIOUS! ⚡", sub: "\"Look at me... I am the Senior Dev now.\"" },
    { main: "UNSTOPPABLE! 👑", sub: "\"He's beginning to believe.\" — The Matrix" },
    { main: "CLEAN SWEEP! 🔥", sub: "It worked on the first try?! Is this legal?" },
    { main: "VICTORY! 🎯", sub: "Garbage Collector: \"My work here is done.\"" }
  ];

  const REJECTED_MESSAGES = [
    { main: "OOPS! 💥", sub: "\"Why do we fall? So we can learn to fix TLE.\"" },
    { main: "WASTED 🛑", sub: "\"Emotional Damage!\" — Wrong Answer" },
    { main: "HOLD UP! 🔍", sub: "\"One does not simply pass tests without debugging.\"" },
    { main: "SO CLOSE! 💪", sub: "\"It's not a bug, it's an undocumented feature.\"" },
    { main: "SYSTEM FAILURE 🤖", sub: "\"Houston, we have an Off-By-One error.\"" }
  ];

  function getRandomCandy(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function showExtensionBanner(data, isSuccess) {
    const existing = document.querySelector(".leetclock-ext-banner");
    if (existing) existing.remove();

    const banner = document.createElement("div");
    banner.className = `leetclock-ext-banner ${isSuccess ? "leetclock-ext-success" : "leetclock-ext-error"}`;

    const mainTitle = document.createElement("div");
    mainTitle.textContent = data.main;

    const subTitle = document.createElement("div");
    subTitle.className = "leetclock-ext-subtext";
    subTitle.textContent = data.sub;

    banner.appendChild(mainTitle);
    banner.appendChild(subTitle);
    document.body.appendChild(banner);

    setTimeout(() => {
      if (banner.parentNode) banner.remove();
    }, 4000);
  }

  /* ===================== HELPERS ===================== */
  function safeSendMessage(msg, cb) {
    if (!chrome.runtime || !chrome.runtime.id) return;
    try {
      chrome.runtime.sendMessage(msg, (res) => {
        if (chrome.runtime.lastError) return;
        if (cb) cb(res);
      });
    } catch (e) {
      /* context invalidated (extension was reloaded) */
    }
  }

  function getProblemSlug(url) {
    const m = url.match(/\/problems\/([^\/]+)/);
    return m ? m[1] : "";
  }

  // Open Graph title is the most reliably-formatted source LeetCode gives us
  // ("1249. Minimum Remove to Make Valid Parentheses"), with document.title
  // as a backup if it's ever missing.
  function getRawTitleText() {
    const og = document.querySelector('meta[property="og:title"]');
    if (og && og.content && og.content.trim()) return og.content.trim();
    return (document.title || "").replace(/-\s*LeetCode\s*$/i, "").trim();
  }

  function getProblemNumber() {
  const raw = getRawTitleText();

  let m = raw.match(/^(\d+)\./);
  if (m) return m[1];

  m = raw.match(/^(\d+)\s*-/);
  if (m) return m[1];

  const qNum = document.querySelector(
    '[data-cy="question-title"], [class*="title"]'
  )?.textContent?.match(/^(\d+)/);

  return qNum ? qNum[1] : "?";
}

  function getProblemTitle() {
    const text = getRawTitleText();
    if (text) return text.replace(/^\d+\.\s*/, "").trim();
    return currentProblemSlug.replace(/-/g, " ");
  }

  // Always build the URL from the slug, not window.location.href - by the
  // time "Accepted" shows, the URL has often already changed to a
  // /submissions/<id>/ path, which is not where you want the link to go.
  function getProblemUrl() {
    return `https://leetcode.com/problems/${currentProblemSlug}/`;
  }

  function appendToNotes(text) {
    const selectors = [
      'textarea[placeholder*="note" i]',
      '.note-editor textarea',
      '[class*="note"] textarea'
    ];
    for (const sel of selectors) {
      const area = document.querySelector(sel);
      if (area) {
        area.value += text;
        area.dispatchEvent(new Event("input", { bubbles: true }));
        area.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }
    }
    return false;
  }

  // Reads ONLY the real submission verdict. "console-result" is LeetCode's
  // container for Run (test case) output - deliberately not read here,
  // otherwise clicking Run gets treated as a real Submit. If LeetCode ever
  // renames this locator, check it via DevTools (right-click the "Accepted"
  // text after a real submit -> Inspect) and swap it in here.
  function getSubmissionVerdict() {
    const el = document.querySelector('[data-e2e-locator="submission-result"]');
    if (el && el.innerText) {
      const t = el.innerText.trim();
      if (t) return t;
    }
    return "";
  }

  function isErrorVerdict(text) {
    return (
      text.includes("Wrong Answer") ||
      text.includes("Time Limit Exceeded") ||
      text.includes("Memory Limit Exceeded") ||
      text.includes("Runtime Error") ||
      text.includes("Compile Error")
    );
  }

  /* ===================== STATE ===================== */
  let currentProblemSlug = getProblemSlug(location.href);
  // We only track the last verdict text we've already reacted to. A verdict
  // is "new" and worth acting on if its text differs from this - no lock
  // flag, no timers. This avoids two failure modes we hit before:
  //  1. A timer-based unlock re-firing the toast forever on an unchanged
  //     screen (any DOM mutation, even a blinking cursor, re-triggered it).
  //  2. A permanent lock blocking a second Accepted/Wrong Answer verdict
  //     later in the same problem (e.g. fail once, fix it, resubmit).
  let lastVerdictText = "";
  let problemStartTime = null;

  function resetAllState() {
    lastVerdictText = "";
  }

  function handleProblemChange() {
    currentProblemSlug = getProblemSlug(location.href);
    resetAllState();
    problemStartTime = new Date();
    safeSendMessage({ action: "START_TIMER" });
  }

  if (currentProblemSlug) handleProblemChange();

  /* ===================== SPA NAVIGATION ===================== */
  // Catches Next/Prev arrows and the sidebar problem list, which change the
  // URL via client-side routing without a full page load.
  const navInterval = setInterval(() => {
    if (!chrome.runtime || !chrome.runtime.id) {
      clearInterval(navInterval);
      return;
    }
    const newSlug = getProblemSlug(location.href);
    if (newSlug && newSlug !== currentProblemSlug) {
      handleProblemChange();
    }
  }, 300);

  /* ===================== VERDICT OBSERVER ===================== */
  const observer = new MutationObserver(() => {
    if (!chrome.runtime || !chrome.runtime.id) return;

    // Run and Submit apparently render into the SAME result container on
    // this LeetCode layout, so the text alone can't tell them apart - Run
    // shows "Accepted" too whenever the visible sample cases pass. The one
    // thing that's actually unique to a real Submit is that it changes the
    // tab's URL to include /submissions/<id>/ - Run never does that. So we
    // only look at the verdict text at all once that's true.
    if (!location.href.includes('/submissions/')) return;

    const verdictText = getSubmissionVerdict();
    if (!verdictText || verdictText === lastVerdictText) return;

    lastVerdictText = verdictText;

    /* ---------- ACCEPTED ---------- */
    if (verdictText.includes("Accepted")) {
      showExtensionBanner(getRandomCandy(ACCEPTED_MESSAGES), true);

      const endTime = new Date();
      const fmtClock = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      safeSendMessage({ action: "GET_TIME" }, (res) => {
        const duration = res && res.elapsedTime ? res.elapsedTime : "00:00";
        const startStr = problemStartTime ? fmtClock(problemStartTime) : "--:--";
        const note = `\n---\n[LeetClock] ${endTime.toLocaleDateString()}\nStart: ${startStr}  End: ${fmtClock(endTime)}  Duration: ${duration}\n---\n`;
        appendToNotes(note);
      });

      safeSendMessage({
        action: "STOP_TIMER_AND_SAVE",
        problemId: getProblemNumber(),
        problemName: getProblemTitle(),
        problemUrl: getProblemUrl(),
        problemSlug: currentProblemSlug
      });
      return;
    }

    /* ---------- ERRORS ---------- */
    if (isErrorVerdict(verdictText)) {
      showExtensionBanner(getRandomCandy(REJECTED_MESSAGES), false);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
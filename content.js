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
  { main: "WITH GREAT POWER... 🕸️", sub: "\"...comes an O(1) runtime complexity.\"" },
  { main: "I AM VENGEANCE 🦇", sub: "\"It's not who I am underneath, but my code that defines me.\"" },
  { main: "MAIN CHARACTER ENERGY ⚡", sub: "\"Look at me... I am the Senior Dev now.\"" },
  { main: "ABSOLUTE CINEMA 🎬", sub: "\"He is beginning to believe.\" — Morpheus" },
  { main: "GIGACHAD CODE 🗿", sub: "Compiles on first try. Refuses to elaborate. Leaves." },
  { main: "VICTORY! 🎯", sub: "Garbage Collector: \"My work here is done.\"" }
];

const REJECTED_MESSAGES = [
  { main: "FFAAAAAHHH! 😩💥", sub: "Testcase 47/48 failed... pure pain." },
  { main: "WHY DO WE FALL? 🦇", sub: "\"So we can learn to pick ourselves up and fix the TLE, Bruce.\"" },
  { main: "CANON EVENT 🕷️", sub: "You can't stop this bug. It was bound to happen." },
  { main: "EMOTIONAL DAMAGE! 🛑", sub: "\"One does not simply pass tests without print statements.\"" },
  { main: "THE DARK KNIGHT RISES 🛡️", sub: "\"The night is darkest just before the green banner.\"" },
  { main: "WASTED 💥", sub: "\"Houston, we have an Off-By-One error.\"" }
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
    console.log("[LeetClock] appendToNotes called");

    const selectors = [
      'textarea[placeholder*="note" i]',
      '.note-editor textarea',
      '[class*="note"] textarea'
    ];

    for (const sel of selectors) {
      const area = document.querySelector(sel);

      if (area) {
        console.log("[LeetClock] Notes found:", sel);

        const nativeSetter = Object.getOwnPropertyDescriptor(
  HTMLTextAreaElement.prototype,
  "value"
).set;

const oldValue = area.value;

nativeSetter.call(area, oldValue + text);

area.dispatchEvent(
  new InputEvent("input", {
    bubbles: true,
    data: text,
    inputType: "insertText"
  })
);

area.dispatchEvent(
  new Event("change", {
    bubbles: true
  })
);

area.focus();
area.blur();

        return true;
      }
    }

    console.log("[LeetClock] Notes area NOT found");
    return false;
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
  let lastKnownTitle = getRawTitleText();
  let problemStartTime = null;

  // Accepted and errors render in two SEPARATE elements
  // (submission-result vs console-result), not one that gets swapped - so
  // each needs its own "last seen" tracker. Otherwise a leftover Accepted
  // element from an earlier submission can permanently block every later
  // Wrong Answer from ever being noticed, since checking one first meant
  // never even looking at the other again.
  let lastAcceptedText = "";
  let lastErrorText = "";

  // The problem number/name comes from a title/meta tag that may not have
  // settled the instant the page loads. Cache it as early as possible (with
  // a few retries) so it's ready well before you actually submit, rather
  // than reading it cold at the exact moment Accepted fires.
  let currentProblemNumberCache = "?";
  let currentProblemNameCache = "";

  function refreshProblemMeta(attempt) {
    attempt = attempt || 0;
    const num = getProblemNumber();
    const name = getProblemTitle();
    if (num !== "?") currentProblemNumberCache = num;
    if (name) currentProblemNameCache = name;
    if ((currentProblemNumberCache === "?" || !currentProblemNameCache) && attempt < 6) {
      setTimeout(() => refreshProblemMeta(attempt + 1), 600);
    }
  }

  function resetAllState() {
    lastAcceptedText = "";
    lastErrorText = "";
  }

  function handleProblemChange() {
    currentProblemSlug = getProblemSlug(location.href);
    lastKnownTitle = getRawTitleText();
    resetAllState();
    problemStartTime = new Date();
    currentProblemNumberCache = "?";
    currentProblemNameCache = "";
    refreshProblemMeta();
    safeSendMessage({ action: "START_TIMER" });
  }

  if (currentProblemSlug) handleProblemChange();

  /* ===================== SPA NAVIGATION ===================== */
  // Catches Next/Prev arrows and the sidebar problem list, which change the
  // URL via client-side routing without a full page load. We compare BOTH
  // the URL slug and the page title - not every navigation path (study
  // plans, daily challenge, etc.) necessarily changes the URL the same way,
  // but the title reliably updates per problem regardless of the route.
  const navInterval = setInterval(() => {
    if (!chrome.runtime || !chrome.runtime.id) {
      clearInterval(navInterval);
      return;
    }
    const newSlug = getProblemSlug(location.href);
    const newTitle = getRawTitleText();
    if ((newSlug && newSlug !== currentProblemSlug) || (newTitle && newTitle !== lastKnownTitle)) {
      handleProblemChange();
    }
  }, 300);

  /* ===================== PROACTIVE RESET ON SUBMIT CLICK ===================== */
  // Best-effort only, never a gate: if this catches a click on the Submit
  // button, it clears both trackers so whatever verdict shows up next -
  // even one that's byte-for-byte identical to the last one - is treated as
  // new. If the selector ever misses the real button, detection still works
  // fine for anything whose text actually changes; this only helps the
  // identical-text-twice-in-a-row case.
  document.addEventListener("click", (e) => {
    const submitBtn = e.target.closest(
      '[data-e2e-locator="console-submit-button"], [data-e2e-locator*="submit"], button[class*="submit"], [class*="submit-button"]'
    );
    if (submitBtn) resetAllState();
  });

  /* ===================== VERDICT OBSERVER ===================== */
  const observer = new MutationObserver(() => {
    if (!chrome.runtime || !chrome.runtime.id) return;

    // Run and Submit apparently render into the SAME two containers on this
    // LeetCode layout, so text alone can't tell them apart - Run can show
    // "Accepted" too whenever the visible sample cases pass. The one thing
    // that's actually unique to a real Submit is that it changes the tab's
    // URL to include /submissions/<id>/ - Run never does that.
    if (!location.href.includes('/submissions/')) return;

    const successEl = document.querySelector('[data-e2e-locator="submission-result"]');
    const errorEl = document.querySelector('[data-e2e-locator="console-result"]');
    const successText = successEl && successEl.innerText ? successEl.innerText.trim() : "";
    const errorText = errorEl && errorEl.innerText ? errorEl.innerText.trim() : "";

    /* ---------- ACCEPTED ---------- */
    if (successText && successText !== lastAcceptedText) {
      lastAcceptedText = successText;

      if (successText.includes("Accepted")) {
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
          problemId: currentProblemNumberCache !== "?" ? currentProblemNumberCache : getProblemNumber(),
          problemName: currentProblemNameCache || getProblemTitle(),
          problemUrl: getProblemUrl(),
          problemSlug: currentProblemSlug
        });
      }
    }

    /* ---------- ERRORS ---------- */
    if (errorText && errorText !== lastErrorText) {
      lastErrorText = errorText;
      if (isErrorVerdict(errorText)) {
        showExtensionBanner(getRandomCandy(REJECTED_MESSAGES), false);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
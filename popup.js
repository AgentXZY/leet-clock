function formatSeconds(totalSeconds) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) {
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updatePopupTimer() {
  chrome.runtime.sendMessage({ action: "GET_TIME" }, (res) => {
    if (chrome.runtime.lastError) return;
    if (res && res.seconds !== undefined) {
      document.getElementById("live-timer").innerText = formatSeconds(res.seconds);
    }
  });
}

function loadHistory() {
  const container = document.getElementById("solved-list");
  chrome.storage.local.get({ solvedProblems: [] }, (data) => {
    const list = data.solvedProblems;
    if (!list || list.length === 0) {
      container.innerHTML = '<div class="empty">No solved questions yet.</div>';
      return;
    }

    container.innerHTML = "";
    list.forEach((item) => {
      const div = document.createElement("div");
      div.className = "problem-badge";

      const idDisplay = item.id || item.slug || "?";
      const link = item.url
        ? `<a href="${item.url}" target="_blank" title="${item.name || ''}">#${idDisplay}</a>`
        : `<span>#${idDisplay}</span>`;

      div.innerHTML = `
        <span>${link}</span>
        <span class="problem-time">${item.duration || "--:--"}</span>
      `;
      container.appendChild(div);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updatePopupTimer();
  setInterval(updatePopupTimer, 1000);
  loadHistory();
});
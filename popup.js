function updatePopupTimer() {
  chrome.runtime.sendMessage({ action: "GET_TIME" }, (res) => {
    if (res && res.seconds !== undefined) {
      const m = Math.floor(res.seconds / 60).toString().padStart(2, "0");
      const s = (res.seconds % 60).toString().padStart(2, "0");
      document.getElementById("live-timer").innerText = `${m}:${s}`;
    }
  });
}

function loadHistory() {
  const container = document.getElementById("solved-list");
  chrome.storage.local.get({ solvedList: [] }, (data) => {
    const list = data.solvedList;
    if (list.length === 0) {
      container.innerHTML = '<div class="empty">No solved questions yet.</div>';
      return;
    }

    container.innerHTML = "";
    list.forEach((item) => {
      const div = document.createElement("div");
      div.className = "problem-badge";
      div.innerHTML = `
        <span>#${item.id}</span>
        <span class="problem-time">${item.duration}</span>
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
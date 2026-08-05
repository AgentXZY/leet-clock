# ⏱️ LeetClock

**LeetClock** is a lightweight, distraction-free Chrome extension designed to make time tracking on LeetCode completely frictionless. 

It automatically tracks your active problem-solving time, auto-pauses when you switch tabs, appends exact duration metrics into your native LeetCode problem notes upon submission, and keeps track of your last 10 solved problems.

---

## ✨ Features

* **⚡ Zero-Click Live Timer:** Displays live duration right on your browser's toolbar badge as soon as you open a problem.
* **⏸️ Smart Auto-Pause:** Pauses automatically when you switch tabs or leave Chrome, ensuring your logged times reflect actual focus time.
* **📝 Automatic Notes Logging:** Upon receiving an `Accepted` submission verdict, LeetClock appends your solve date, start time, end time, and active duration directly into the LeetCode problem notes section.
* **📊 Last 10 Solved History:** Click the popup icon anytime to view a compact log of your 10 most recently solved problems with exact solve times.
* **🔒 Privacy-First & Local:** No external servers, databases, or account setups required. Everything is stored locally via `chrome.storage.local`.

---

## 🛠️ Installation (Local / Developer Mode)

Since LeetClock is open-source, you can easily load it into Chrome locally:

1. **Clone or Download** this repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/LeetClock.git](https://github.com/YOUR_USERNAME/LeetClock.git)

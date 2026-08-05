# ⏱️ LeetClock

> **Track LeetCode solve times automatically — zero extra clicks.**

LeetClock is a lightweight Manifest V3 Chrome extension that automatically tracks how long you spend solving LeetCode problems without requiring manual timers or additional interactions.

Instead of starting and stopping a stopwatch yourself, LeetClock runs in the background, intelligently pauses when you leave the problem, and records your solve time when you successfully submit an accepted solution.

---

## 🚀 Features

### ⚡ Live Toolbar Badge

Displays a real-time timer directly on the extension icon in your Chrome toolbar (`MM:SS` format), allowing you to monitor progress at a glance.

### ⏸️ Smart Auto-Pause

Automatically pauses timing when:

* You switch to another browser tab
* You minimize Chrome
* Chrome loses focus
* You leave the LeetCode problem page

This ensures recorded times reflect actual problem-solving focus rather than idle time.

### 📝 Automatic Note Logging

When your submission receives an **Accepted** verdict, LeetClock automatically appends the following information to your LeetCode problem notes:

* Start Time
* End Time
* Active Solve Duration

This creates a personal solve log directly inside LeetCode.

### 📊 Quick History

Access your most recent solving activity through the extension popup.

The popup displays:

* Last 10 solved problem IDs
* Recorded solve times
* Quick overview of recent performance

### 🔒 100% Local

LeetClock does not require:

* Accounts
* Sign-ups
* Cloud services
* External databases

All data is stored locally using `chrome.storage.local`.

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/LeetClock.git
```

### 2. Open Chrome Extensions

Navigate to:

```text
chrome://extensions/
```

### 3. Enable Developer Mode

Turn on **Developer Mode** using the toggle in the top-right corner.

### 4. Load the Extension

Click:

```text
Load unpacked
```

Then select the downloaded **LeetClock** folder.

### 5. Pin the Extension

Pin **LeetClock** to your Chrome toolbar for quick access and visibility.

---

## 📖 How to Use

### Step 1: Open a LeetCode Problem

Visit any LeetCode problem page.

The timer starts automatically.

### Step 2: Solve the Problem

Work normally while LeetClock tracks your active solving time.

If you switch tabs or applications, timing automatically pauses.

### Step 3: Submit Your Solution

Submit your code as usual.

### Step 4: Get Your Solve Log

When the submission receives an **Accepted** verdict:

* Solve duration is saved locally
* The problem ID is added to history
* Timing details are appended to your LeetCode notes automatically

---

## 📊 Example Note Entry

```text
⏱️ LeetClock Session

Start Time: 2026-08-05 10:14 AM
End Time: 2026-08-05 10:42 AM
Active Duration: 28m 17s
```

---

## 🧰 Tech Stack

### Core Technologies

* Manifest V3
* Vanilla JavaScript (ES6+)

### Chrome APIs

* `chrome.action`
* `chrome.storage.local`
* `chrome.tabs`
* `chrome.runtime`
* `chrome.alarms`

---

## 📂 Project Structure

```text
LeetClock/
│
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
├── popup.css
├── icons/
│   ├── 16.png
│   ├── 48.png
│   └── 128.png
│
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome.

If you would like to add a feature or fix a bug:

### Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### Commit Your Changes

```bash
git commit -m "add: description of feature"
```

### Push to GitHub

```bash
git push origin feature/your-feature-name
```

### Open a Pull Request

Submit a Pull Request describing your changes and rationale.

---

## 🎯 Roadmap

Future improvements may include:

* Daily solve statistics
* Weekly productivity reports
* Export solve history as CSV
* Difficulty-wise timing analytics
* Streak tracking
* Contest mode support

---

## 📄 License

Distributed under the **MIT License**.

See the `LICENSE` file for additional information.

---

<div align="center">

**Built for LeetCode users who care about consistency, focus, and measurable improvement.**

⭐ If you find LeetClock useful, consider starring the repository.

</div>

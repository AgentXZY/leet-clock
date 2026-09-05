# ⏱️ LeetClock

> ## **Solve. Submit. Get the dopamine hit. 🎉**
>
> **LeetClock automatically tracks your LeetCode solve time, saves your recent solves, logs your sessions, and celebrates every Accepted submission with a little developer dopamine.**

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome\&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20JS-F7DF1E?logo=javascript\&logoColor=black)
![Local First](https://img.shields.io/badge/Data-Local%20Storage-success)

**`chrome-extension` · `leetcode` · `leetcode-tracker` · `productivity` · `developer-tools` · `solve-time-tracker` · `coding` · `dsa` · `gamified` · `developer-humor` · `coding-dopamine` · `javascript` · `manifest-v3`**

LeetClock is a lightweight Chrome extension that makes your LeetCode practice a little more trackable—and a little more fun.

Open a problem and the timer starts automatically. Solve it, submit it, and when you get that beautiful **Accepted**, LeetClock records your solve time, saves the problem to your recent history, logs the session in your LeetCode notes, and throws you a randomized reaction for that extra dopamine hit.

Your **last 10 unique solved problems** are saved locally with their solve durations and direct links back to the questions.

**No manual timers. No accounts. No backend. Just open, solve, submit, repeat.**

## 🚀 Get LeetClock

Install the extension directly from the **Chrome Web Store**:

<p align="center">
  <a href="https://chromewebstore.google.com/detail/leetclock/ljoojicooppjgfofmollbilcgmboajhk">
    <img src="https://img.shields.io/badge/Install%20from-Chrome%20Web%20Store-4285F4?logo=googlechrome&logoColor=white" alt="Install LeetClock from Chrome Web Store">
  </a>
</p>

## 📸 See It in Action

<p align="center">
  <img src="https://lh3.googleusercontent.com/zFN343SZXF9IO1qvBWgQryK792Wdm1_tBs6G7eQfF0iUNrtBhxadIjwu-uCDZz7y-6qsaAJLviXCZHhlHW9oZ-CQyQ=s1280-w1280-h800" alt="LeetClock Chrome extension showing solve timer and recent history" width="800">
</p>

<p align="center">
  <img src="[https://lh3.googleusercontent.com/NzwS5sVPKFCuaSamvv_2c9bR5EPTC82kHGZp-z9GPus5R_WTyga5My78TH2ODX3jRJp1MmyerutqEWQsDzIHRkM3kg=s1280-w1280-h800](https://lh3.googleusercontent.com/NzwS5sVPKFCuaSamvv_2c9bR5EPTC82kHGZp-z9GPus5R_WTyga5My78TH2OD3XjRJp1MmyerutqEWQsDzIHRkM3kg=s1280-w1280-h800)" alt="LeetClock popup displaying solved problem history" width="800">
</p>

<p align="center">
  <img src="https://lh3.googleusercontent.com/3n6JwX3cR-bntGQMsRapazTDJZBnqpq2YH90szzco1VSnoc0awMYvy_pViuLXaUbSEexCXFgx2UX4epCfLKJnFj5Xg=s1280-w1280-h800" alt="LeetClock tracking a LeetCode solving session" width="800">
</p>

<p align="center">
  <img src="https://lh3.googleusercontent.com/soKQqpkkznAmlcIH7743kCTHrzlB1GvulJUGtoer5HywiP_bgS8nOwlVBZ_RAwi1FLPQcGdSQJeWFDdLk33mKc2A1WI=s1280-w1280-h800" alt="LeetClock celebrating an Accepted submission" width="800">
</p>

## ✨ Features

### ⏱️ Automatic Solve Tracking

Open a LeetCode problem and LeetClock automatically starts a new solving session.

Your current solve time is displayed directly on the Chrome toolbar badge.

### 🧠 Knows When You Actually Solved It

LeetClock distinguishes between running sample test cases and submitting an actual solution.

Only a real **Accepted submission** gets recorded as a completed solve.

### 📜 Last 10 Solved

Your last **10 unique solved problems** are saved locally with:

* Problem number
* Solve duration
* Direct link back to the problem

Solve the same problem again and its entry gets updated instead of duplicated.

### 📝 Automatic Session Notes

After an Accepted submission, LeetClock adds a solve log directly to your LeetCode notes:

```text
---
[LeetClock] 01/09/2026
Start: 03:10 PM  End: 03:34 PM  Duration: 24:18
---
```

### 🎉 Developer Dopamine Included

Accepted? Get a randomized animated celebration.

Wrong Answer? TLE? Runtime Error?

LeetClock has reactions for those too—because debugging pain also deserves commentary.

### 🔒 Completely Local

No accounts. No sign-ups. No APIs. No cloud.

Your data stays in your browser using `chrome.storage.local`.

## 🔄 How It Works

```text
Open a LeetCode Problem
          ↓
Timer Starts Automatically ⏱️
          ↓
     Solve & Submit
          ↓
      Accepted? 🎉
          ↓
Save Solve Time + History 📜
          ↓
 Log Session in Notes 📝
```

LeetClock also detects LeetCode's client-side navigation, so switching to another problem automatically starts a new session.

> **Note:** Switching tabs or applications does not pause the timer. The session ends when you navigate away from the problem, solve it, or close the tracked tab.

## 🚀 Installation

You can install LeetClock directly from the [Chrome Web Store](https://chromewebstore.google.com/detail/leetclock/ljoojicooppjgfofmollbilcgmboajhk).

For local development:

```bash
git clone https://github.com/YOUR_USERNAME/LeetClock.git
```

Then:

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the LeetClock project folder
5. Pin the extension and start solving

## 🧰 Built With

* JavaScript
* Chrome Extensions API
* Manifest V3
* MutationObserver
* `chrome.storage.local`

## 📂 Project Structure

```text
LeetClock/
├── manifest.json
├── background.js      # Timer & storage
├── content.js         # LeetCode interaction
├── popup.html         # Extension UI
├── popup.js           # Timer & solve history
├── icons/
└── README.md
```

## 🗺️ Roadmap

* [ ] Daily & weekly statistics
* [ ] Difficulty-wise analytics
* [ ] Personal best solve times
* [ ] Streak tracking
* [ ] CSV / JSON export
* [ ] Contest support

## 📄 License

Distributed under the **MIT License**.

<div align="center">

### ⏱️ Don't just solve problems. Watch yourself get better.

⭐ **If you find LeetClock useful, consider starring the repository.**

</div>

// --- STATE ---
let workSeconds = parseInt(localStorage.getItem('workSeconds')) || 0;
let rewardSeconds = parseInt(localStorage.getItem('rewardSeconds')) || 0;
let earnedSeconds = parseInt(localStorage.getItem('earnedSeconds')) || 0;

let workTimer = null;
let rewardTimer = null;
let workRunning = false;
let rewardRunning = false;

// --- UI Update ---
function updateUI() {
  document.getElementById('workTimeDisplay').innerText = formatTime(workSeconds);
  document.getElementById('rewardTimeLeft').innerText = formatMMSS(rewardSeconds);

  let earnedMinutes = Math.floor(workSeconds / 300); // 5 minutes = 1 minute reward
  earnedSeconds = earnedMinutes * 60;
  document.getElementById('earnedMinutes').innerText = earnedMinutes;
  document.getElementById('earnedHours').innerText = (earnedMinutes / 60).toFixed(2);
  document.getElementById('ebayDollars').innerText = (earnedMinutes / 60).toFixed(2); // $1/hr
  document.getElementById('snackCount').innerText = (earnedMinutes / 120).toFixed(2); // 1 snack per 2 hr

  localStorage.setItem('workSeconds', workSeconds.toString());
  localStorage.setItem('rewardSeconds', rewardSeconds.toString());
  localStorage.setItem('earnedSeconds', earnedSeconds.toString());
}

function formatTime(totalSec) {
  let hrs = Math.floor(totalSec / 3600);
  let mins = Math.floor((totalSec % 3600) / 60);
  let secs = totalSec % 60;
  return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatMMSS(totalSec) {
  let mins = Math.floor(totalSec / 60);
  let secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// --- Timer Controls ---
function toggleWorkTimer() {
  if (workRunning) {
    clearInterval(workTimer);
    workRunning = false;
    document.getElementById('workBtn').innerText = 'Start Work';
  } else {
    workTimer = setInterval(() => {
      workSeconds++;
      updateUI();
    }, 1000);
    workRunning = true;
    document.getElementById('workBtn').innerText = 'Pause Work';
  }
}

function toggleRewardTimer() {
  if (rewardRunning) {
    clearInterval(rewardTimer);
    rewardRunning = false;
    document.getElementById('rewardBtn').innerText = 'Start Reward';
  } else {
    if (rewardSeconds <= 0) return;
    rewardTimer = setInterval(() => {
      if (rewardSeconds > 0) {
        rewardSeconds--;
        updateUI();
      } else {
        clearInterval(rewardTimer);
        rewardRunning = false;
        document.getElementById('rewardBtn').innerText = 'Start Reward';
      }
    }, 1000);
    rewardRunning = true;
    document.getElementById('rewardBtn').innerText = 'Pause Reward';
  }
}

// --- Spend Actions ---
function spendEbay() {
  if (earnedSeconds >= 3600) {
    earnedSeconds -= 3600;
    rewardSeconds += 3600;
    workSeconds = Math.floor(earnedSeconds / 60) * 300; // reset workSeconds accordingly
    updateUI();
  } else {
    alert("Not enough earned time for $1 eBay.");
  }
}

function spendSnack() {
  if (earnedSeconds >= 7200) {
    earnedSeconds -= 7200;
    rewardSeconds += 7200;
    workSeconds = Math.floor(earnedSeconds / 60) * 300;
    updateUI();
  } else {
    alert("Not enough earned time for a snack.");
  }
}

// --- Init ---
window.onload = () => {
  updateUI();
};

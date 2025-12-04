const minutesDiv = document.getElementById("pomodoro-minutes");
const secondsDiv = document.getElementById("pomodoro-seconds");
const progressDiv = document.getElementById("progress-bar");

let modePomodoro = true;
let promideSeconds = 0;
let isRunning = false;
let myInterval = null;
let minutesFocus = 25;
let minutesBreak = 5;
let totalSeconds = minutesFocus * 60;

function pauseTimer(pauseState) {
  if (!isRunning && pauseState) {
    alert("The session is already paused.");
    return;
  }

  if (myInterval) clearInterval(myInterval);

  myInterval = null;
  isRunning = false;
};

function startTimer() {
  if (isRunning) {
    alert("Session has already started.");
    return;
  }

  if (!totalSeconds || totalSeconds <= 0) {
    const minutesAmount = Number.parseInt(minutesDiv.textContent, 10) || 0;
    const secondsAmount = Number.parseInt(secondsDiv.textContent, 10) || 0;
    totalSeconds = minutesAmount * 60;
    totalSeconds += secondsAmount;
  }

  if (totalSeconds <= 0) resetTimer();

  myInterval = setInterval(updateSeconds, 1000);
  isRunning = true;
};

function resetTimer() {
  const stateText = document.getElementById("pomodoro-state");
  const minutesInSeconds = modePomodoro ? minutesFocus * 60 : minutesBreak * 60;
  if (!isRunning && totalSeconds === minutesInSeconds) modePomodoro = modePomodoro ? false : true;
  
  pauseTimer(false);
  let minutesAmount = modePomodoro ? minutesFocus : minutesBreak;
  totalSeconds = minutesAmount * 60;
  promideSeconds = 0;

  stateText.textContent = modePomodoro ? `Focus for ${minutesFocus}` : `Break for ${minutesBreak}`;
  minutesDiv.textContent = minutesAmount < 10 ? `0${minutesAmount}` : String(minutesAmount);
  secondsDiv.textContent = "00";
  progressDiv.style.width = "0%";
};

function updateSeconds() {
  if (totalSeconds <= 0) {
    resetTimer();
    startTimer();
  }
  totalSeconds--;

  function updateProgressBar() {
    if (promideSeconds < totalSeconds) promideSeconds = totalSeconds + 1;

    const porcentSeconds = 100 - (Math.round(totalSeconds / (promideSeconds / 100)));
    progressDiv.style.width = `${porcentSeconds}%`;
  }

  let minutesLeft = Math.floor(totalSeconds / 60);
  let secondsLeft = totalSeconds % 60;

  let strMinutesLeft = minutesLeft < 10 ? `0${minutesLeft}` : String(minutesLeft);
  let strSecondsLeft = secondsLeft < 10 ? `0${secondsLeft}` : String(secondsLeft);

  updateProgressBar();
  minutesDiv.textContent = minutesLeft ? strMinutesLeft : "00";
  secondsDiv.textContent = secondsLeft < 1 ? "00" : strSecondsLeft;
};
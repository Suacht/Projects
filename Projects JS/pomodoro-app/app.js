const startBtn = document.querySelector(".btn-start");
const pauseBtn = document.querySelector(".btn-pause");
const resetBtn = document.querySelector(".btn-reset");
const pomodoroBtn = document.querySelector(".btn-pomodoro");
const breakBtn = document.querySelector(".btn-break");

const minutesDiv = document.querySelector(".minutes");
const secondsDiv = document.querySelector(".seconds");

let myInterval = null;
let totalSeconds = 0;
let modePomodoro = true;
let isRunning = false;

const updateSeconds = () => {
  if (totalSeconds <= 0) {
    minutesDiv.textContent = "0";
    secondsDiv.textContent = "00";
    clearInterval(myInterval);
    myInterval = null;
    isRunning = false;
    return;
  }
  totalSeconds--;

  let minutesLeft = Math.floor(totalSeconds / 60);
  let secondsLeft = totalSeconds % 60;

  minutesDiv.textContent = String(minutesLeft);
  secondsDiv.textContent = secondsLeft < 10 ? "0" : String(secondsLeft);
};

const appTimer = () => {
  if (isRunning) {
    alert("Session has already started.");
    return;
  }

  if (!totalSeconds || totalSeconds <= 0) {
    const sessionAmount = Number.parseInt(minutesDiv.textContent, 10) || 0;
    totalSeconds = sessionAmount * 60;
  }

  if (totalSeconds <= 0) {
    alert("Set a valid time before starting.");
    return;
  }

  myInterval = setInterval(updateSeconds, 1000);
  isRunning = true;
};

const pomodoroMode = () => {
  modePomodoro = true;
  pauseTimer();

  totalSeconds = 25 * 60;
  minutesDiv.textContent = "25";
  secondsDiv.textContent = "00";
};

const breakMode = () => {
  modePomodoro = false;
  pauseTimer();

  totalSeconds = 5 * 60;
  minutesDiv.textContent = "5";
  secondsDiv.textContent = "00";
};

const pauseTimer = () => {
  if (myInterval) {
    clearInterval(myInterval);
  }
  myInterval = null;
  isRunning = false;
};

const resetTimer = () => {
    if (modePomodoro) {
        pomodoroMode();
    } else {
        breakMode();
    }
};

startBtn.addEventListener("click", appTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
pomodoroBtn.addEventListener("click", pomodoroMode);
breakBtn.addEventListener("click", breakMode);
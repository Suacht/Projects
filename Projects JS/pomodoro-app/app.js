const minutesDiv = document.querySelector(".minutes");
const secondsDiv = document.querySelector(".seconds");

let cycle = 0;
let myInterval = null;
let totalSeconds = 0;
let modePomodoro = true;
let isRunning = false;

const pauseTimer = () => {
  if (myInterval) clearInterval(myInterval);

  myInterval = null;
  isRunning = false;
};

const resetTimer = () => {
  const stateText = document.getElementById("state");
  modePomodoro = modePomodoro ? false : true;
  let minutesAmount = modePomodoro ? 0 : 0;
  pauseTimer();

  totalSeconds = minutesAmount * 60;
  stateText.textContent = modePomodoro ? "Focus" : "Break";
  minutesDiv.textContent = modePomodoro ? `0${minutesAmount}` : `0${minutesAmount}`;
  secondsDiv.textContent = "05";
};

const updateSeconds = () => {
  if (totalSeconds <= 0) {
    cycle++;
    clearInterval(myInterval);
    myInterval = null;
    isRunning = false;
    resetTimer();
    startTimer();
  }
  totalSeconds--;

  let minutesLeft = Math.floor(totalSeconds / 60);
  let secondsLeft = totalSeconds % 60;

  let strMinutesLeft = minutesLeft < 10 ? `0${minutesLeft}` : String(minutesLeft);
  let strSecondsLeft = secondsLeft < 10 ? `0${secondsLeft}` : String(secondsLeft);

  minutesDiv.textContent = minutesLeft ? strMinutesLeft : "00";
  secondsDiv.textContent = secondsLeft < 1 ? "00" : strSecondsLeft;
};

const startTimer = () => {
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

  if (totalSeconds <= 0) {
    alert("Set a valid time before starting.");
    return;
  }

  myInterval = setInterval(updateSeconds, 1000);
  isRunning = true;
};
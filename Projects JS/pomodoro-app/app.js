const pointsContainer = document.getElementById("points-container");
const focusBar = document.getElementById("focus-bar");
const breakBar = document.getElementById("break-bar");
const minutesDiv = document.querySelector(".minutes");
const secondsDiv = document.querySelector(".seconds");

let modePomodoro = true;
let minutesFocus = 25;
let minutesBreak = 5;
let isRunning = false;
let myInterval = null;
let darkMode = false;
let totalSeconds = 0;
let cycle = 0;

focusBar.addEventListener("input", () => {
  const focusMinutes = document.getElementById("focus-minutes");
  focusMinutes.innerText = focusBar.value;
});

breakBar.addEventListener("input", () => {
  const breakMinutes = document.getElementById("break-minutes");
  breakMinutes.innerText = breakBar.value;
});

focusBar.addEventListener("change", () => {
  minutesFocus= focusBar.value;
  resetTimer(1, true);
});

breakBar.addEventListener("change", () => {
  minutesBreak = breakBar.value;
  resetTimer(1, false);
});

const pauseTimer = (pauseState) => {
  if (!isRunning && pauseState) {
    alert("The session is already paused.");
    return;
  }

  if (myInterval) clearInterval(myInterval);

  myInterval = null;
  isRunning = false;
};

function playBuzz() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.value = 200;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();   
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
}

const darkmode = () => {
  const icons = document.querySelectorAll(".controls-image");
  const imageDarkMode = document.getElementById("dark-mode");
  darkMode = darkMode ? false : true;
  let image = darkMode ? "light" : "dark";

  icons.forEach(icon => {
    const url = icon.src

    if (url.includes("light"))  icon.src = url.replace("light", "dark");
    if (url.includes("dark"))  icon.src = url.replace("dark", "light");
  });
  
  cycleStatus();
  imageDarkMode.src = `./src/${image}.png`;
  document.body.classList.toggle("dark-come");
}

const resetTimer = (cycleReset, barEvent) => {
  const stateText = document.getElementById("state");
  if (cycleReset === 1) modePomodoro = barEvent;
  if (cycleReset === 0 || cycleReset === 2) modePomodoro = modePomodoro ? false : true;
  let minutesAmount = modePomodoro ? minutesFocus : minutesBreak;
  pauseTimer(false);

  totalSeconds = minutesAmount * 60;
  stateText.textContent = modePomodoro ? "Focus" : "Break";
  minutesDiv.textContent = minutesAmount < 10 ? `0${minutesAmount}` : String(minutesAmount);
  secondsDiv.textContent = "00";
  
  if (cycleReset === 0 || cycleReset === 1) {
    cycle = 0;
    pointsContainer.innerHTML = "";
  }
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

  if (totalSeconds <= 0) resetTimer();

  myInterval = setInterval(updateSeconds, 1000);
  isRunning = true;
  cycleStatus();
};

const updateSeconds = () => {
  if (totalSeconds <= 0) {
    let count = 0;

    const interval = setInterval(() => {
        playBuzz();
        count++;

        if (count > 3) clearInterval(interval);
    }, 500);

    cycle++;
    resetTimer(2);
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

function cycleStatus() {
  const pointsContent = document.createElement("figure");
  pointsContent.className = "points-cycles";

  const visualCycle = cycle % 6;
  const totalPoints = visualCycle + (isRunning ? 1 : 0);
  
  pointsContainer.innerHTML = "";
  pointsContent.innerHTML = "";

  for (let i = 0; i < totalPoints; i++) {
    const img = document.createElement("img");
    let image = darkMode ? "light" : "dark";
    let awaitState = i < visualCycle ? image : "grey";

    img.src = `./src/point-${awaitState}.png`;
    img.alt = i < visualCycle ? "cycle-completed" : "cycle-pending";
    pointsContent.appendChild(img);
  }

  pointsContainer.appendChild(pointsContent);

  let oldP = document.getElementById("cycle-text");
  if (oldP) oldP.remove();

  if (isRunning || cycle > 0) {
    const textContent = document.createElement("p");
    textContent.id = "cycle-text";
    textContent.textContent = `Cycle - ${cycle}`;
    pointsContainer.appendChild(textContent);
  }
}
let timeDisplay = document.getElementById("timer");
let startBtn = document.getElementById("start-btn");
let pauseBtn = document.getElementById("pause-btn");
let resetBtn = document.getElementById("reset-btn");
let workTime = document.getElementById("work-time");
let breakTime = document.getElementById("break-time");

//declararion des variables
let isRunning = false;
let isWorking = true;
let timeInterval;
let timeRemaining;

workTime.addEventListener("input", () => {
    if (!isRunning) {
        isWorking = true;
        updateDisplay(workTime.value * 60);
    }
});

breakTime.addEventListener("input", () => {
    if (!isRunning && !isWorking) {
        updateDisplay(breakTime.value * 60);
    }
});

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timeRemaining = isWorking ? workTime.value * 60 : breakTime.value * 60;
        timeInterval = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateDisplay(timeRemaining);
                addZoomEffect();
            } else {
                clearInterval(timeInterval);
                alarmSound.play();
                timeDisplay.style.color = '#e74c3c';
                setTimeout(() => switchTimer(), 1000);
            }
        }, 1000);
        toggleButtons();
    }
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timeInterval);
    toggleButtons();
}

function resetTimer() {
    isRunning = false;
    clearInterval(timeInterval);
    updateDisplay(0);
    timeDisplay.style.color = 'black';
    toggleButtons();
}

function updateDisplay(seconds) {
    let minutes = Math.floor(seconds / 60);
    let sec = seconds % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function addZoomEffect() {
    timeDisplay.classList.add("zoom");
    setTimeout(() => timeDisplay.classList.remove("zoom"), 300);
}

function toggleButtons() {
    startBtn.disabled = isRunning;
    pauseBtn.disabled = !isRunning;
    resetBtn.disabled = !isRunning && !timeRemaining;
}

function switchTimer() {
    isWorking = !isWorking;
    timeRemaining = isWorking ? workTime.value * 60 : breakTime.value * 60;
    updateDisplay(timeRemaining);
    timeDisplay.style.color = isWorking ? '#4caf50' : '#e74c3c';
}

updateDisplay(workTime.value * 60);
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

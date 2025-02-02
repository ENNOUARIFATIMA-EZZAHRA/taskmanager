document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const taskTitle = document.getElementById('task-title');
    const taskDescription = document.getElementById('task-description');
    const taskPriority = document.getElementById('task-priority');
    const btnAjouterTodo = document.getElementById('btnAjouterTodo');
    const btnAnnulerTodo = document.getElementById('btnAnnulerTodo');
    const filters = document.querySelectorAll('input[name="filter"]');
    const clearAllBtn = document.getElementById('clear-all');
    const clearFinishedBtn = document.getElementById('clear-finished');

    btnAjouterTodo.addEventListener('click', () => {
        addTask();
    });

    btnAnnulerTodo.addEventListener('click', () => {
        clearForm();
    });

    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            filterTasks();
        });
    });

    clearAllBtn.addEventListener('click', () => {
        clearAllTasks();
    });

    clearFinishedBtn.addEventListener('click', () => {
        clearFinishedTasks();
    });

    function addTask() {
        const title = taskTitle.value;
        const description = taskDescription.value;
        const priority = taskPriority.value;
        if (!title) return;

        const taskItem = document.createElement('div');
        taskItem.className = 'flex justify-between items-center p-2 border border-gray-400 rounded mb-2 shadow-sm';
        taskItem.innerHTML = `
            <div>
                <div class="text-black text-lg">${title}</div>
                <div class="text-black text-sm">${description} - ${priority}</div>
            </div>
            <div class="flex gap-2">
                <button class="bg-green-700 hover:bg-green-900 transition-colors duration-300 text-white p-2 rounded-md w-14 text-xs edit-task">Edit</button>
                <button class="bg-pink-600 hover:bg-pink-800 transition-colors duration-300 text-white p-2 rounded-md w-14 text-xs delete-task">Delete</button>
                <a href="promodoro.html" class="bg-blue-500 hover:bg-blue-700 transition-colors duration-300 text-white p-2 rounded-md w-20 text-xs text-center">Timer</a>
            </div>
        `;

        taskList.appendChild(taskItem);

        taskItem.querySelector('.edit-task').addEventListener('click', () => {
            editTask(taskItem, title, description, priority);
        });

        taskItem.querySelector('.delete-task').addEventListener('click', () => {
            taskItem.remove();
        });

        clearForm();
    }

    function clearForm() {
        taskTitle.value = '';
        taskDescription.value = '';
        taskPriority.value = 'Basse';
    }

    function filterTasks() {
        const filter = document.querySelector('input[name="filter"]:checked').id;
        const allTasks = taskList.querySelectorAll('div');

        allTasks.forEach(task => {
            task.style.display = 'block';
            if (filter === 'finishedTasks' && !task.classList.contains('finished')) {
                task.style.display = 'none';
            }
            if (filter === 'notFinishedTasks' && task.classList.contains('finished')) {
                task.style.display = 'none';
            }
        });
    }

    function clearAllTasks() {
        taskList.innerHTML = '';
    }

    function clearFinishedTasks() {
        const finishedTasks = taskList.querySelectorAll('.finished');
        finishedTasks.forEach(task => {
            task.remove();
        });
    }

    function editTask(taskItem, title, description, priority) {
        taskTitle.value = title;
        taskDescription.value = description;
        taskPriority.value = priority;

        taskItem.remove();
    }
});

/******************************Promodoro**********************************/

        document.addEventListener('DOMContentLoaded', () => {
            const timeDisplay = document.getElementById("timer");
            const startBtn = document.getElementById("start-btn");
            const pauseBtn = document.getElementById("pause-btn");
            const resetBtn = document.getElementById("reset-btn");
            const workTime = document.getElementById("work-time");
            const breakTime = document.getElementById("break-time");
            const alarmSound = document.getElementById("alarm-sound");
            const cycleCountDisplay = document.getElementById("cycle-count");

            let isRunning = false;
            let isWorking = true;
            let cycleCount = 0;
            let timeInterval;
            let timeRemaining;

            const DEFAULT_WORK_DURATION = 25 * 60;
            const SHORT_BREAK_DURATION = 5 * 60;
            const LONG_BREAK_DURATION = 15 * 60;
            let currentSessionDuration = DEFAULT_WORK_DURATION;

            timeRemaining = currentSessionDuration;
            updateDisplay(timeRemaining);
            cycleCountDisplay.textContent = `Completed Cycles: ${cycleCount}`;

            startBtn.addEventListener("click", startTimer);
            pauseBtn.addEventListener("click", pauseTimer);
            resetBtn.addEventListener("click", resetTimer);

            function startTimer() {
                if (!isRunning) {
                    isRunning = true;
                    if (!timeRemaining) {
                        timeRemaining = currentSessionDuration;
                    }
                    timeInterval = setInterval(() => {
                        if (timeRemaining > 0) {
                            timeRemaining--;
                            updateDisplay(timeRemaining);
                        } else {
                            clearInterval(timeInterval);
                            alarmSound.play().catch(err => console.log("Error playing sound:", err));
                            setTimeout(switchSession, 1000);
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
                isWorking = true;
                currentSessionDuration = workTime.value ? workTime.value * 60 : DEFAULT_WORK_DURATION;
                timeRemaining = currentSessionDuration;
                updateDisplay(timeRemaining);
                timeDisplay.style.color = 'black';
                toggleButtons();
            }

            function updateDisplay(seconds) {
                const minutes = Math.floor(seconds / 60);
                const sec = seconds % 60;
                timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
            }

            function toggleButtons() {
                startBtn.disabled = isRunning;
                pauseBtn.disabled = !isRunning;
                resetBtn.disabled = isRunning;
            }

            function switchSession() {
                if (isWorking) {
                    cycleCount++;
                    cycleCountDisplay.textContent = `Completed Cycles: ${cycleCount}`;
                    isWorking = false;
                    currentSessionDuration = breakTime.value === "long" ? LONG_BREAK_DURATION : SHORT_BREAK_DURATION;
                } else {
                    isWorking = true;
                    currentSessionDuration = workTime.value ? workTime.value * 60 : DEFAULT_WORK_DURATION;
                }
                timeRemaining = currentSessionDuration;
                updateDisplay(timeRemaining);
                isRunning = false;
                startTimer();
            }
        });

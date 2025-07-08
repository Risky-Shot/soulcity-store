const grid = document.getElementById("grid");
const timerEl = document.getElementById("timer");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restart");

let numbers = [...Array(19).keys()].map(n => n + 2); // numbers 2 to 20
let expected = 1;
let used = new Set();
let timeLeft = 25;
let timerInterval, shuffleInterval;

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderGrid() {
  grid.innerHTML = "";

  // Always render 1 at the top-left
  const first = document.createElement("div");
  first.className = "cell";
  first.textContent = 1;

  if (used.has(1)) {
    first.classList.add("used");
  } else if (expected === 1) {
    first.classList.add("selected");
  }

  first.onclick = () => handleClick(1);
  grid.appendChild(first);

  // Render shuffled 2–20
  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i];
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = num;

    if (used.has(num)) {
      div.classList.add("used");
    } else if (num === expected) {
      div.classList.add("selected");
    }

    div.onclick = () => handleClick(num);
    grid.appendChild(div);
  }
}

function handleClick(num) {
  if (num === expected) {
    used.add(num);
    expected++;

    if (expected > 20) {
      messageEl.textContent = "✅ You Won!";
      stopGame();
    }
  } else {
    // Wrong click, reset to 1
    // expected = 1;
    // used.add(expected);
    // expected = 2;
    messageEl.textContent = "❌ Wrong!";
    setTimeout(() => (messageEl.textContent = "---"), 1000);
    timeLeft = Math.max(0, timeLeft - 0.5); // prevent negative time
    updateProgressBar();
  }

  renderGrid();
}

function shuffleGrid() {
  shuffleArray(numbers);
  renderGrid();
}

function updateProgressBar() {
  const bar = document.getElementById("progress-bar");
  const percent = Math.max((timeLeft / 25) * 100, 0);
  bar.style.width = `${percent}%`;

  // Optional: Color changes as time decreases
  if (percent <= 30) {
    bar.style.backgroundColor = "red";
  } else if (percent <= 60) {
    bar.style.backgroundColor = "orange";
  } else {
    bar.style.backgroundColor = "limegreen";
  }
}

function startTimer() {
  timerEl.textContent = `Time: ${timeLeft}`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time: ${timeLeft}`;

    updateProgressBar();

    if (timeLeft <= 0) {
      messageEl.textContent = "⏰ Time's up!";
      stopGame();
    }
  }, 1000);
}

function stopGame() {
  clearInterval(timerInterval);
  clearInterval(shuffleInterval);

  // Disable further clicks
  document.querySelectorAll(".cell").forEach(cell => (cell.onclick = null));
}

function startGame() {
  clearInterval(timerInterval);
  clearInterval(shuffleInterval);

  used.clear();
  expected = 1;
  used.add(expected);
  expected = 2;
  timeLeft = 25;
  numbers = shuffleArray([...Array(19).keys()].map(n => n + 2)); // 2 to 20

  renderGrid();
  startTimer();
  shuffleInterval = setInterval(shuffleGrid, 2000);
  messageEl.textContent = "---"
}

restartBtn.onclick = startGame;

// Initial start
startGame();

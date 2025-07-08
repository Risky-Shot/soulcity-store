const grid = document.getElementById("grid");
const timerEl = document.getElementById("timer");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restart");

let numbers = [...Array(20).keys()].map(n => n + 1);
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
    used.clear();
    expected = 1;
    used.add(expected);
    expected = 2;
    messageEl.textContent = "❌ Wrong! Resetting...";
    setTimeout(() => (messageEl.textContent = ""), 1000);
  }

  renderGrid();
}

function shuffleGrid() {
  shuffleArray(numbers);
  renderGrid();
}

function startTimer() {
  timerEl.textContent = `Time: ${timeLeft}`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time: ${timeLeft}`;

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
  timeLeft = 23;
  numbers = shuffleArray([...Array(20).keys()].map(n => n + 1));

  renderGrid();
  startTimer();
  shuffleInterval = setInterval(shuffleGrid, 1500);
  messageEl.textContent = "";
}

restartBtn.onclick = startGame;

// Initial start
startGame();

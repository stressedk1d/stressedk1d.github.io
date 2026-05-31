const MAX_ATTEMPTS = 10;

const form = document.getElementById("guesser-form");
const inputField = document.getElementById("userInput");
const outputDiv = document.getElementById("output");
const attemptsDiv = document.getElementById("attempts");
const attemptsCount = document.getElementById("attempts-count");
const attemptsBar = document.getElementById("attempts-bar");
const rangeHint = document.getElementById("range-hint");
const historyRow = document.getElementById("history-row");
const restartBtn = document.getElementById("restartBtn");

let secretNumber = 0;
let attempts = 0;
let previousGuesses = [];
let minBound = 1;
let maxBound = 100;
let gameOver = false;

function initGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  previousGuesses = [];
  minBound = 1;
  maxBound = 100;
  gameOver = false;

  inputField.value = "";
  inputField.disabled = false;
  form.classList.remove("is-disabled");

  setMessage("Введи число и нажми «Угадать»", "info");
  attemptsDiv.innerHTML = "";
  historyRow.hidden = true;
  updateStats();
  inputField.focus();
}

function setMessage(text, type) {
  outputDiv.textContent = text;
  outputDiv.className = `status-msg status-msg--${type}`;
}

function updateStats() {
  attemptsCount.textContent = `${attempts} / ${MAX_ATTEMPTS}`;
  rangeHint.textContent = `${minBound} — ${maxBound}`;
  attemptsBar.style.width = `${(attempts / MAX_ATTEMPTS) * 100}%`;
}

function endGame(message, type) {
  gameOver = true;
  inputField.disabled = true;
  form.classList.add("is-disabled");
  setMessage(message, type);
}

function renderHistory(lastType) {
  historyRow.hidden = false;
  attemptsDiv.innerHTML = previousGuesses
    .map((num, index) => {
      let cls = "history-chip";
      if (index === previousGuesses.length - 1 && lastType) cls += ` history-chip--${lastType}`;
      return `<span class="${cls}">${num}</span>`;
    })
    .join("");
}

function guess(value) {
  if (gameOver) return;

  if (Number.isNaN(value) || value < 1 || value > 100) {
    setMessage("Введи число от 1 до 100.", "warn");
    return;
  }

  if (previousGuesses.includes(value)) {
    setMessage("Ты уже вводил это число.", "warn");
    return;
  }

  previousGuesses.push(value);
  attempts += 1;

  if (value === secretNumber) {
    renderHistory("win");
    updateStats();
    endGame(`🎉 Угадал! Число ${secretNumber} за ${attempts} ${pluralAttempts(attempts)}.`, "success");
    return;
  }

  if (value < secretNumber) {
    minBound = Math.max(minBound, value + 1);
    setMessage("📉 Меньше загаданного — попробуй больше.", "info");
    renderHistory("low");
  } else {
    maxBound = Math.min(maxBound, value - 1);
    setMessage("📈 Больше загаданного — попробуй меньше.", "info");
    renderHistory("high");
  }

  updateStats();
  inputField.value = "";

  if (attempts >= MAX_ATTEMPTS) {
    renderHistory("");
    endGame(`Попытки закончились. Загаданное число — ${secretNumber}.`, "error");
  }
}

function pluralAttempts(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "попытку";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "попытки";
  return "попыток";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  guess(parseInt(inputField.value, 10));
});

restartBtn.addEventListener("click", initGame);

initGame();

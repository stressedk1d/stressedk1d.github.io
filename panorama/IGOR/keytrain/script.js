const KEYS = ["A", "S", "D", "F", "G"];
const ARENA_HEIGHT = () => arena.clientHeight;
const KEY_SIZE = 48;
const FALL_SPEED = 2.2;

let pool = [];
let currentKey = "";
let score = 0;
let timer = 5;
let tickId = null;
let fallY = 0;
let playing = false;

const arena = document.getElementById("arena");
const fallingKey = document.getElementById("fallingKey");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const numberEl = document.getElementById("number");
const unusedEl = document.getElementById("unused");
const statusEl = document.getElementById("game-status");
const startBtn = document.getElementById("startGame");
const hintEl = document.getElementById("key-hint");

function setStatus(text, type) {
  if (!text) {
    statusEl.hidden = true;
    return;
  }
  statusEl.hidden = false;
  statusEl.textContent = text;
  statusEl.className = `status-msg status-msg--${type}`;
}

function updateUnused() {
  unusedEl.textContent = pool.length
    ? `Осталось: ${pool.join(", ")}`
    : "Все клавиши использованы!";
}

function resetRound() {
  if (!pool.length) {
    finishGame(`Игра окончена! Очки: ${score}`, "success");
    return true;
  }

  currentKey = pool[Math.floor(Math.random() * pool.length)];
  numberEl.textContent = currentKey;
  fallingKey.textContent = currentKey;
  fallingKey.className = "keytrain-target";
  fallY = 0;
  timer = 5;
  timerEl.textContent = timer;
  fallingKey.style.transform = `translateY(${fallY}px)`;
  fallingKey.style.left = `${20 + Math.random() * (arena.clientWidth - KEY_SIZE - 40)}px`;
  fallingKey.style.marginLeft = "0";
  hintEl.textContent = `Нажми «${currentKey}» на клавиатуре`;
  updateUnused();
  return false;
}

function stopLoop() {
  if (tickId) {
    cancelAnimationFrame(tickId);
    tickId = null;
  }
}

function gameLoop() {
  if (!playing) return;

  fallY += FALL_SPEED;
  fallingKey.style.transform = `translateY(${fallY}px)`;

  if (fallY >= ARENA_HEIGHT() - KEY_SIZE - 8) {
    playing = false;
    stopLoop();
    arena.classList.add("is-over");
    fallingKey.classList.add("is-miss");
    finishGame("Клавиша упала! Нажми Start, чтобы сыграть снова.", "error");
    return;
  }

  tickId = requestAnimationFrame(gameLoop);
}

function startTimer() {
  clearInterval(startTimer.id);
  startTimer.id = setInterval(() => {
    if (!playing) return;
    timer -= 1;
    timerEl.textContent = Math.max(timer, 0);
    if (timer <= 0) {
      playing = false;
      stopLoop();
      clearInterval(startTimer.id);
      arena.classList.add("is-over");
      fallingKey.classList.add("is-miss");
      finishGame("Время вышло! Нажми Start для новой игры.", "error");
    }
  }, 1000);
}

function finishGame(message, type) {
  playing = false;
  stopLoop();
  clearInterval(startTimer.id);
  arena.classList.remove("is-active");
  arena.classList.add("is-over");
  startBtn.textContent = "Играть снова";
  setStatus(message, type);
  hintEl.textContent = "Нажми «Играть снова»";
}

function startGame() {
  stopLoop();
  clearInterval(startTimer.id);
  pool = [...KEYS];
  score = 0;
  scoreEl.textContent = "0";
  playing = true;
  arena.classList.add("is-active");
  arena.classList.remove("is-over");
  startBtn.textContent = "Restart";
  setStatus("", "");

  if (resetRound()) return;

  startTimer();
  tickId = requestAnimationFrame(gameLoop);
}

startBtn.addEventListener("click", () => {
  if (!playing && arena.classList.contains("is-over")) {
    startGame();
    return;
  }
  startGame();
});

document.addEventListener("keydown", (event) => {
  if (!playing || !currentKey) return;

  const key = event.key.toUpperCase();
  if (key.length !== 1) return;

  if (key === currentKey) {
    score += Math.max(timer, 1);
    scoreEl.textContent = score;
    fallingKey.classList.add("is-hit");

    pool.splice(pool.indexOf(currentKey), 1);
    stopLoop();
    clearInterval(startTimer.id);

    setTimeout(() => {
      if (!playing) return;
      if (resetRound()) return;
      startTimer();
      tickId = requestAnimationFrame(gameLoop);
    }, 180);
    return;
  }

  setStatus(`Не та клавиша. Нужна «${currentKey}»`, "warn");
});

window.addEventListener("resize", () => {
  if (playing) {
    fallingKey.style.left = `${Math.min(parseFloat(fallingKey.style.left) || 0, arena.clientWidth - KEY_SIZE - 8)}px`;
  }
});

updateUnused();

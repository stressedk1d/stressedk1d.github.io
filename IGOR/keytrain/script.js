const listKeys = ['A', 'S', 'D', 'F', 'G'];
let currentKey = '';
let score = 0;
let timer = 5;
let intervalId;
let randnumber=0;


const fallingKeyElement = document.getElementById('fallingKey');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const numberElement = document.getElementById('number');
const unusedKeysElement = document.getElementById('unused');

function updateUnusedKeys() {
    unusedKeysElement.textContent = 'Неиспользованные клавиши: ' + listKeys.join(', ');
}

function startGame() {
    if (listKeys.length === 0) {
        alert('Игра окончена! Ваши очки: ' + score);
        listKeys.push('A', 'S', 'D', 'F', 'G');
        score = 0;
        return;
    }
   

    currentKey = listKeys[Math.floor(Math.random() * listKeys.length)];
    randnumber=listKeys.indexOf(currentKey);
    numberElement.textContent =randnumber;
    fallingKeyElement.textContent = currentKey;

    fallingKeyElement.style.top = '0px';
    fallingKeyElement.style.left = Math.random() * (300 - 50) + 'px';

    timer = 5;
    timerElement.textContent = timer;

    updateUnusedKeys();

    intervalId = setInterval(() => {
        timer--;
        timerElement.textContent = timer;

        if (timer <= 0) {
            alert('Время вышло! Игра окончена.');
            clearInterval(intervalId);
            return;
        }



        fallingKeyElement.style.top = parseInt(fallingKeyElement.style.top) + 5 + 'px';
       
        if (parseInt(fallingKeyElement.style.top) > 500) {
            alert('Клавиша пропала! Игра окончена.');
            clearInterval(intervalId);
            return;
        }
    }, 1000);
}


document.addEventListener('keydown', (event) => {
    if (event.key.toUpperCase() === currentKey) {
        score += timer;
        scoreElement.textContent = score;

        listKeys.splice(listKeys.indexOf(currentKey), 1);
        clearInterval(intervalId);
        startGame();
    }
});
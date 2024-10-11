const listKeys = ['Q', 'W', 'E', 'D', 'F'];
let currentKey = '';
let score = 0;
let timer = 5;
let intervalId; 


const fallingKeyElement = document.getElementById('fallingKey');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const outputElement = document.getElementById('output');



function startGame() {
    if (listKeys.length === 0) {
        outputElement.textContent='Игра окончена! Ваши очки: ' + score;
        return;
    }
   
    let nkey=Math.floor(Math.random() * listKeys.length);
    currentKey = listKeys[nkey];
    console.log[nkey];
    fallingKeyElement.textContent = currentKey;


    fallingKeyElement.style.top = '0px';
    fallingKeyElement.style.left = Math.random() * (300 - 50) + 'px'; // Случайная горизонтальная позиция


    timer = 5;
    timerElement.textContent = timer;


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

function Start() {
    startGame();
}

let useranswer;
function Check() {
    const answers = ['4', '2', '2', '4', '4', '2', '2', '4', '3', '1'];
    useranswers = [
        document.getElementById('a1').value,
        document.getElementById('a2').value,
        document.getElementById('a3').value,
        document.getElementById('a4').value,
        document.getElementById('a5').value,
        document.getElementById('a6').value,
        document.getElementById('a7').value,
        document.getElementById('a8').value,
        document.getElementById('a9').value,
        document.getElementById('a10').value
    ];

    let correctanswers = 0;

    for (let i = 0; i < answers.length; i++) {
        if (useranswers[i] === answers[i]) {
            document.getElementById(`q${i + 1}`).style.border = '4px solid green';
            correctanswers++;
        }
        else {
            document.getElementById(`q${i + 1}`).style.border = '4px solid red';
        }
    }


    if (correctanswers < 4) {
        mark = 2;
    }
    if (correctanswers < 7 && correctanswers > 4) {
        mark = 3;
    }
    if (correctanswers < 10 && correctanswers > 7) {
        mark = 4;
    }
    if (correctanswers > 9) {
        mark = 5;
    }


    document.getElementById('result').innerHTML = `Вы набрали ${correctanswers} из ${answers.length} правильных ответов, ваша оценка: ${mark}`;
    document.getElementById('result').hidden = false;
}

function saveCurrentResults() {
    const answers = {};
    for (let i = 1; i <= 10; i++) {
        const answerInput = document.getElementById('a' + i);
        answers['a' + i] = answerInput.value;
    }
    return answers;
}

function saveResults(name) {
    const currentResults = saveCurrentResults();
    let savedResults = JSON.parse(localStorage.getItem('allResults')) || {};
    savedResults[name] = currentResults;
    localStorage.setItem('allResults', JSON.stringify(savedResults));
    console.log(`Результаты с именем "${name}" сохранены`);
}

function loadResults() {
    const resultName = prompt("Введите имя сохраненных результатов:");
    const allResults = JSON.parse(localStorage.getItem('allResults')) || {};

    if (resultName in allResults) {
        const loadedResults = allResults[resultName];
        for (const key in loadedResults) {
            const answerInput = document.getElementById(key);
            if (answerInput) {
                answerInput.value = loadedResults[key];
            }
        }
        console.log(`Результаты с именем "${resultName}" загружены`);
    } else {
        console.log("Результаты с таким именем не найдены");
    }
}
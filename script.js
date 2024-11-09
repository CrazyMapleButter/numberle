let secretNumber;
let attemptsLeft = 6;
let gameOver = false;

function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function calculateDailySecretNumber() {
    const today = new Date();
    
    const seed = today.getUTCFullYear() * 10000 + (today.getUTCMonth() + 1) * 100 + today.getUTCDate();

    const randomNum = Math.floor(seededRandom(seed) * 9000) + 1000;
    return String(randomNum);
}

function startNewGame() {
    secretNumber = calculateDailySecretNumber();
    attemptsLeft = 6;
    gameOver = false;
    document.getElementById('attempts-count').textContent = attemptsLeft;
    document.getElementById('feedback-container').innerHTML = '';
    document.getElementById('guess').value = '';
    document.getElementById('restart-btn').style.display = 'none';
    document.getElementById('submit-btn').disabled = false;

    document.querySelectorAll('.number').forEach((element) => {
        element.classList.remove('green', 'yellow', 'gray');
    });
}

function getFeedback(guess, secret) {
    let feedback = [];
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === secret[i]) {
            feedback.push('green');
        } else if (secret.includes(guess[i])) {
            feedback.push('yellow');
        } else {
            feedback.push('gray');
        }
    }
    return feedback;
}

function updateNumberColors(guess, feedback) {
    const numberElements = document.querySelectorAll('.number');
    guess.split('').forEach((digit, index) => {
        const numberElement = Array.from(numberElements).find(
            (element) => element.dataset.number === digit
        );

        if (numberElement) {
            if (feedback[index] === 'green') {
                numberElement.classList.remove('yellow', 'gray');
                numberElement.classList.add('green');
            } else if (feedback[index] === 'yellow' && !numberElement.classList.contains('green')) {
                numberElement.classList.remove('gray');
                numberElement.classList.add('yellow');
            } else if (feedback[index] === 'gray' && !numberElement.classList.contains('green') && !numberElement.classList.contains('yellow')) {
                numberElement.classList.add('gray');
            }
        }
    });
}

document.getElementById('submit-btn').addEventListener('click', () => {
    if (gameOver) return;

    const guess = document.getElementById('guess').value;

    if (guess.length !== 4 || isNaN(guess)) {
        alert("Please enter a valid 4-digit number.");
        return;
    }

    const feedback = getFeedback(guess, secretNumber);
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackDiv = document.createElement('div');
    
    feedbackDiv.classList.add('feedback-item');
    
    for (let i = 0; i < guess.length; i++) {
        const feedbackBox = document.createElement('div');
        feedbackBox.classList.add('feedback-box', feedback[i]);
        feedbackBox.textContent = guess[i];
        feedbackDiv.appendChild(feedbackBox);
    }

    feedbackContainer.appendChild(feedbackDiv);
    updateNumberColors(guess, feedback);

    attemptsLeft--;
    document.getElementById('attempts-count').textContent = attemptsLeft;

    if (guess === secretNumber) {
        feedbackContainer.innerHTML += `<div class="feedback-item">Congratulations! You guessed the number!</div>`;
        gameOver = true;
        document.getElementById('submit-btn').disabled = true;
        document.getElementById('restart-btn').style.display = 'inline-block';
    } else if (attemptsLeft === 0) {
        feedbackContainer.innerHTML += `<div class="feedback-item">Game Over! The correct number was ${secretNumber}.</div>`;
        gameOver = true;
        document.getElementById('submit-btn').disabled = true;
        document.getElementById('restart-btn').style.display = 'inline-block';
    }

    document.getElementById('guess').value = '';
});

document.getElementById('restart-btn').addEventListener('click', () => {
    startNewGame();
});

startNewGame();

let secretNumber;
let attemptsLeft = 6;
let gameOver = false;

// Generate a fixed answer based on the current date
function generateDailySecretNumber() {
    const currentDate = new Date();
    const estOffset = currentDate.getTimezoneOffset() + 300; // Convert to EST (UTC-5)
    const estDate = new Date(currentDate.getTime() + estOffset * 60 * 1000);

    // Get the date components (year, month, day) to ensure the answer resets daily
    const year = estDate.getUTCFullYear();
    const month = estDate.getUTCMonth();
    const day = estDate.getUTCDate();

    // Create a unique seed for the day
    const seed = `${year}-${month + 1}-${day}`;

    // Use a simple hash function to generate a number between 1000 and 9999
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) % 10000;
    }

    // Ensure the number is 4 digits (pad with 1000 if necessary)
    return (hash + 1000).toString().slice(0, 4);
}

// Provide feedback for each guess
function getFeedback(guess, secret) {
    let feedback = [];
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === secret[i]) {
            feedback.push('green');  // Correct number and position
        } else if (secret.includes(guess[i])) {
            feedback.push('yellow');  // Correct number but wrong position
        } else {
            feedback.push('gray');  // Incorrect number
        }
    }
    return feedback;
}

// Update the number colors based on feedback
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

// Start a new game
function startNewGame() {
    secretNumber = generateDailySecretNumber();
    attemptsLeft = 6;
    gameOver = false;
    document.getElementById('attempts-count').textContent = attemptsLeft;
    document.getElementById('feedback-container').innerHTML = '';
    document.getElementById('guess').value = '';
    document.getElementById('restart-btn').style.display = 'none';
    document.getElementById('submit-btn').disabled = false;

    // Reset number colors
    document.querySelectorAll('.number').forEach((element) => {
        element.classList.remove('green', 'yellow', 'gray');
    });
}

// Handle the guess submission
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
    
    // Create feedback boxes for each digit in the guess
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

// Restart the game
document.getElementById('restart-btn').addEventListener('click', () => {
    startNewGame();
});

// Initialize the game
startNewGame();
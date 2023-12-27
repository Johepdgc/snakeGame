// Get the necessary elements from the DOM
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');

// Define constants
const boardSize = 10;
const gameSpeed = 100;
const squareTypes = {
    empySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
}
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowLeft: -1,
    ArrowRight: 1
};

// Declare variables
let snake;
let score;
let direction;
let boardSquares;
let empySquares;
let moveInterval;

// Draw the snake on the board
const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
}

// Draw a square on the board
const drawSquare = (square, type) => {
    const [ row, column ] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if(type === 'snakeSquare') {
        empySquares.push(square);
    } else {
        if(empySquares.indexOf(square) !== -1) {
            empySquares.splice(empySquares.indexOf(square), 1);
        }
    }
}

// Move the snake on the board
const moveSnake = () => {
    const newSquare = String(Number(snake[snake.length - 1]) + directions[direction]).padStart(2, '0');
    const [ row, column ] = newSquare.split('');

    // Check for collision with walls or snake body
    if( newSquare < 0 ||
        newSquare > boardSize * boardSize ||
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9) ||
        boardSquares[row][column] === squareTypes.snakeSquare) {
        gameOver();
    } else {
        snake.push(newSquare);
        if(boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const empySquare = snake.shift();
            drawSquare(empySquare, 'empySquare');
        }
        drawSnake();
    }
}

// Add food to the board
const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}

// Game over logic
const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval);
    startButton.disabled = false;
}

// Set the direction of the snake based on user input
const setDirection = newDirection => {
    direction = newDirection;
}

// Handle direction change events
const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction !== 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction !== 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction !== 'ArrowRight' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction !== 'ArrowLeft' && setDirection(key.code)
            break;
    }
}

// Create random food on the board
const createRandomFood = () => {
    const randomEmptySquare = empySquares[Math.floor(Math.random() * empySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}

// Update the score on the scoreboard
const updateScore = () => {
    scoreBoard.innerHTML = score;
}

// Create the game board
const createBoard = () => {
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columndex) => {
            const squareValue = `${rowIndex}${columndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('id', squareValue);
            squareElement.setAttribute('class', 'square empySquare');
            board.appendChild(squareElement);
            empySquares.push(squareValue);
        });
    });
}

// Set up the game
const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.empySquare));
    console.log(boardSquares);
    board.innerHTML = '';
    empySquares = [];
    createBoard();
}

// Start the game
const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.style.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval( () => moveSnake(), gameSpeed);
}

// Event listener for the start button
startButton.addEventListener('click', startGame);

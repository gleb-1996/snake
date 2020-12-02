'use strict';

const FIELD_WIDTH = 20;
const FIELD_HEIGHT = 20;
const SNAKE_SREED = 300;

let $snakeField;
let $snakeStart = document.querySelector('#snake-start');
let $snakeScore = document.querySelector('#score');
let snakeX;
let snakeY;
let snakeInterval;
let snakeDirection = 'up';
let score = 0;

let snake = [];

$snakeStart.addEventListener('click', handleGameStart);

(function() {
    buildGameField();

    window.addEventListener('keydown', handleDirectionChange);
})();

function handleGameStart(){
    respawn();

    snakeInterval = setInterval(move, SNAKE_SREED);

    createFood();
}

function handleDirectionChange(event) {
    switch (event.code) {
        case 'ArrowLeft':
            if (snakeDirection !== 'right') {
                snakeDirection = 'left';
            }
            break;
        case 'ArrowRight':
            if (snakeDirection !== 'left') {
                snakeDirection = 'right';
            }
            break;
        case 'ArrowUp':
            if (snakeDirection !== 'down') {
                snakeDirection = 'up';
            }
            break;
        case 'ArrowDown':
            if (snakeDirection !== 'up') {
                snakeDirection = 'down';
            }
            break;
    }
}

function move() {
    switch (snakeDirection) {
        case 'up':
            snakeY--;
            break;
        case 'down':
            snakeY++;
            break;
        case 'left':
            snakeX--;
            break;
        case 'right':
            snakeX++;
            break;
    }

    if (!inBounts()) {
        gameOver();
    }

    let $newUnit = $snakeField.children[snakeY].children[snakeX];

    if (!isSnake($newUnit)) {
        $newUnit.classList.add('snake-unit');
        snake.push($newUnit);

        if (!eatFood($newUnit)) {
            let $unitRemove = snake.shift();
            $unitRemove.classList.remove('snake-unit');
        }
    } else {
        gameOver();
    }
}

function gameOver() {
    clearInterval(snakeInterval);
    alert('Игра окончена!');

    window.location.reload();
}

function inBounts() {
    return snakeX >= 0 && snakeY >= 0 && snakeX <  FIELD_WIDTH && snakeY < FIELD_HEIGHT;
}

function isSnake($unit) {
    return $unit.classList.contains('snake-unit');
}

function eatFood($unit) {
    if ($unit.classList.contains('food-unit')) {
        $unit.classList.remove('food-unit');
        $snakeScore.textContent = ++score;

        createFood();

        return true;
    }

    return false;
}

function createFood() {
    while (true){
        let foodX = Math.floor(Math.random() * FIELD_WIDTH);
        let foodY = Math.floor(Math.random() * FIELD_HEIGHT);

        let $foodCell = $snakeField.children[foodY].children[foodX];

        if (!$foodCell.classList.contains('snake-unit')) {
            $foodCell.classList.add('food-unit');

            break;
        }
    }
}

function respawn() {
    snakeX = Math.floor(FIELD_WIDTH / 2);
    snakeY = Math.floor(FIELD_HEIGHT / 2);

    let $snakeHead = $snakeField.children[snakeY].children[snakeX];
    $snakeHead.classList.add('snake-unit');
    let $snakeTail = $snakeField.children[snakeY + 1].children[snakeX];
    $snakeTail.classList.add('snake-unit');

    snake.push($snakeTail);
    snake.push($snakeHead);
}

function buildGameField() {
    $snakeField = document.createElement('table');
    $snakeField.classList.add('game-table');
    let $fieldWrapper = document.querySelector('#snake-field');
    
    for (let i = 0; i <= FIELD_HEIGHT; i++) {
        let $row = document.createElement('tr');
        for (let j = 0; j <= FIELD_WIDTH; j++) {
            let $cell = document.createElement('td');
            $cell.classList.add('game-cell');

            $row.appendChild($cell);
        }

        $snakeField.appendChild($row);
    }

    $fieldWrapper.appendChild($snakeField);
}
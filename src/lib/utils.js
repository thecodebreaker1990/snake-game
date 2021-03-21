function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createBoard(BOARD_SIZE) {
    return Array.from({ length: BOARD_SIZE }, 
        (_, rowIdx) => Array.from({ length: BOARD_SIZE }, (_, cellIdx) => (BOARD_SIZE * rowIdx) + cellIdx + 1)
    );
}

export { randomIntFromInterval, createBoard };
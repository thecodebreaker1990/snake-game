function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createBoard(BOARD_SIZE) {
    return Array.from({ length: BOARD_SIZE }, 
        (_, rowIdx) => Array.from({ length: BOARD_SIZE }, (_, cellIdx) => (BOARD_SIZE * rowIdx) + cellIdx + 1)
    );
}

function getStartingSnakeLLValue(board) {
    const rows = board.length, cols = board[0].length;
    const startingRow = Math.round(rows / 3), startingCol = Math.round(cols / 3);
    const startingCellvalue = board[startingRow][startingCol];
    return { 
        row: startingRow,
        col: startingCol,
        cell: startingCellvalue
    }
}

export { randomIntFromInterval, createBoard, getStartingSnakeLLValue };
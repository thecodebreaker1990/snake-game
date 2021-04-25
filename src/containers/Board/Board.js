import React, { Component } from "react";
import { randomIntFromInterval, createBoard, getStartingSnakeLLValue } from "../../lib/utils";
import LinkedList from "../../lib/SinglyLinkedList";

import moveAudio from "../../assets/audio/player-move.wav";
import gameOverAudio from "../../assets/audio/game-over.wav";
import foodConsumedAudio from "../../assets/audio/food-consumption.wav";

import classes from "./Board.module.css";

const BOARD_SIZE = 15;
const Direction = {
    LEFT: "left",
    RIGHT: "right",
    UP: "up",
    DOWN: "down"
};

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: [],
            snakeCells: null,
            foodCell: null,
            snake: null,
            direction: Direction.RIGHT,
            score: 0
        }
    }

    componentDidMount() {
        const board = createBoard(BOARD_SIZE);
        const snake = new LinkedList().push(getStartingSnakeLLValue(board));
    
        this.setState({ 
           board, 
           snake,
           snakeCells: new Set([snake.tail.value.cell]), 
           foodCell: snake.tail.value.cell + 5 
        });

        //Handle key press events
        window.addEventListener("keydown", (event) => {
            this.handleKeyDown(event);
        });

    //    this.timerID = setInterval(() => {
    //        this.moveSnake();
    //    }, 250);
    }

    moveSnake() {
        const { snake, snakeCells, foodCell, direction, board } = this.state;
        const { value: { row, col } } = snake.tail;
        const currentHeadCoords = { row, col };

        //Get next head co ordinates and values
        const nextHeadCoords = geCoordsInDirection(currentHeadCoords, direction);
        //Check if Snake has hit the boundary
        if(isOutOfBounds(nextHeadCoords, board)) {
            this.handleGameOver();
            return;
        }
        const nextHeadCell = board[nextHeadCoords.row][nextHeadCoords.col];
        //Check if snake will run into itself
        if(snakeCells.has(nextHeadCell)) {
            this.handleGameOver();
            return;
        }

        const newHead = snake.push({ row: nextHeadCoords.row, col: nextHeadCoords.col, cell: nextHeadCell });
        
        const newSnakeCells = new Set(snakeCells);
        newSnakeCells.delete(snake.head.value.cell);
        newSnakeCells.add(nextHeadCell);

        //Update tail
        snake.shift();

        //Check if nextHeadCell is going to be the foodCell
        if(nextHeadCell === foodCell) {
            //This function mutates snake cells
            this.growSnake(newSnakeCells);
            this.handleFoodConsumption(foodCell, snakeCells);
        }

        this.setState({
            snakeCells: newSnakeCells,
            snake: newHead
        });
    }

    growSnake(newSnakeCells) {
        const { snake, direction, board } = this.state;
        const { row, col } = getGrowthNodeCoords(snake.head, direction);
        const newTailCell = board[row][col];
        //Update the tail of the snake
        snake.unshift({ row, col, cell: newTailCell });
        //Add this cell to snake cell
        newSnakeCells.add(newTailCell);
    }

    handleFoodConsumption(currentFoodCell, snakeCells) {
        const maxvalue = BOARD_SIZE * BOARD_SIZE;
        let nextFoodCell;
        while(true) {
            nextFoodCell = randomIntFromInterval(1, maxvalue);
            if(snakeCells.has(nextFoodCell) || nextFoodCell === currentFoodCell) continue;
            break;
        }
        this.setState((state) => ({ foodCell: nextFoodCell, score: state.score + 1 }), () => {
            const foodConsumedMusic = new Audio(foodConsumedAudio);
            foodConsumedMusic.play();
        });
    }

    handleKeyDown(e) {
        const newDirection = getDirectionFromKey(e.code);
        const isValidDirection = newDirection !== '';
        if(!isValidDirection) return;
        const { direction, snakeCells } = this.state;
        const snakeWillRunIntoItself = getOppositeDirection(newDirection) === direction && snakeCells.size > 1;
        if(snakeWillRunIntoItself) return;
        this.setState({ direction: newDirection }, () => {
            const moveMusic = new Audio(moveAudio);
            moveMusic.play();
        });
    }

    handleGameOver() {
        clearInterval(this.timerID);
        const { board } = this.state;
        const snake = new LinkedList().push(getStartingSnakeLLValue(board));
        this.setState({ 
            score: 0, 
            snake,
            snakeCells: new Set([snake.tail.value.cell]), 
            foodCell: snake.tail.value.cell + 5,
            direction: Direction.RIGHT  
        });
        this.timerID = setInterval(() => { this.moveSnake(); }, 250);
    }

    render() {
        const { board, foodCell, snakeCells, score } = this.state;
        return <main className={classes.Gamearea}>
            <div className={classes.Gamearea__score}>
                <span className={classes.Emoji}>&#127942;</span>
                <span className={classes.Score}>{ score }</span>
            </div>
            <div className={classes.Board}>
            {
                board.map((row, rowIdx) => 
                    <div key={rowIdx} className={classes.Board__row}>
                        {
                            row.map((cellValue, cellIdx) => 
                                <div key={cellIdx} className={getClassNames(cellValue, foodCell, snakeCells)}></div>
                            )
                        }
                    </div>
                )
            }
            </div>
        </main>;
    }
}

const getClassNames = (cellValue, foodCell, snakeCells) => {
    let classNames = [classes.Board__cell];
    classNames.push((cellValue + 1) % 2 === 0 ? classes['Board__cell--light'] : classes['Board__cell--dark']);
    if(cellValue === foodCell) {
        classNames.push(classes['Board__cell--food']); 
    }
    if(snakeCells.has(cellValue)) {
        classNames.push(classes['Board__cell--snake']); 
    }
    return classNames.join(' ');
};

const getGrowthNodeCoords = (snakeTail, currentDirection) => {
    const tailNextNodeDirection = getNextNodeDirection(snakeTail, currentDirection);
    const growthDirection = getOppositeDirection(tailNextNodeDirection);
    const currentTailCoords = { row: snakeTail.value.row, col: snakeTail.value.col };
    return geCoordsInDirection(currentTailCoords, growthDirection);
};

const getNextNodeDirection = (node, currentDirection) => {
    if(node.next === null) return currentDirection;
    const { row: currentRow, col: currentCol } = node.value;
    const { row: nextRow, col: nextCol } = node.next.value;
    if(currentRow === nextRow && nextCol === currentCol + 1) return Direction.RIGHT;
    else if(currentRow === nextRow && nextCol === currentCol - 1) return Direction.LEFT;
    else if(currentCol === nextCol && nextRow === currentRow + 1) return Direction.DOWN;
    else if(currentCol === nextCol && nextRow === currentRow - 1) return Direction.UP;
};

const getOppositeDirection = (currentDirection) => {
    switch (currentDirection) {
        case Direction.UP:
            return Direction.DOWN;
        case Direction.DOWN: 
            return Direction.UP;
        case Direction.LEFT:
            return Direction.RIGHT;
        default:
            return Direction.LEFT;
    }
};

const geCoordsInDirection = (coords, direction) => {
    let updatedCoords = {};
    const { row, col } = coords;
    switch (direction) {
        case Direction.UP:
            updatedCoords = { row: row - 1, col };
            break;
        case Direction.DOWN:
            updatedCoords = { row: row + 1, col };
            break;
        case Direction.LEFT:
            updatedCoords = { row, col: col - 1 };
            break;
        case Direction.RIGHT: 
            updatedCoords = { row, col: col + 1 };
            break;
        default:
            break;
    }
    return updatedCoords;
};

const getDirectionFromKey = (keyCode) => {
    let result = '';
    switch (keyCode) {
        case "ArrowUp":
            result = Direction.UP;
            break;
        case "ArrowDown":
            result = Direction.DOWN;
            break;
        case "ArrowLeft":
            result = Direction.LEFT;
            break;
        case "ArrowRight":
            result = Direction.RIGHT;
            break;
        default:
            break;
    }
    return result;
}

const isOutOfBounds = (coords, board) => {
    const { row, col } = coords;
    if(row < 0 || col < 0) return true;
    if(row >= board.length || col >= board[0].length) return true;
    return false;
}

export default Board;
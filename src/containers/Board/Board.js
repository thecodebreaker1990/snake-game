import React, { Component } from "react";
import { randomIntFromInterval, createBoard, getStartingSnakeLLValue } from "../../lib/utils";
import LinkedList from "../../lib/SinglyLinkedList";

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
            direction: Direction.RIGHT
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
            const newDirection = this.handleKeyboardEvent(event.code);
            if(newDirection !== ''){
                this.setState({ direction: newDirection });
            }
        });

       setInterval(() => {
           this.moveSnake();
       }, 1000);
    }

    moveSnake() {
        const { snake, snakeCells, foodCell, direction, board } = this.state;
        const { value: { row, col } } = snake.tail;
        const currentHeadCoords = { row, col };

        //Get next head co ordinates and values
        const nextHeadCoords = geCoordsInDirection(currentHeadCoords, direction);
        const nextHeadCell = board[nextHeadCoords.row][nextHeadCoords.col];

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
        this.setState({ foodCell: nextFoodCell });
    }

    handleKeyboardEvent(keyCode) {
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

    render() {
        const { board, foodCell, snakeCells } = this.state;
        return <div className={classes.Board}>
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
    }
}

const getClassNames = (cellValue, foodCell, snakeCells) => {
    let classNames = [classes.Board__cell];
    if(cellValue === foodCell) {
        classNames.push(classes['Board__cell--red']); 
    }
    if(snakeCells.has(cellValue)) {
        classNames.push(classes['Board__cell--green']); 
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
            updatedCoords = { row: row - 1 < 0 ? BOARD_SIZE - 1 : row - 1, col };
            break;
        case Direction.DOWN:
            updatedCoords = { row: row + 1 >= BOARD_SIZE ? 0 : row + 1, col };
            break;
        case Direction.LEFT:
            updatedCoords = { row, col: col - 1 < 0 ? BOARD_SIZE - 1: col - 1 };
            break;
        case Direction.RIGHT: 
            updatedCoords = { row, col: col + 1 >= BOARD_SIZE ? 0 : col + 1 };
            break;
        default:
            break;
    }
    return updatedCoords;
};

export default Board;
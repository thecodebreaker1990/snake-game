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
           snakeCells: new Set([snake.head.value.cell]), 
           foodCell: snake.head.value.cell + 5 
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
        const { value: { row, col } } = snake.head;
        const currentHeadCoords = { row, col };

        //Get next head co ordinates and values
        const nextHeadCoords = this.getNextHeadCoords(currentHeadCoords, direction);
        const nextHeadCell = board[nextHeadCoords.row][nextHeadCoords.col];

        //Check if nextHeadCell is going to be the foodCell
        if(nextHeadCell === foodCell) {
            this.handleFoodConsumption(foodCell, snakeCells);
        }

        const newHead = snake.unshift({ row: nextHeadCoords.row, col: nextHeadCoords.col, cell: nextHeadCell });
        
        const newSnakeCells = new Set(snakeCells);
        newSnakeCells.delete(snake.tail.value.cell);
        newSnakeCells.add(nextHeadCell);

        //Update tail
        snake.pop();

        this.setState({
            snakeCells: newSnakeCells,
            snake: newHead
        });
    }

    getNextHeadCoords(currentHeadCoords, direction) {
        let updatedHeadCoords = {};
        const { row, col } = currentHeadCoords;
        switch (direction) {
            case Direction.UP:
                updatedHeadCoords = { row: row - 1 < 0 ? BOARD_SIZE - 1 : row - 1, col };
                break;
            case Direction.DOWN:
                updatedHeadCoords = { row: row + 1 >= BOARD_SIZE ? 0 : row + 1, col };
                break;
            case Direction.LEFT:
                updatedHeadCoords = { row, col: col - 1 < 0 ? BOARD_SIZE - 1: col - 1 };
                break;
            case Direction.RIGHT: 
                updatedHeadCoords = { row, col: col + 1 >= BOARD_SIZE ? 0 : col + 1 };
                break;
            default:
                break;
        }
        return updatedHeadCoords;
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
}

export default Board;
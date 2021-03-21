import React, { Component } from "react";
import { createBoard } from "../../lib/utils";

import classes from "./Board.module.css";

const BOARD_SIZE = 10;

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: [],
            snakeCells: null
        }
    }

    componentDidMount() {
       this.setState({
           board: createBoard(BOARD_SIZE),
           snakeCells: new Set([44])
       });
    }

    render() {
        const { board, snakeCells } = this.state;
        return <div className={classes.Board}>
            {
                board.map((row, rowIdx) => 
                    <div key={rowIdx} className={classes.Board__row}>
                        {
                            row.map((counter, cellIdx) => {
                                const classArr = [classes.Board__cell, snakeCells.has(counter) ? classes['Board__snake-cell'] : ''];
                                return <div key={cellIdx} className={classArr.join(' ')}>
                                    { counter }
                                </div>;
                            })
                        }
                    </div>
                )
            }
        </div>
    }
}

export default Board;
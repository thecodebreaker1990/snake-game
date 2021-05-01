import React from "react";

import classes from "./Landing.module.css";

const landing = props => {
    return <div className={classes.Landing}>
        <div className={classes.Landing__body}>
            <span style={{'font-size': '100px'}}>&#128013;</span>
        </div>
        <div className={classes.Landing__footer}>
            <button className={classes.Start_Btn} onClick={props.start}>
                Play Game
            </button>
        </div>
    </div>
}

export default landing;
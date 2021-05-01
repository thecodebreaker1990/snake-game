import React from "react";

import classes from "./Landing.module.css";

const landing = props => {
    return <div className={classes.Landing}>
        <div className={classes.Landing__body}>
            <div style={{fontSize: '100px'}}>&#128013;</div>
        </div>
        <div className={classes.Landing__footer}>
            <button className={classes.Start_Btn} onClick={props.start}>
                { props.buttonText }
            </button>
        </div>
    </div>
}

export default landing;
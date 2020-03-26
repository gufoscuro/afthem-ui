import React from 'react';

import './Dialog.css';


const PopupMessage = (props) => {
    return (
        <div className="Dialog">
            <div className="panel-content">
                <div className="heading">{props.heading}</div>
                <div className="text">{props.text}</div>
            </div>
            <div className="panel-ctrls animated slideInDown">
                {/* <button className="btn btn-danger btn-sm" onClick={props.clickHandler.bind (this, false)}>Cancel</button> */}
                <button className="btn btn-primary btn-sm" onClick={props.clickHandler.bind (this, true)}>Close message</button>
            </div>
        </div>
    );
}

export default PopupMessage;
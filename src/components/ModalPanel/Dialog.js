import React from 'react';
// import FadeinFX from '../../hoc/FadeinFX';

import './Dialog.css';


const dialog = (props) => {
    return (
        <div className="Dialog">
            <div className="panel-content">
                <div className="heading">{props.heading}</div>
                <div className="text">{props.text}</div>
            </div>
            <div className="panel-ctrls animated slideInDown">
                <button className="btn btn-danger btn-sm" onClick={props.clickHandler.bind (this, false)}>Annulla</button>
                <button className="btn btn-primary btn-sm" onClick={props.clickHandler.bind (this, true)}>Conferma</button>
            </div>
        </div>
    );
}

export default dialog;
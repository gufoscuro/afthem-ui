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
            <div className="panel-ctrls animated softFadeInUp">
                <button className="btn btn-danger btn-sm" onClick={props.clickHandler.bind (this, false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={props.clickHandler.bind (this, true)}>Confirm</button>
            </div>
        </div>
    );
}

export default dialog;
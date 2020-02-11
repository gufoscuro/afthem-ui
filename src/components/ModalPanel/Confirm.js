import React from 'react';

import './Confirm.css';


const confirm = (props) => {
    return (
        <div className={"Confirm" + (props.active ? ' active' : '')}>
            <div className="confirm-panel">
                <div className="disc animated bounceIn">
                    <i className="far fa-check"></i>
                </div>
            </div>
        </div>
    );
}

export default confirm;
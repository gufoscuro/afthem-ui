import React from 'react';

import './InstrumentsButton.css'


const instrumentsButton = (props) => {
    let clsses = [],
        icon,
        label,
        not_disabled = props.disabled === undefined || props.disabled === false,
        status = {
            action: props.action,
            disabled: props.disabled
        };

    if (props.option && typeof (props.options) === 'object')
        status = { ...status, ...props.options };

    if (props.clsses)
        clsses.push (props.clsses);


    if (props.disabled)
        clsses.push ('disabled');
    if (props.active)
        clsses.push ('active');
    if (props.hidden)
        clsses.push ('hidden');

    if (props.icon) {
        icon = (
            <i className={"icn far fa-" + props.icon}></i>
        );
    }

    if (props.label) {
        label = (
            <span className="label">{props.label}</span>
        );
    }
    

    return (
        <div 
            className={"instruments-button " + clsses.join (' ')} 
            onClick={() => { if (not_disabled) props.clickHandler (status) }}>
            {icon}
            {label}
        </div>
    );
}

export default instrumentsButton;
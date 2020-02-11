import React from 'react';

import './InstrumentsTab.css'


const instrumentsTab = (props) => {
    let clsses = [],
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

    

    return (
        <div 
            className={"instruments-tab " + clsses.join (' ')} 
            onClick={() => { if (not_disabled) props.clickHandler (status) }}>
            {props.label}
        </div>
    );
}

export default instrumentsTab;
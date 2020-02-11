import React from 'react';

import './NavbarButton.css'


const navbarButton = (props) => {
    let clsses = [],
        badge;

    if (props.badge) {
        clsses.push ('with-badge');
        badge = (
            <div className="badge-count animated zoomIn">{props.badge}</div>
        );
    }

    if (props.clsses)
        clsses.push (props.clsses);


    if (props.disabled)
        clsses.push ('disabled');
    if (props.active)
        clsses.push ('active');

    return (
        <div 
            className={"navbar-button " + clsses.join (' ')} 
            onClick={props.clickHandler.bind (this, props.action)}>
            <i className={"far fa-" + props.icon}></i> {badge}
        </div>
    );
}

export default navbarButton;
import React from 'react';

import './NavbarButton.css'


const navbarButton = (props) => {
    let {
            action, 
            active, 
            disabled, 
            classes, 
            badge, 
            icon, 
            clickHandler 
        } = props,
        clsses = [], 
        badge_renderer;

    if (badge) {
        clsses.push ('with-badge');
        badge_renderer = (
            <div className="badge-count animated zoomIn">{badge}</div>
        );
    }

    if (classes)
        clsses.push (classes);


    if (disabled)
        clsses.push ('disabled');
    if (active)
        clsses.push ('active');

    return (
        <div 
            className={"navbar-button " + ' ' + clsses.join (' ')} 
            onClick={event => { if (disabled !== true && clickHandler !== undefined) clickHandler (action, event) }}>
            <i className={"far fa-" + icon}></i> {badge_renderer}
        </div>
    );
}

export default navbarButton;
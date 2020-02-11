import React from 'react';

import './NavbarLink.css'


const navbarLink = (props) => {
    return (
        <div 
            className={"navbar-button" + (props.disabled ? " disabled" : "")} 
            onClick={props.clickHandler.bind (this, props.action)}>
            <i className={"far fa-" + props.icon}></i>
        </div>
    );
}

export default navbarLink;